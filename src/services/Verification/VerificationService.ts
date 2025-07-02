import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocationService } from '../Location/LocationService.js';
// @ts-ignore - crypto-js doesn't have types but is commonly used
import CryptoJS from 'crypto-js';

export interface Verification {
  id: string;
  reportId: string;
  verifierHash: string; // Anonymous verifier identifier
  verificationTime: number;
  proximityScore: number; // How close verifier was to incident (0-1)
  trustScore: number; // Verifier's trust score (0-1)
  verificationStrength: 'weak' | 'medium' | 'strong';
  metadata: {
    userDistance: number; // Distance from report location
    timeToVerify: number; // Time between report and verification
    deviceHash: string; // For rate limiting
  };
}

export interface VerificationSummary {
  reportId: string;
  totalVerifications: number;
  trustWeightedScore: number; // Weighted by verifier trust scores
  proximityWeightedScore: number; // Weighted by distance proximity
  verificationStrength: 'unverified' | 'weak' | 'medium' | 'strong' | 'verified';
  lastVerification: number;
  topVerifiers: string[]; // Anonymous hashes of most trusted verifiers
}

export interface UserTrustProfile {
  deviceHash: string;
  trustScore: number; // 0-1, starts at 0.5
  verificationsSubmitted: number;
  verificationsReceived: number; // How many of their reports were verified
  reliabilityScore: number; // Based on verification accuracy
  joinDate: number;
  lastActivity: number;
}

const STORAGE_KEYS = {
  VERIFICATIONS: '@verifications',
  USER_TRUST: '@user_trust',
  VERIFICATION_LIMITS: '@verification_limits',
  DEVICE_ID: '@verification_device_id'
};

const VERIFICATION_RULES = {
  MAX_VERIFICATIONS_PER_DAY: 20,
  MAX_VERIFICATIONS_PER_REPORT: 1, // One per user per report
  MIN_DISTANCE_FOR_VERIFICATION: 10000, // 10km max distance to verify
  VERIFICATION_COOLDOWN_MINUTES: 2, // 2 minutes between verifications
  TRUST_SCORE_DECAY_DAYS: 30, // Trust slowly decays if inactive
  MIN_TRUST_FOR_STRONG_VERIFICATION: 0.7,
  PROXIMITY_WEIGHT: 0.3, // Weight of proximity in scoring
  TRUST_WEIGHT: 0.7, // Weight of trust in scoring
};

export class VerificationService {
  private static deviceId: string | null = null;
  private static userTrustProfile: UserTrustProfile | null = null;

  /**
   * Initialize verification service
   */
  static async initialize(): Promise<void> {
    try {
      await this.getOrCreateDeviceId();
      await this.getOrCreateTrustProfile();
      console.log('✅ Verification service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize verification service:', error);
    }
  }

  /**
   * Get or create anonymous device identifier
   */
  private static async getOrCreateDeviceId(): Promise<string> {
    if (this.deviceId) return this.deviceId;

    try {
      const deviceId = await AsyncStorage.getItem(STORAGE_KEYS.DEVICE_ID);
      
      if (!deviceId) {
        const timestamp = Date.now().toString();
        const random = Math.random().toString();
        const newDeviceId = CryptoJS.SHA256(timestamp + random).toString();
        await AsyncStorage.setItem(STORAGE_KEYS.DEVICE_ID, newDeviceId);
        this.deviceId = newDeviceId;
        return newDeviceId;
      }

      this.deviceId = deviceId;
      return deviceId;
    } catch (error) {
      console.error('Failed to get device ID:', error);
      const fallbackId = CryptoJS.SHA256(Date.now().toString()).toString();
      this.deviceId = fallbackId;
      return fallbackId;
    }
  }

  /**
   * Get or create user trust profile
   */
  private static async getOrCreateTrustProfile(): Promise<UserTrustProfile> {
    if (this.userTrustProfile) return this.userTrustProfile;

    try {
      const deviceId = await this.getOrCreateDeviceId();
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.USER_TRUST);
      
      if (stored) {
        const profile = JSON.parse(stored) as UserTrustProfile;
        this.userTrustProfile = profile;
        return profile;
      }

      // Create new trust profile
      const newProfile: UserTrustProfile = {
        deviceHash: CryptoJS.SHA256(deviceId).toString().substring(0, 16),
        trustScore: 0.5, // Start with neutral trust
        verificationsSubmitted: 0,
        verificationsReceived: 0,
        reliabilityScore: 0.5,
        joinDate: Date.now(),
        lastActivity: Date.now()
      };

      await AsyncStorage.setItem(STORAGE_KEYS.USER_TRUST, JSON.stringify(newProfile));
      this.userTrustProfile = newProfile;
      return newProfile;
    } catch (error) {
      console.error('Failed to get trust profile:', error);
      throw new Error('Failed to initialize trust profile');
    }
  }

  /**
   * Check if user can verify a specific report
   */
  static async canVerifyReport(
    reportId: string, 
    reportLocation: { latitude: number; longitude: number },
    userLocation: { latitude: number; longitude: number }
  ): Promise<{ allowed: boolean; reason?: string; details?: any }> {
    try {
      const deviceId = await this.getOrCreateDeviceId();
      
      // Check distance - user must be reasonably close to verify
      const distance = LocationService.calculateDistance(userLocation, reportLocation);
      if (distance > VERIFICATION_RULES.MIN_DISTANCE_FOR_VERIFICATION / 1000) {
        return {
          allowed: false,
          reason: `Too far from incident location (${distance.toFixed(1)}km away)`,
          details: { distance, maxDistance: VERIFICATION_RULES.MIN_DISTANCE_FOR_VERIFICATION / 1000 }
        };
      }

      // Check if already verified this report
      const verifications = await this.getVerifications();
      const userHash = CryptoJS.SHA256(deviceId).toString().substring(0, 16);
      const existingVerification = verifications.find(v => 
        v.reportId === reportId && v.verifierHash === userHash
      );
      
      if (existingVerification) {
        return {
          allowed: false,
          reason: 'You have already verified this report'
        };
      }

      // Check daily limit
      const today = new Date().toDateString();
      const todayVerifications = verifications.filter(v => 
        v.verifierHash === userHash && 
        new Date(v.verificationTime).toDateString() === today
      );

      if (todayVerifications.length >= VERIFICATION_RULES.MAX_VERIFICATIONS_PER_DAY) {
        return {
          allowed: false,
          reason: `Daily verification limit reached (${VERIFICATION_RULES.MAX_VERIFICATIONS_PER_DAY} per day)`
        };
      }

      // Check cooldown
      const lastVerification = verifications
        .filter(v => v.verifierHash === userHash)
        .sort((a, b) => b.verificationTime - a.verificationTime)[0];

      if (lastVerification) {
        const timeSinceLastVerification = Date.now() - lastVerification.verificationTime;
        const cooldownMs = VERIFICATION_RULES.VERIFICATION_COOLDOWN_MINUTES * 60 * 1000;
        
        if (timeSinceLastVerification < cooldownMs) {
          const waitTime = Math.ceil((cooldownMs - timeSinceLastVerification) / 60000);
          return {
            allowed: false,
            reason: `Please wait ${waitTime} minutes before verifying another report`,
            details: { waitTime }
          };
        }
      }

      return { allowed: true };
    } catch (error) {
      console.error('Error checking verification eligibility:', error);
      return { allowed: false, reason: 'Unable to verify at this time' };
    }
  }

  /**
   * Submit a verification for a report
   */
  static async verifyReport(
    reportId: string,
    reportLocation: { latitude: number; longitude: number },
    reportTimestamp: number,
    userLocation: { latitude: number; longitude: number }
  ): Promise<{ success: boolean; error?: string; verification?: Verification }> {
    try {
      // Check if verification is allowed
      const eligibilityCheck = await this.canVerifyReport(reportId, reportLocation, userLocation);
      if (!eligibilityCheck.allowed) {
        return { success: false, error: eligibilityCheck.reason };
      }

      const deviceId = await this.getOrCreateDeviceId();
      const trustProfile = await this.getOrCreateTrustProfile();
      const verifierHash = CryptoJS.SHA256(deviceId).toString().substring(0, 16);
      
      // Calculate verification metadata
      const userDistance = LocationService.calculateDistance(userLocation, reportLocation);
      const timeToVerify = Date.now() - reportTimestamp;
      
      // Calculate proximity score (closer = better, max 10km)
      const proximityScore = Math.max(0, 1 - (userDistance / (VERIFICATION_RULES.MIN_DISTANCE_FOR_VERIFICATION / 1000)));
      
      // Determine verification strength based on trust and proximity
      let verificationStrength: 'weak' | 'medium' | 'strong';
      const combinedScore = (trustProfile.trustScore * VERIFICATION_RULES.TRUST_WEIGHT) + 
                           (proximityScore * VERIFICATION_RULES.PROXIMITY_WEIGHT);
      
      if (combinedScore >= 0.8) {
        verificationStrength = 'strong';
      } else if (combinedScore >= 0.6) {
        verificationStrength = 'medium';
      } else {
        verificationStrength = 'weak';
      }

      // Create verification
      const verification: Verification = {
        id: CryptoJS.SHA256(deviceId + reportId + Date.now().toString()).toString().substring(0, 12),
        reportId,
        verifierHash,
        verificationTime: Date.now(),
        proximityScore,
        trustScore: trustProfile.trustScore,
        verificationStrength,
        metadata: {
          userDistance,
          timeToVerify,
          deviceHash: verifierHash
        }
      };

      // Save verification
      await this.saveVerification(verification);

      // Update user trust profile
      await this.updateTrustProfile({
        ...trustProfile,
        verificationsSubmitted: trustProfile.verificationsSubmitted + 1,
        lastActivity: Date.now(),
        // Slightly increase trust for active participation
        trustScore: Math.min(1.0, trustProfile.trustScore + 0.01)
      });

      console.log('✅ Report verification submitted:', {
        reportId,
        strength: verificationStrength,
        proximity: proximityScore.toFixed(2),
        trust: trustProfile.trustScore.toFixed(2)
      });

      return { success: true, verification };
    } catch (error) {
      console.error('Error verifying report:', error);
      return { success: false, error: 'Failed to submit verification' };
    }
  }

  /**
   * Get verification summary for a report
   */
  static async getVerificationSummary(reportId: string): Promise<VerificationSummary> {
    try {
      const verifications = await this.getVerifications();
      const reportVerifications = verifications.filter(v => v.reportId === reportId);

      if (reportVerifications.length === 0) {
        return {
          reportId,
          totalVerifications: 0,
          trustWeightedScore: 0,
          proximityWeightedScore: 0,
          verificationStrength: 'unverified',
          lastVerification: 0,
          topVerifiers: []
        };
      }

      // Calculate weighted scores
      const totalTrustWeight = reportVerifications.reduce((sum, v) => sum + v.trustScore, 0);
      const totalProximityWeight = reportVerifications.reduce((sum, v) => sum + v.proximityScore, 0);
      
      const trustWeightedScore = totalTrustWeight / reportVerifications.length;
      const proximityWeightedScore = totalProximityWeight / reportVerifications.length;
      
      // Determine overall verification strength
      const combinedScore = (trustWeightedScore * VERIFICATION_RULES.TRUST_WEIGHT) + 
                           (proximityWeightedScore * VERIFICATION_RULES.PROXIMITY_WEIGHT);
      
      let verificationStrength: 'unverified' | 'weak' | 'medium' | 'strong' | 'verified';
      if (reportVerifications.length >= 3 && combinedScore >= 0.8) {
        verificationStrength = 'verified';
      } else if (combinedScore >= 0.8) {
        verificationStrength = 'strong';
      } else if (combinedScore >= 0.6) {
        verificationStrength = 'medium';
      } else {
        verificationStrength = 'weak';
      }

      // Get top verifiers (by trust score)
      const topVerifiers = reportVerifications
        .sort((a, b) => b.trustScore - a.trustScore)
        .slice(0, 5)
        .map(v => v.verifierHash);

      const lastVerification = Math.max(...reportVerifications.map(v => v.verificationTime));

      return {
        reportId,
        totalVerifications: reportVerifications.length,
        trustWeightedScore,
        proximityWeightedScore,
        verificationStrength,
        lastVerification,
        topVerifiers
      };
    } catch (error) {
      console.error('Error getting verification summary:', error);
      return {
        reportId,
        totalVerifications: 0,
        trustWeightedScore: 0,
        proximityWeightedScore: 0,
        verificationStrength: 'unverified',
        lastVerification: 0,
        topVerifiers: []
      };
    }
  }

  /**
   * Get user's trust profile
   */
  static async getUserTrustProfile(): Promise<UserTrustProfile> {
    return await this.getOrCreateTrustProfile();
  }

  /**
   * Get all verifications
   */
  private static async getVerifications(): Promise<Verification[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.VERIFICATIONS);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading verifications:', error);
      return [];
    }
  }

  /**
   * Save a verification
   */
  private static async saveVerification(verification: Verification): Promise<void> {
    try {
      const verifications = await this.getVerifications();
      verifications.push(verification);
      
      // Keep only recent verifications (last 30 days)
      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
      const recentVerifications = verifications.filter(v => v.verificationTime > thirtyDaysAgo);
      
      await AsyncStorage.setItem(STORAGE_KEYS.VERIFICATIONS, JSON.stringify(recentVerifications));
    } catch (error) {
      console.error('Error saving verification:', error);
      throw error;
    }
  }

  /**
   * Update user trust profile
   */
  private static async updateTrustProfile(profile: UserTrustProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_TRUST, JSON.stringify(profile));
      this.userTrustProfile = profile;
    } catch (error) {
      console.error('Error updating trust profile:', error);
      throw error;
    }
  }

  /**
   * Clear all verification data (for testing)
   */
  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.VERIFICATIONS,
        STORAGE_KEYS.USER_TRUST,
        STORAGE_KEYS.VERIFICATION_LIMITS,
        STORAGE_KEYS.DEVICE_ID
      ]);
      this.deviceId = null;
      this.userTrustProfile = null;
      console.log('✅ All verification data cleared');
    } catch (error) {
      console.error('Error clearing verification data:', error);
    }
  }

  /**
   * Get verification statistics for display
   */
  static async getVerificationStats(): Promise<{
    totalVerifications: number;
    userTrustScore: number;
    verificationsSubmitted: number;
    trustLevel: 'new' | 'trusted' | 'veteran' | 'expert';
  }> {
    try {
      const verifications = await this.getVerifications();
      const trustProfile = await this.getOrCreateTrustProfile();
      
      // Determine trust level
      let trustLevel: 'new' | 'trusted' | 'veteran' | 'expert';
      if (trustProfile.trustScore >= 0.9 && trustProfile.verificationsSubmitted >= 50) {
        trustLevel = 'expert';
      } else if (trustProfile.trustScore >= 0.8 && trustProfile.verificationsSubmitted >= 20) {
        trustLevel = 'veteran';
      } else if (trustProfile.trustScore >= 0.6 && trustProfile.verificationsSubmitted >= 5) {
        trustLevel = 'trusted';
      } else {
        trustLevel = 'new';
      }

      return {
        totalVerifications: verifications.length,
        userTrustScore: trustProfile.trustScore,
        verificationsSubmitted: trustProfile.verificationsSubmitted,
        trustLevel
      };
    } catch (error) {
      console.error('Error getting verification stats:', error);
      return {
        totalVerifications: 0,
        userTrustScore: 0.5,
        verificationsSubmitted: 0,
        trustLevel: 'new'
      };
    }
  }
} 