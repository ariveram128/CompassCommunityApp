import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import CryptoJS from 'crypto-js';
import { CONFIG } from '../constants/config';

export class EncryptionService {
  static async generateDeviceHash() {
    // Create a privacy-preserving device identifier
    const deviceInfo = await this.getDeviceFingerprint();
    const salt = await this.getOrCreateSalt();
    
    return CryptoJS.PBKDF2(
      deviceInfo, 
      salt, 
      { keySize: 256/32, iterations: CONFIG.DEVICE_ID_HASH_ROUNDS }
    ).toString();
  }

  static async getDeviceFingerprint() {
    // Use only non-invasive device properties
    const deviceName = await Device.deviceName || 'unknown';
    const osVersion = Device.osVersion || 'unknown';
    const platform = Device.platformApiLevel || Device.osName || 'unknown';
    
    return `${platform}-${osVersion}-${deviceName}`.toLowerCase();
  }

  static async getOrCreateSalt() {
    try {
      let salt = await SecureStore.getItemAsync('device_salt');
      if (!salt) {
        salt = CryptoJS.lib.WordArray.random(32).toString();
        await SecureStore.setItemAsync('device_salt', salt);
      }
      return salt;
    } catch (error) {
      // Fallback if SecureStore fails
      return CryptoJS.lib.WordArray.random(32).toString();
    }
  }

  static encryptReport(reportData) {
    // Generate ephemeral encryption key
    const ephemeralKey = CryptoJS.lib.WordArray.random(32).toString();
    
    // Encrypt the report
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(reportData),
      ephemeralKey
    ).toString();

    // Return encrypted data without storing the key
    return {
      data: encrypted,
      timestamp: Date.now(),
      keyHash: CryptoJS.SHA256(ephemeralKey).toString().substr(0, 16)
    };
  }

  static generateReportID(location) {
    // Create anonymous report identifier
    const locationString = `${location.latitude}-${location.longitude}`;
    const timestamp = Math.floor(Date.now() / (1000 * 60 * 5)); // 5-minute windows
    
    return CryptoJS.SHA256(`${locationString}-${timestamp}`).toString().substr(0, 12);
  }
}
