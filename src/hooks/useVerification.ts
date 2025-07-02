import { useCallback, useEffect, useState } from 'react';
import type {
    UserTrustProfile,
    VerificationSummary
} from '../services/Verification/VerificationService';
import { VerificationService } from '../services/Verification/VerificationService';
import { useLocation } from './useLocation';

export function useVerification() {
  const [loading, setLoading] = useState(false);
  const [trustProfile, setTrustProfile] = useState<UserTrustProfile | null>(null);
  const [verificationStats, setVerificationStats] = useState({
    totalVerifications: 0,
    userTrustScore: 0.5,
    verificationsSubmitted: 0,
    trustLevel: 'new' as 'new' | 'trusted' | 'veteran' | 'expert'
  });
  const { location } = useLocation();

  // Load user trust profile and stats
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const [profile, stats] = await Promise.all([
          VerificationService.getUserTrustProfile(),
          VerificationService.getVerificationStats()
        ]);
        setTrustProfile(profile);
        setVerificationStats(stats);
      } catch (error) {
        console.error('Error loading verification data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  /**
   * Check if user can verify a specific report
   */
  const canVerifyReport = useCallback(async (
    reportId: string,
    reportLocation: { latitude: number; longitude: number }
  ) => {
    if (!location) {
      return { allowed: false, reason: 'Location required for verification' };
    }

    return await VerificationService.canVerifyReport(reportId, reportLocation, location);
  }, [location]);

  /**
   * Submit a verification for a report
   */
  const verifyReport = useCallback(async (
    reportId: string,
    reportLocation: { latitude: number; longitude: number },
    reportTimestamp: number
  ) => {
    if (!location) {
      return { success: false, error: 'Location required for verification' };
    }

    setLoading(true);
    try {
      const result = await VerificationService.verifyReport(
        reportId,
        reportLocation,
        reportTimestamp,
        location
      );

      if (result.success) {
        // Refresh user data after successful verification
        const [profile, stats] = await Promise.all([
          VerificationService.getUserTrustProfile(),
          VerificationService.getVerificationStats()
        ]);
        setTrustProfile(profile);
        setVerificationStats(stats);
      }

      return result;
    } catch (error) {
      console.error('Error submitting verification:', error);
      return { success: false, error: 'Failed to submit verification' };
    } finally {
      setLoading(false);
    }
  }, [location]);

  /**
   * Get verification summary for a report
   */
  const getVerificationSummary = useCallback(async (reportId: string): Promise<VerificationSummary> => {
    return await VerificationService.getVerificationSummary(reportId);
  }, []);

  /**
   * Get multiple verification summaries
   */
  const getVerificationSummaries = useCallback(async (reportIds: string[]): Promise<Map<string, VerificationSummary>> => {
    const summaries = new Map<string, VerificationSummary>();
    
    await Promise.all(
      reportIds.map(async (reportId) => {
        const summary = await VerificationService.getVerificationSummary(reportId);
        summaries.set(reportId, summary);
      })
    );
    
    return summaries;
  }, []);

  /**
   * Refresh verification data
   */
  const refreshVerificationData = useCallback(async () => {
    setLoading(true);
    try {
      const [profile, stats] = await Promise.all([
        VerificationService.getUserTrustProfile(),
        VerificationService.getVerificationStats()
      ]);
      setTrustProfile(profile);
      setVerificationStats(stats);
    } catch (error) {
      console.error('Error refreshing verification data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get trust level display info
   */
  const getTrustLevelInfo = useCallback((level: string) => {
    switch (level) {
      case 'expert':
        return {
          label: 'Expert Verifier',
          color: '#8B5CF6',
          icon: 'diamond' as const,
          description: 'Highly trusted community expert'
        };
      case 'veteran':
        return {
          label: 'Veteran Verifier',
          color: '#10B981',
          icon: 'star' as const,
          description: 'Experienced community member'
        };
      case 'trusted':
        return {
          label: 'Trusted Member',
          color: '#3B82F6',
          icon: 'shield-checkmark' as const,
          description: 'Verified community contributor'
        };
      default:
        return {
          label: 'New Member',
          color: '#64748B',
          icon: 'person' as const,
          description: 'Building community trust'
        };
    }
  }, []);

  /**
   * Get verification strength display info
   */
  const getVerificationStrengthInfo = useCallback((strength: string) => {
    switch (strength) {
      case 'verified':
        return {
          label: 'Community Verified',
          color: '#10B981',
          icon: 'checkmark-circle' as const,
          description: 'Confirmed by multiple trusted sources'
        };
      case 'strong':
        return {
          label: 'Strong Verification',
          color: '#059669',
          icon: 'shield-checkmark' as const,
          description: 'High confidence verification'
        };
      case 'medium':
        return {
          label: 'Moderate Verification',
          color: '#F59E0B',
          icon: 'shield' as const,
          description: 'Some community confirmation'
        };
      case 'weak':
        return {
          label: 'Weak Verification',
          color: '#EF4444',
          icon: 'shield-outline' as const,
          description: 'Limited verification'
        };
      default:
        return {
          label: 'Unverified',
          color: '#64748B',
          icon: 'help-circle' as const,
          description: 'No community verification yet'
        };
    }
  }, []);

  return {
    loading,
    trustProfile,
    verificationStats,
    canVerifyReport,
    verifyReport,
    getVerificationSummary,
    getVerificationSummaries,
    refreshVerificationData,
    getTrustLevelInfo,
    getVerificationStrengthInfo,
    // Service methods for direct access
    clearAllData: VerificationService.clearAllData,
    initialize: VerificationService.initialize
  };
} 