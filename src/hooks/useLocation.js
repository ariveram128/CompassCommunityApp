import { useCallback, useEffect, useState } from 'react';
import { LocationService } from '../services/Location/LocationService';

export function useLocation() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [permissions, setPermissions] = useState({ foreground: false, background: false });

  const requestPermissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const perms = await LocationService.requestPermissions();
      setPermissions(perms);
      return perms;
    } catch (err) {
      setError(err.message);
      return { foreground: false, background: false };
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshLocation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const currentLocation = await LocationService.getCurrentLocation();
      setLocation(currentLocation);
      return currentLocation;
    } catch (err) {
      setError(err.message);
      setLocation(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const startWatching = useCallback(async () => {
    try {
      const cleanup = await LocationService.startWatching((newLocation) => {
        setLocation(newLocation);
        setError(null);
      });
      return cleanup;
    } catch (err) {
      console.error('Error starting location watch:', err);
      setError(err.message);
      return () => {}; // Return empty cleanup function
    }
  }, []);

  // Initialize location on mount
  useEffect(() => {
    let cleanupWatcher = null;

    const initializeLocation = async () => {
      try {
        const perms = await requestPermissions();
        if (perms.foreground) {
          await refreshLocation();
          cleanupWatcher = await startWatching();
        }
      } catch (err) {
        console.error('Failed to initialize location:', err);
        setError(err.message);
      }
    };

    initializeLocation();

    // Cleanup on unmount
    return () => {
      if (cleanupWatcher && typeof cleanupWatcher === 'function') {
        cleanupWatcher();
      }
    };
  }, []);

  return {
    location,
    loading,
    error,
    permissions,
    refreshLocation,
    requestPermissions,
    startWatching
  };
}
