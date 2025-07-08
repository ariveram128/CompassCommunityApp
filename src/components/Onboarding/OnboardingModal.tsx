import * as Location from 'expo-location';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, BackHandler, Modal } from 'react-native';

import { NotificationService } from '../../services/Notification/NotificationService';
import { OnboardingService } from '../../services/Onboarding/OnboardingService';
import { DevUtils } from '../../utils/DevUtils';
import { FeatureTourScreen } from './FeatureTourScreen';
import { LocationPermissionScreen } from './LocationPermissionScreen';
import { OnboardingCompleteScreen } from './OnboardingCompleteScreen';
import { PrivacyExplanationScreen } from './PrivacyExplanationScreen';
import { WelcomeScreen } from './WelcomeScreen';

interface OnboardingModalProps {
  visible: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

type OnboardingStep = 
  | 'welcome'
  | 'location_permission' 
  | 'notification_permission'
  | 'feature_tour'
  | 'privacy_explanation'
  | 'complete';

export function OnboardingModal({ visible, onComplete, onSkip }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      initializeOnboarding();
    }
  }, [visible]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backHandler.remove();
  }, [currentStep]);

  const initializeOnboarding = async () => {
    try {
      setIsLoading(true);
      
      // Get current step from service
      const stepInfo = await OnboardingService.getCurrentStep();
      if (stepInfo && stepInfo.step !== 'first_report_guide') {
        // Map service steps to our local type
        const mappedStep = stepInfo.step === 'complete' ? 'complete' : stepInfo.step as OnboardingStep;
        setCurrentStep(mappedStep);
      }
      
      DevUtils.log('OnboardingModal: Initialized at step:', stepInfo?.step);
    } catch (error) {
      DevUtils.error('OnboardingModal: Failed to initialize:', error);
      setCurrentStep('welcome');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackPress = useCallback(() => {
    switch (currentStep) {
      case 'welcome':
        Alert.alert(
          'Exit Onboarding',
          'Are you sure you want to skip the setup? You can access it later in Settings.',
          [
            { text: 'Continue Setup', style: 'cancel' },
            { text: 'Skip', style: 'destructive', onPress: handleSkipOnboarding }
          ]
        );
        return true;
      
      case 'location_permission':
        setCurrentStep('welcome');
        return true;
      
      case 'feature_tour':
        setCurrentStep('location_permission');
        return true;
      
      case 'privacy_explanation':
        setCurrentStep('feature_tour');
        return true;
      
      default:
        return false;
    }
  }, [currentStep]);

  const handleStepComplete = async (step: OnboardingStep) => {
    try {
      await OnboardingService.completeStep(step);
      DevUtils.log('OnboardingModal: Completed step:', step);
    } catch (error) {
      DevUtils.error('OnboardingModal: Failed to save step completion:', error);
    }
  };

  const handleNext = async () => {
    await handleStepComplete(currentStep);
    
    switch (currentStep) {
      case 'welcome':
        setCurrentStep('location_permission');
        break;
      case 'location_permission':
        setCurrentStep('feature_tour');
        break;
      case 'feature_tour':
        setCurrentStep('privacy_explanation');
        break;
      case 'privacy_explanation':
        setCurrentStep('complete');
        break;
      case 'complete':
        await handleCompleteOnboarding();
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'location_permission':
        setCurrentStep('welcome');
        break;
      case 'feature_tour':
        setCurrentStep('location_permission');
        break;
      case 'privacy_explanation':
        setCurrentStep('feature_tour');
        break;
      case 'complete':
        setCurrentStep('privacy_explanation');
        break;
    }
  };

  const handleSkipOnboarding = async () => {
    try {
      await OnboardingService.skipOnboarding(false);
      DevUtils.log('OnboardingModal: Onboarding skipped');
      onSkip();
    } catch (error) {
      DevUtils.error('OnboardingModal: Failed to skip onboarding:', error);
      onSkip(); // Still close modal even if saving fails
    }
  };

  const handleCompleteOnboarding = async () => {
    try {
      await handleStepComplete('complete');
      await OnboardingService.updateOnboardingState({ isCompleted: true });
      DevUtils.log('OnboardingModal: Onboarding completed successfully');
      onComplete();
    } catch (error) {
      DevUtils.error('OnboardingModal: Failed to complete onboarding:', error);
      onComplete(); // Still close modal even if saving fails
    }
  };

  const handleRequestLocationPermission = async (): Promise<boolean> => {
    try {
      DevUtils.log('OnboardingModal: Requesting location permission...');
      
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status === 'granted') {
        DevUtils.log('OnboardingModal: Location permission granted');
        return true;
      } else {
        DevUtils.log('OnboardingModal: Location permission denied');
        return false;
      }
    } catch (error) {
      DevUtils.error('OnboardingModal: Error requesting location permission:', error);
      return false;
    }
  };

  const handleRequestNotificationPermission = async (): Promise<boolean> => {
    try {
      DevUtils.log('OnboardingModal: Requesting notification permission...');
      
      const hasPermission = await NotificationService.requestPermissions();
      
      if (hasPermission) {
        DevUtils.log('OnboardingModal: Notification permission granted');
        return true;
      } else {
        DevUtils.log('OnboardingModal: Notification permission denied');
        return false;
      }
    } catch (error) {
      DevUtils.error('OnboardingModal: Error requesting notification permission:', error);
      return false;
    }
  };

  if (isLoading) {
    return <Modal visible={visible} animationType="slide" />; // Empty modal while loading
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent
    >
      {currentStep === 'welcome' && (
        <WelcomeScreen
          onNext={handleNext}
          onSkip={handleSkipOnboarding}
        />
      )}
      
      {currentStep === 'location_permission' && (
        <LocationPermissionScreen
          onNext={handleNext}
          onSkip={handleSkipOnboarding}
          onBack={handleBack}
          onRequestPermission={handleRequestLocationPermission}
        />
      )}
      
      {currentStep === 'feature_tour' && (
        <FeatureTourScreen
          onNext={handleNext}
          onSkip={handleSkipOnboarding}
          onBack={handleBack}
        />
      )}
      
      {currentStep === 'privacy_explanation' && (
        <PrivacyExplanationScreen
          onNext={handleNext}
          onSkip={handleSkipOnboarding}
          onBack={handleBack}
        />
      )}
      
      {currentStep === 'complete' && (
        <OnboardingCompleteScreen
          onComplete={handleCompleteOnboarding}
          onBack={handleBack}
        />
      )}
    </Modal>
  );
}

export default OnboardingModal; 