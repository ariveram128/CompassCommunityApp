import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface FeatureTourScreenProps {
  onNext: () => void;
  onSkip: () => void;
  onBack: () => void;
}

interface FeatureSlide {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  features: {
    icon: string;
    title: string;
    description: string;
  }[];
}

const featureSlides: FeatureSlide[] = [
  {
    id: 'map',
    title: 'Community Map',
    description: 'Real-time safety information at your fingertips',
    icon: 'map',
    color: '#8B5CF6',
    features: [
      {
        icon: 'location',
        title: 'Your Area',
        description: 'See alerts within 8km of your location'
      },
      {
        icon: 'alert-circle',
        title: 'Safety Reports',
        description: 'View different types of community reports'
      },
      {
        icon: 'radio-button-on',
        title: 'Alert Radius',
        description: 'Visual indicator of your coverage area'
      },
      {
        icon: 'time',
        title: 'Live Updates',
        description: 'Reports automatically expire after 4 hours'
      }
    ]
  },
  {
    id: 'reporting',
    title: 'Report Activity',
    description: 'Help keep your community informed and safe',
    icon: 'document-text',
    color: '#06B6D4',
    features: [
      {
        icon: 'add-circle',
        title: 'Quick Reporting',
        description: 'Submit safety reports in seconds'
      },
      {
        icon: 'list',
        title: 'Report Types',
        description: 'Checkpoints, raids, patrols, and more'
      },
      {
        icon: 'camera',
        title: 'Photo Evidence',
        description: 'Optional photo attachment with privacy warnings'
      },
      {
        icon: 'shield-checkmark',
        title: 'Anonymous',
        description: 'All reports are completely anonymous'
      }
    ]
  },
  {
    id: 'verification',
    title: 'Community Verification',
    description: 'Help validate reports and build trust',
    icon: 'checkmark-circle',
    color: '#10B981',
    features: [
      {
        icon: 'people',
        title: 'Community Trust',
        description: 'Verify reports from other community members'
      },
      {
        icon: 'star',
        title: 'Credibility',
        description: 'Build reputation through accurate reporting'
      },
      {
        icon: 'trending-up',
        title: 'Priority Levels',
        description: 'High-priority reports get wider coverage'
      },
      {
        icon: 'timer',
        title: 'Quick Action',
        description: 'Verify reports with a simple tap'
      }
    ]
  }
];

export function FeatureTourScreen({ onNext, onSkip, onBack }: FeatureTourScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < featureSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onNext();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const current = featureSlides[currentSlide];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="#6B7280" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>App Features</Text>
          <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Slide Indicator */}
          <View style={styles.slideIndicator}>
            {featureSlides.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.slideIndicatorDot,
                  index === currentSlide && [styles.slideIndicatorActive, { backgroundColor: current.color }]
                ]}
              />
            ))}
          </View>

          {/* Feature Hero */}
          <View style={styles.heroSection}>
            <View style={styles.iconContainer}>
              <View style={[styles.iconGradient, { backgroundColor: current.color }]}>
                <Ionicons name={current.icon as any} size={64} color="#ffffff" />
              </View>
            </View>
            
            <Text style={styles.title}>{current.title}</Text>
            <Text style={styles.subtitle}>{current.description}</Text>
          </View>

          {/* Feature Details */}
          <View style={styles.featuresSection}>
            <View style={styles.featuresList}>
              {current.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <View style={[styles.featureIcon, { backgroundColor: current.color + '20' }]}>
                    <Ionicons name={feature.icon as any} size={24} color={current.color} />
                  </View>
                  <View style={styles.featureContent}>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureDescription}>{feature.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Usage Tips */}
          <View style={styles.tipsSection}>
            <View style={styles.tipsCard}>
              <View style={styles.tipsHeader}>
                <Ionicons name="bulb" size={20} color="#F59E0B" />
                <Text style={styles.tipsTitle}>Quick Tip</Text>
              </View>
              
              {currentSlide === 0 && (
                <Text style={styles.tipsText}>
                  Tap on any report marker to see details and verify if you&apos;re nearby. The map automatically centers on your location when opened.
                </Text>
              )}
              
              {currentSlide === 1 && (
                <Text style={styles.tipsText}>
                  Access the report screen from the main menu or use the floating action button. Include as much detail as safely possible.
                </Text>
              )}
              
              {currentSlide === 2 && (
                <Text style={styles.tipsText}>
                  Only verify reports you can personally confirm. Your verification helps the community assess report accuracy.
                </Text>
              )}
            </View>
          </View>

          {/* Navigation */}
          <View style={styles.navigationSection}>
            <View style={styles.navigationButtons}>
              {currentSlide > 0 && (
                <TouchableOpacity style={styles.prevButton} onPress={prevSlide}>
                  <Ionicons name="chevron-back" size={20} color="#6B7280" />
                  <Text style={styles.prevButtonText}>Previous</Text>
                </TouchableOpacity>
              )}
              
              <View style={{ flex: 1 }} />
              
              <TouchableOpacity style={styles.nextButton} onPress={nextSlide}>
                <View style={[styles.nextButtonGradient, { backgroundColor: current.color }]}>
                  <Text style={styles.nextButtonText}>
                    {currentSlide === featureSlides.length - 1 ? 'Continue' : 'Next'}
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color="#ffffff" />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Progress Indicator */}
          <View style={styles.progressSection}>
            <View style={styles.progressDots}>
              <View style={[styles.dot, styles.completedDot]} />
              <View style={[styles.dot, styles.completedDot]} />
              <View style={[styles.dot, styles.activeDot]} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
            <Text style={styles.progressText}>Step 3 of 5</Text>
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
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  slideIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  slideIndicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(107, 114, 128, 0.3)',
    marginHorizontal: 4,
  },
  slideIndicatorActive: {
    width: 24,
  },
  heroSection: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresSection: {
    marginBottom: 32,
  },
  featuresList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(55, 65, 81, 0.3)',
    borderRadius: 12,
    padding: 16,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
  },
  tipsSection: {
    marginBottom: 32,
  },
  tipsCard: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginLeft: 8,
  },
  tipsText: {
    fontSize: 14,
    color: '#D1D5DB',
    lineHeight: 20,
  },
  navigationSection: {
    marginBottom: 32,
  },
  navigationButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prevButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
    borderRadius: 8,
  },
  prevButtonText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
    fontWeight: '500',
  },
  nextButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  nextButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  nextButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 4,
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
  activeDot: {
    backgroundColor: '#8B5CF6',
    width: 24,
  },
  completedDot: {
    backgroundColor: '#10B981',
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
  },
}); 