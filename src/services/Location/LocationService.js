import * as Location from 'expo-location';
import * as Device from 'expo-device';
import { CONFIG } from '../constants/config';

export class LocationService {
  static async requestPermissions() {
    const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
    
    if (foregroundStatus !== 'granted') {
      throw new Error('Location permission denied');
    }

    // Only request background if foreground granted
    const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
    
    return {
      foreground: foregroundStatus === 'granted',
      background: backgroundStatus === 'granted'
    };
  }

  static async getCurrentLocation() {
    const permissions = await this.requestPermissions();
    if (!permissions.foreground) {
      throw new Error('Location access required for safety alerts');
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced, // Balance privacy vs accuracy
      timeInterval: 5000,
      distanceInterval: 100
    });

    return this.anonymizeLocation(location.coords);
  }

  static anonymizeLocation(coords) {
    // Reduce precision for privacy - rounds to ~100m grid
    const precision = CONFIG.LOCATION_PRECISION;
    return {
      latitude: Math.round(coords.latitude * Math.pow(10, precision)) / Math.pow(10, precision),
      longitude: Math.round(coords.longitude * Math.pow(10, precision)) / Math.pow(10, precision),
      timestamp: Date.now(),
      // Remove exact altitude, speed, heading for privacy
      accuracy: Math.round(coords.accuracy / 10) * 10 // Round accuracy to nearest 10m
    };
  }

  static calculateDistance(coord1, coord2) {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(coord2.latitude - coord1.latitude);
    const dLon = this.toRad(coord2.longitude - coord1.longitude);
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(this.toRad(coord1.latitude)) * Math.cos(this.toRad(coord2.latitude)) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  static toRad(value) {
    return value * Math.PI / 180;
  }
}
