import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
// @ts-ignore
import { CommunityReport, ReportService, ReportSubmission } from '../services/Report/ReportService';

interface UseReportsReturn {
  reports: CommunityReport[];
  loading: boolean;
  error: string | null;
  submitReport: (submission: ReportSubmission) => Promise<boolean>;
  refreshReports: () => Promise<void>;
  getUserReports: () => Promise<CommunityReport[]>;
  generateSampleData: (userLocation: { latitude: number; longitude: number }) => Promise<void>;
  clearAllData: () => Promise<void>;
}

export function useReports(): UseReportsReturn {
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const activeReports = await ReportService.getActiveReports();
      setReports(activeReports);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  }, []);

  const submitReport = useCallback(async (submission: ReportSubmission): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // Check if user can submit
      const canSubmit = await ReportService.canSubmitReport();
      if (!canSubmit.allowed) {
        Alert.alert('Rate Limit', canSubmit.reason || 'Please wait before submitting another report');
        return false;
      }

      const result = await ReportService.submitReport(submission);
      
      if (result.success) {
        Alert.alert(
          'Report Submitted', 
          'Your anonymous report has been submitted to the community. Thank you for helping keep the community informed.',
          [{ text: 'OK' }]
        );
        
        // Refresh reports to show the new one
        await refreshReports();
        return true;
      } else {
        Alert.alert('Submission Failed', result.error || 'Failed to submit report');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit report';
      setError(errorMessage);
      Alert.alert('Error', errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [refreshReports]);

  const getUserReports = useCallback(async (): Promise<CommunityReport[]> => {
    try {
      return await ReportService.getUserReports();
    } catch (err) {
      console.error('Error getting user reports:', err);
      return [];
    }
  }, []);

  const generateSampleData = useCallback(async (userLocation: { latitude: number; longitude: number }) => {
    try {
      setLoading(true);
      await ReportService.generateSampleReports(userLocation);
      await refreshReports();
      Alert.alert('Sample Data', 'Generated sample community reports for testing');
    } catch (err) {
      console.error('Error generating sample data:', err);
      Alert.alert('Error', 'Failed to generate sample data');
    } finally {
      setLoading(false);
    }
  }, [refreshReports]);

  const clearAllData = useCallback(async () => {
    try {
      setLoading(true);
      await ReportService.clearAllData();
      setReports([]);
      Alert.alert('Data Cleared', 'All local report data has been cleared');
    } catch (err) {
      console.error('Error clearing data:', err);
      Alert.alert('Error', 'Failed to clear data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load reports on mount
  useEffect(() => {
    refreshReports();
  }, [refreshReports]);

  return {
    reports,
    loading,
    error,
    submitReport,
    refreshReports,
    getUserReports,
    generateSampleData,
    clearAllData
  };
} 