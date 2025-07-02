import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

// Design System Constants
export const COLORS = {
  // Primary palette
  primary: '#6366F1', // Indigo
  primaryLight: '#818CF8',
  primaryDark: '#4F46E5',
  
  // Secondary palette
  secondary: '#10B981', // Emerald
  secondaryLight: '#34D399',
  secondaryDark: '#059669',
  
  // Accent colors
  accent: '#F59E0B', // Amber
  accentLight: '#FCD34D',
  
  // Alert colors
  error: '#EF4444', // Red
  warning: '#F59E0B', // Amber
  success: '#10B981', // Emerald
  info: '#3B82F6', // Blue
  
  // Neutral palette
  background: '#0F0F23', // Deep dark blue
  surface: '#1E1E42', // Dark blue
  surfaceLight: '#2D2D5A', // Medium blue
  border: '#3D3D73', // Light blue-gray
  
  // Text colors
  textPrimary: '#FFFFFF',
  textSecondary: '#CBD5E1', // Light gray
  textTertiary: '#94A3B8', // Medium gray
  textMuted: '#64748B', // Dark gray
  
  // Glass effect
  glass: 'rgba(255, 255, 255, 0.1)',
  glassBorder: 'rgba(255, 255, 255, 0.2)',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const TYPOGRAPHY = {
  h1: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
} as const;

// Glass Card Component
export const GlassCard: React.FC<{
  children: React.ReactNode;
  style?: ViewStyle;
  noPadding?: boolean;
}> = ({ children, style, noPadding = false }) => (
  <View style={[
    styles.glassCard,
    !noPadding && { padding: SPACING.lg },
    style
  ]}>
    {children}
  </View>
);

// Modern Button Component
export const ModernButton: React.FC<{
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}> = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'medium', 
  icon, 
  disabled = false,
  loading = false,
  style 
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'primary': return styles.buttonPrimary;
      case 'secondary': return styles.buttonSecondary;
      case 'outline': return styles.buttonOutline;
      case 'ghost': return styles.buttonGhost;
      default: return styles.buttonPrimary;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small': return styles.buttonSmall;
      case 'medium': return styles.buttonMedium;
      case 'large': return styles.buttonLarge;
      default: return styles.buttonMedium;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'primary': return styles.buttonTextPrimary;
      case 'secondary': return styles.buttonTextSecondary;
      case 'outline': return styles.buttonTextOutline;
      case 'ghost': return styles.buttonTextGhost;
      default: return styles.buttonTextPrimary;
    }
  };

  const buttonStyle = [
    styles.button,
    getVariantStyle(),
    getSizeStyle(),
    disabled && styles.buttonDisabled,
    style
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {variant === 'primary' ? (
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryDark]}
          style={[StyleSheet.absoluteFill, { borderRadius: RADIUS.md }]}
        />
      ) : null}
      
      <View style={styles.buttonContent}>
        {icon && (
          <Ionicons 
            name={icon} 
            size={size === 'small' ? 16 : size === 'large' ? 24 : 20} 
            color={variant === 'outline' || variant === 'ghost' ? COLORS.primary : COLORS.textPrimary} 
          />
        )}
        <Text style={[
          styles.buttonText,
          getTextStyle(),
          disabled && styles.buttonTextDisabled
        ]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// Status Badge Component
export const StatusBadge: React.FC<{
  status: 'active' | 'inactive' | 'warning' | 'error';
  text: string;
  icon?: keyof typeof Ionicons.glyphMap;
}> = ({ status, text, icon }) => {
  const statusColors = {
    active: COLORS.success,
    inactive: COLORS.textMuted,
    warning: COLORS.warning,
    error: COLORS.error,
  };

  return (
    <View style={[styles.statusBadge, { backgroundColor: `${statusColors[status]}20` }]}>
      {icon && (
        <Ionicons name={icon} size={14} color={statusColors[status]} />
      )}
      <Text style={[styles.statusText, { color: statusColors[status] }]}>
        {text}
      </Text>
    </View>
  );
};

// Typography Components
export const Typography: React.FC<{
  variant: keyof typeof TYPOGRAPHY;
  color?: string;
  children: React.ReactNode;
  style?: TextStyle;
}> = ({ variant, color = COLORS.textPrimary, children, style }) => (
  <Text style={[
    TYPOGRAPHY[variant],
    { color },
    style
  ]}>
    {children}
  </Text>
);

// Animated Card Component
export const AnimatedCard: React.FC<{
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  noPadding?: boolean;
}> = ({ children, style, onPress, noPadding = false }) => {
  const Component = onPress ? TouchableOpacity : View;
  
  return (
    <Component
      style={[styles.animatedCard, !noPadding && { padding: SPACING.lg }, style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
    >
      <LinearGradient
        colors={[COLORS.surface, COLORS.surfaceLight]}
        style={[StyleSheet.absoluteFill, { borderRadius: RADIUS.lg }]}
      />
      {children}
    </Component>
  );
};

// Feature List Component
export const FeatureList: React.FC<{
  features: Array<{
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    description?: string;
    verified?: boolean;
  }>;
}> = ({ features }) => (
  <View style={styles.featureList}>
    {features.map((feature, index) => (
      <View key={index} style={styles.featureItem}>
        <View style={styles.featureIcon}>
          <Ionicons name={feature.icon} size={16} color={COLORS.success} />
        </View>
        <View style={styles.featureContent}>
          <Text style={styles.featureTitle}>{feature.title}</Text>
          {feature.description && (
            <Text style={styles.featureDescription}>{feature.description}</Text>
          )}
        </View>
        {feature.verified && (
          <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
        )}
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  // Glass Card
  glassCard: {
    backgroundColor: COLORS.glass,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    borderRadius: RADIUS.lg,
    backdropFilter: 'blur(20px)',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    // Elevation for Android
    elevation: 8,
  },

  // Button Styles
  button: {
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,
  },
  buttonSecondary: {
    backgroundColor: COLORS.secondary,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  buttonGhost: {
    backgroundColor: 'transparent',
  },
  buttonSmall: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  buttonMedium: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  buttonLarge: {
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  buttonText: {
    fontWeight: '600',
  },
  buttonTextPrimary: {
    color: COLORS.textPrimary,
  },
  buttonTextSecondary: {
    color: COLORS.textPrimary,
  },
  buttonTextOutline: {
    color: COLORS.primary,
  },
  buttonTextGhost: {
    color: COLORS.primary,
  },
  buttonTextDisabled: {
    opacity: 0.5,
  },

  // Status Badge
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Animated Card
  animatedCard: {
    borderRadius: RADIUS.lg,
    position: 'relative',
    overflow: 'hidden',
    padding: SPACING.lg,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },

  // Feature List
  featureList: {
    gap: SPACING.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: `${COLORS.success}20`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  featureDescription: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
});

export default {
  COLORS,
  SPACING,
  RADIUS,
  TYPOGRAPHY,
  GlassCard,
  ModernButton,
  StatusBadge,
  Typography,
  AnimatedCard,
  FeatureList,
}; 