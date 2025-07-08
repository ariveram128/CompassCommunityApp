import * as SecureStore from 'expo-secure-store';
import { DevUtils } from '../../utils/DevUtils';

interface OnboardingState {
  isCompleted: boolean;
  currentStep: number;
  totalSteps: number;
  completedSteps: string[];
  lastShown?: number;
}

type OnboardingStep = 
  | 'welcome'
  | 'location_permission' 
  | 'notification_permission'
  | 'feature_tour'
  | 'privacy_explanation'
  | 'first_report_guide'
  | 'complete';

export class OnboardingService {
  private static readonly STORAGE_KEY = 'compass_onboarding_state';
  private static readonly SKIP_STORAGE_KEY = 'compass_onboarding_skip';
  
  private static readonly TOTAL_STEPS = 6;
  private static readonly STEP_ORDER: OnboardingStep[] = [
    'welcome',
    'location_permission',
    'notification_permission', 
    'feature_tour',
    'privacy_explanation',
    'complete'
  ];

  /**
   * Initialize onboarding service
   */
  static async initialize(): Promise<void> {
    try {
      DevUtils.log('OnboardingService: Initializing...');
      
      // Check if user has skipped onboarding permanently
      const hasSkipped = await this.hasUserSkippedOnboarding();
      if (hasSkipped) {
        DevUtils.log('OnboardingService: User has permanently skipped onboarding');
        return;
      }

      const state = await this.getOnboardingState();
      DevUtils.log('OnboardingService: Current state:', state);
      
    } catch (error) {
      DevUtils.error('OnboardingService: Failed to initialize:', error);
    }
  }

  /**
   * Check if user should see onboarding
   */
  static async shouldShowOnboarding(): Promise<boolean> {
    try {
      // Never show in development mode if disabled
      if (__DEV__ && !DevUtils.enableOnboarding) {
        return false;
      }

      const hasSkipped = await this.hasUserSkippedOnboarding();
      if (hasSkipped) return false;

      const state = await this.getOnboardingState();
      return !state.isCompleted;
    } catch (error) {
      DevUtils.error('OnboardingService: Error checking onboarding status:', error);
      return false;
    }
  }

  /**
   * Get current onboarding state
   */
  static async getOnboardingState(): Promise<OnboardingState> {
    try {
      const stored = await SecureStore.getItemAsync(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      
      // Default state for new users
      return {
        isCompleted: false,
        currentStep: 0,
        totalSteps: this.TOTAL_STEPS,
        completedSteps: [],
        lastShown: Date.now()
      };
    } catch (error) {
      DevUtils.error('OnboardingService: Error getting state:', error);
      return {
        isCompleted: false,
        currentStep: 0,
        totalSteps: this.TOTAL_STEPS,
        completedSteps: []
      };
    }
  }

  /**
   * Update onboarding state
   */
  static async updateOnboardingState(updates: Partial<OnboardingState>): Promise<void> {
    try {
      const currentState = await this.getOnboardingState();
      const newState = { ...currentState, ...updates };
      
      await SecureStore.setItemAsync(this.STORAGE_KEY, JSON.stringify(newState));
      DevUtils.log('OnboardingService: State updated:', newState);
    } catch (error) {
      DevUtils.error('OnboardingService: Error updating state:', error);
    }
  }

  /**
   * Mark a specific step as completed
   */
  static async completeStep(step: OnboardingStep): Promise<void> {
    try {
      const state = await this.getOnboardingState();
      
      if (!state.completedSteps.includes(step)) {
        state.completedSteps.push(step);
      }
      
      // Update current step to next uncompleted step
      const nextStepIndex = this.STEP_ORDER.findIndex(s => !state.completedSteps.includes(s));
      if (nextStepIndex !== -1) {
        state.currentStep = nextStepIndex;
      } else {
        // All steps completed
        state.currentStep = this.TOTAL_STEPS;
        state.isCompleted = true;
      }
      
      await this.updateOnboardingState(state);
      DevUtils.log(`OnboardingService: Step '${step}' completed`);
    } catch (error) {
      DevUtils.error('OnboardingService: Error completing step:', error);
    }
  }

  /**
   * Get current step information
   */
  static async getCurrentStep(): Promise<{ step: OnboardingStep; index: number } | null> {
    try {
      const state = await this.getOnboardingState();
      
      if (state.isCompleted) {
        return { step: 'complete', index: this.TOTAL_STEPS };
      }
      
      const currentStep = this.STEP_ORDER[state.currentStep];
      return currentStep ? { step: currentStep, index: state.currentStep } : null;
    } catch (error) {
      DevUtils.error('OnboardingService: Error getting current step:', error);
      return null;
    }
  }

  /**
   * Skip onboarding entirely
   */
  static async skipOnboarding(permanent: boolean = false): Promise<void> {
    try {
      if (permanent) {
        await SecureStore.setItemAsync(this.SKIP_STORAGE_KEY, 'true');
        DevUtils.log('OnboardingService: Onboarding permanently skipped');
      }
      
      // Mark as completed
      await this.updateOnboardingState({
        isCompleted: true,
        currentStep: this.TOTAL_STEPS
      });
      
    } catch (error) {
      DevUtils.error('OnboardingService: Error skipping onboarding:', error);
    }
  }

  /**
   * Reset onboarding (for testing/debugging)
   */
  static async resetOnboarding(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(this.STORAGE_KEY);
      await SecureStore.deleteItemAsync(this.SKIP_STORAGE_KEY);
      DevUtils.log('OnboardingService: Onboarding reset');
    } catch (error) {
      DevUtils.error('OnboardingService: Error resetting onboarding:', error);
    }
  }

  /**
   * Check if user has permanently skipped onboarding
   */
  private static async hasUserSkippedOnboarding(): Promise<boolean> {
    try {
      const skipped = await SecureStore.getItemAsync(this.SKIP_STORAGE_KEY);
      return skipped === 'true';
    } catch (error) {
      DevUtils.error('OnboardingService: Error checking skip status:', error);
      return false;
    }
  }

  /**
   * Get progress information for UI
   */
  static async getProgress(): Promise<{ completed: number; total: number; percentage: number }> {
    try {
      const state = await this.getOnboardingState();
      const completed = state.completedSteps.length;
      const total = this.TOTAL_STEPS;
      const percentage = Math.round((completed / total) * 100);
      
      return { completed, total, percentage };
    } catch (error) {
      DevUtils.error('OnboardingService: Error getting progress:', error);
      return { completed: 0, total: this.TOTAL_STEPS, percentage: 0 };
    }
  }

  /**
   * Check if specific step is completed
   */
  static async isStepCompleted(step: OnboardingStep): Promise<boolean> {
    try {
      const state = await this.getOnboardingState();
      return state.completedSteps.includes(step);
    } catch (error) {
      DevUtils.error('OnboardingService: Error checking step completion:', error);
      return false;
    }
  }

  /**
   * Get step metadata for UI
   */
  static getStepMetadata(step: OnboardingStep): {
    title: string;
    description: string;
    icon: string;
    primaryColor: string;
  } {
    const metadata = {
      welcome: {
        title: 'Welcome to Compass Community',
        description: 'A privacy-first platform for community safety',
        icon: 'shield-checkmark',
        primaryColor: '#10B981'
      },
      location_permission: {
        title: 'Location Services',
        description: 'Anonymous location sharing for community alerts',
        icon: 'location',
        primaryColor: '#6366F1'
      },
      notification_permission: {
        title: 'Community Alerts',
        description: 'Get notified of safety reports in your area',
        icon: 'notifications',
        primaryColor: '#F59E0B'
      },
      feature_tour: {
        title: 'App Features',
        description: 'Learn how to navigate and use the app',
        icon: 'map',
        primaryColor: '#8B5CF6'
      },
      privacy_explanation: {
        title: 'Your Privacy',
        description: 'How we protect your data and identity',
        icon: 'lock-closed',
        primaryColor: '#EF4444'
      },
      first_report_guide: {
        title: 'First Report',
        description: 'Learn how to submit safety reports',
        icon: 'document-text',
        primaryColor: '#06B6D4'
      },
      complete: {
        title: 'Ready to Go!',
        description: 'You\'re all set to use Compass Community',
        icon: 'checkmark-circle',
        primaryColor: '#10B981'
      }
    };

    return metadata[step] || metadata.welcome;
  }
} 