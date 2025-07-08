import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface OnboardingCompleteScreenProps {
  onComplete: () => void;
  onBack: () => void;
}

export function OnboardingCompleteScreen({ onComplete, onBack }: OnboardingCompleteScreenProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Animate the success icon
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <Ionicons name="arrow-back" size={24} color="#6B7280" />
            </TouchableOpacity>
            <View style={{ width: 40 }} />
          </View>

          {/* Success Animation */}
          <View style={styles.successSection}>
            <Animated.View 
              style={[
                styles.successIconContainer,
                {
                  transform: [{ scale: scaleAnim }]
                }
              ]}
            >
              <View style={styles.successIcon}>
                <View style={styles.successIconGradient}>
                  <Ionicons name="checkmark" size={64} color="#ffffff" />
                </View>
              </View>
              
              {/* Confetti Effect */}
              <View style={styles.confettiContainer}>
                <View style={[styles.confetti, styles.confetti1]} />
                <View style={[styles.confetti, styles.confetti2]} />
                <View style={[styles.confetti, styles.confetti3]} />
                <View style={[styles.confetti, styles.confetti4]} />
                <View style={[styles.confetti, styles.confetti5]} />
                <View style={[styles.confetti, styles.confetti6]} />
              </View>
            </Animated.View>

            <Animated.View 
              style={[
                styles.successTextContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              <Text style={styles.successTitle}>All Set!</Text>
              <Text style={styles.successSubtitle}>
                Your Compass Community app is ready to use
              </Text>
            </Animated.View>
          </View>

          {/* Setup Summary */}
          <Animated.View 
            style={[
              styles.summarySection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <Ionicons name="list-circle" size={24} color="#10B981" />
                <Text style={styles.summaryTitle}>Setup Complete</Text>
              </View>
              
              <View style={styles.summaryList}>
                <View style={styles.summaryItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  <Text style={styles.summaryText}>Privacy settings configured</Text>
                </View>
                
                <View style={styles.summaryItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  <Text style={styles.summaryText}>Community features activated</Text>
                </View>
                
                <View style={styles.summaryItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  <Text style={styles.summaryText}>Safety protocols enabled</Text>
                </View>
                
                <View style={styles.summaryItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  <Text style={styles.summaryText}>Anonymous reporting ready</Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Next Steps */}
          <Animated.View 
            style={[
              styles.nextStepsSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Text style={styles.sectionTitle}>What's Next?</Text>
            
            <View style={styles.stepsList}>
              <View style={styles.stepItem}>
                <View style={[styles.stepIcon, { backgroundColor: '#8B5CF6' }]}>
                  <Text style={styles.stepNumber}>1</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Explore the Map</Text>
                  <Text style={styles.stepDescription}>
                    Check out community reports in your area
                  </Text>
                </View>
              </View>

              <View style={styles.stepItem}>
                <View style={[styles.stepIcon, { backgroundColor: '#06B6D4' }]}>
                  <Text style={styles.stepNumber}>2</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Submit Your First Report</Text>
                  <Text style={styles.stepDescription}>
                    Help your community by sharing safety information
                  </Text>
                </View>
              </View>

              <View style={styles.stepItem}>
                <View style={[styles.stepIcon, { backgroundColor: '#F59E0B' }]}>
                  <Text style={styles.stepNumber}>3</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Verify Community Reports</Text>
                  <Text style={styles.stepDescription}>
                    Build trust by confirming reports you can verify
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Quick Tips */}
          <Animated.View 
            style={[
              styles.tipsSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.tipsCard}>
              <View style={styles.tipsHeader}>
                <Ionicons name="bulb" size={24} color="#F59E0B" />
                <Text style={styles.tipsTitle}>Quick Tips</Text>
              </View>
              
              <View style={styles.tipsList}>
                <Text style={styles.tipItem}>
                  • Reports automatically expire after 4 hours
                </Text>
                <Text style={styles.tipItem}>
                  • Your location is always anonymized to protect privacy
                </Text>
                <Text style={styles.tipItem}>
                  • Use the verification system to build community trust
                </Text>
                <Text style={styles.tipItem}>
                  • Access settings anytime to adjust preferences
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Support */}
          <Animated.View 
            style={[
              styles.supportSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.supportCard}>
              <View style={styles.supportHeader}>
                <Ionicons name="help-circle" size={24} color="#6366F1" />
                <Text style={styles.supportTitle}>Need Help?</Text>
              </View>
              
              <Text style={styles.supportText}>
                Visit the Settings screen for tutorials, privacy information, and community guidelines.
              </Text>
            </View>
          </Animated.View>

          {/* Action Button */}
          <Animated.View 
            style={[
              styles.actionSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <TouchableOpacity style={styles.primaryButton} onPress={onComplete}>
              <View style={styles.buttonGradient}>
                <Text style={styles.primaryButtonText}>Start Using App</Text>
                <Ionicons name="arrow-forward" size={20} color="#ffffff" />
              </View>
            </TouchableOpacity>
          </Animated.View>

          {/* Final Progress */}
          <View style={styles.progressSection}>
            <View style={styles.progressDots}>
              <View style={[styles.dot, styles.completedDot]} />
              <View style={[styles.dot, styles.completedDot]} />
              <View style={[styles.dot, styles.completedDot]} />
              <View style={[styles.dot, styles.completedDot]} />
              <View style={[styles.dot, styles.completedDot]} />
            </View>
            <Text style={styles.progressText}>Setup Complete!</Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  gradient: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  successSection: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  successIconContainer: {
    position: 'relative',
    marginBottom: 32,
  },
  successIcon: {
    alignItems: 'center',
  },
  successIconGradient: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 16,
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  confetti: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  confetti1: {
    backgroundColor: '#EF4444',
    top: 20,
    left: 30,
  },
  confetti2: {
    backgroundColor: '#F59E0B',
    top: 40,
    right: 20,
  },
  confetti3: {
    backgroundColor: '#8B5CF6',
    bottom: 30,
    left: 20,
  },
  confetti4: {
    backgroundColor: '#06B6D4',
    bottom: 50,
    right: 30,
  },
  confetti5: {
    backgroundColor: '#10B981',
    top: 60,
    left: 60,
  },
  confetti6: {
    backgroundColor: '#F97316',
    bottom: 20,
    right: 60,
  },
  successTextContainer: {
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  summarySection: {
    marginBottom: 32,
  },
  summaryCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10B981',
    marginLeft: 12,
  },
  summaryList: {
    gap: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 14,
    color: '#D1D5DB',
    marginLeft: 12,
    flex: 1,
  },
  nextStepsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  stepsList: {
    gap: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(55, 65, 81, 0.3)',
    borderRadius: 12,
    padding: 16,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
  },
  tipsSection: {
    marginBottom: 32,
  },
  tipsCard: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginLeft: 12,
  },
  tipsList: {
    gap: 8,
  },
  tipItem: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 20,
  },
  supportSection: {
    marginBottom: 32,
  },
  supportCard: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
  },
  supportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6366F1',
    marginLeft: 12,
  },
  supportText: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 20,
  },
  actionSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  primaryButton: {
    width: '100%',
    maxWidth: 280,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 8,
  },
  progressSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  progressDots: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(107, 114, 128, 0.3)',
    marginHorizontal: 4,
  },
  completedDot: {
    backgroundColor: '#10B981',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  progressText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: 'bold',
  },
}); 