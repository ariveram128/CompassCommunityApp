import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from '../../hooks/useTranslation';

const { width } = Dimensions.get('window');

interface FeatureTourScreenProps {
  onNext: () => void;
  onSkip: () => void;
  onBack: () => void;
}

interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

interface FeatureSlide {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  features: FeatureItem[];
}

export function FeatureTourScreen({ onNext, onSkip, onBack }: FeatureTourScreenProps) {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);

  const featureSlides: FeatureSlide[] = [
    {
      id: 'map',
      title: t('onboarding.featureTour.map.title'),
      description: t('onboarding.featureTour.map.description'),
      icon: 'map',
      color: '#8B5CF6',
      features: [
        {
          icon: 'location',
          title: t('onboarding.featureTour.map.features.area.title'),
          description: t('onboarding.featureTour.map.features.area.description')
        },
        {
          icon: 'alert-circle',
          title: t('onboarding.featureTour.map.features.reports.title'),
          description: t('onboarding.featureTour.map.features.reports.description')
        },
        {
          icon: 'radio-button-on',
          title: t('onboarding.featureTour.map.features.radius.title'),
          description: t('onboarding.featureTour.map.features.radius.description')
        },
        {
          icon: 'time',
          title: t('onboarding.featureTour.map.features.live.title'),
          description: t('onboarding.featureTour.map.features.live.description')
        }
      ]
    },
    {
      id: 'reporting',
      title: t('onboarding.featureTour.reporting.title'),
      description: t('onboarding.featureTour.reporting.description'),
      icon: 'document-text',
      color: '#06B6D4',
      features: [
        {
          icon: 'add-circle',
          title: t('onboarding.featureTour.reporting.features.quick.title'),
          description: t('onboarding.featureTour.reporting.features.quick.description')
        },
        {
          icon: 'list',
          title: t('onboarding.featureTour.reporting.features.types.title'),
          description: t('onboarding.featureTour.reporting.features.types.description')
        },
        {
          icon: 'camera',
          title: t('onboarding.featureTour.reporting.features.photo.title'),
          description: t('onboarding.featureTour.reporting.features.photo.description')
        },
        {
          icon: 'shield-checkmark',
          title: t('onboarding.featureTour.reporting.features.anonymous.title'),
          description: t('onboarding.featureTour.reporting.features.anonymous.description')
        }
      ]
    },
    {
      id: 'verification',
      title: t('onboarding.featureTour.verification.title'),
      description: t('onboarding.featureTour.verification.description'),
      icon: 'checkmark-circle',
      color: '#10B981',
      features: [
        {
          icon: 'people',
          title: t('onboarding.featureTour.verification.features.trust.title'),
          description: t('onboarding.featureTour.verification.features.trust.description')
        },
        {
          icon: 'star',
          title: t('onboarding.featureTour.verification.features.credibility.title'),
          description: t('onboarding.featureTour.verification.features.credibility.description')
        },
        {
          icon: 'trending-up',
          title: t('onboarding.featureTour.verification.features.priority.title'),
          description: t('onboarding.featureTour.verification.features.priority.description')
        },
        {
          icon: 'timer',
          title: t('onboarding.featureTour.verification.features.quick.title'),
          description: t('onboarding.featureTour.verification.features.quick.description')
        }
      ]
    }
  ];

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
          <Text style={styles.headerTitle}>{t('onboarding.featureTour.title')}</Text>
          <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
            <Text style={styles.skipButtonText}>{t('onboarding.common.skip')}</Text>
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
                <Text style={styles.tipsTitle}>{t('onboarding.featureTour.tips.title')}</Text>
              </View>
              
              {currentSlide === 0 && (
                <Text style={styles.tipsText}>
                  {t('onboarding.featureTour.map.tip')}
                </Text>
              )}
              
              {currentSlide === 1 && (
                <Text style={styles.tipsText}>
                  {t('onboarding.featureTour.reporting.tip')}
                </Text>
              )}
              
              {currentSlide === 2 && (
                <Text style={styles.tipsText}>
                  {t('onboarding.featureTour.verification.tip')}
                </Text>
              )}
            </View>
          </View>
        </ScrollView>

        {/* Navigation */}
        <View style={styles.navigation}>
          <View style={styles.progressSection}>
            <Text style={styles.progressText}>{t('onboarding.featureTour.progress')}</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${((currentSlide + 1) / 3) * 100}%`, backgroundColor: current.color }]} />
            </View>
          </View>

          <View style={styles.navButtons}>
            {currentSlide > 0 && (
              <TouchableOpacity style={styles.navButton} onPress={prevSlide}>
                <Ionicons name="chevron-back" size={24} color="#6B7280" />
                <Text style={styles.navButtonText}>{t('onboarding.common.back')}</Text>
              </TouchableOpacity>
            )}
            
            <View style={styles.navSpacer} />
            
            <TouchableOpacity style={[styles.nextButton, { backgroundColor: current.color }]} onPress={nextSlide}>
              <Text style={styles.nextButtonText}>
                {currentSlide < featureSlides.length - 1 ? t('onboarding.featureTour.next') : t('onboarding.featureTour.continue')}
              </Text>
              <Ionicons name="chevron-forward" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
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
  navigation: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  progressSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(107, 114, 128, 0.3)',
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
    borderRadius: 8,
  },
  navButtonText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
    fontWeight: '500',
  },
  navSpacer: {
    width: 16,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  nextButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 4,
  },
}); 