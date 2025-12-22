
import { StyleSheet } from 'react-native';
import { unmuteColors } from '@/constants/Colors';

// Premium Unmute Design System
// Calm, safe, minimal, European, slightly Apple-like
// ALL LIGHT COLORS - NO BLACK DESIGN

// Light theme colors (primary theme)
export const lightColors = {
  // Backgrounds - all light
  background: unmuteColors.bgDefault,
  backgroundSecondary: '#FAFBFC',
  surface: unmuteColors.surface,
  
  // Text - using dark grays instead of black
  text: '#374151', // Warm dark gray instead of black
  textSecondary: '#6B7280', // Medium gray
  textTertiary: '#9CA3AF', // Light gray
  
  // Brand colors - keeping the teal
  primary: unmuteColors.primary,
  primaryLight: '#7DBFB3',
  primaryDark: unmuteColors.primaryDark,
  
  // Accents
  secondary: '#EDF5F3',
  accent: unmuteColors.accent,
  highlight: '#E8F3F1',
  
  // Status
  error: unmuteColors.error,
  errorLight: '#FADBD8',
  success: unmuteColors.success,
  successLight: '#D1FAE5',
  warning: unmuteColors.warning,
  warningLight: '#FEF3C7',
  
  // UI elements
  card: unmuteColors.surface,
  border: unmuteColors.borderSubtle,
  borderLight: '#F3F4F6',
  disabled: '#F3F4F6',
  shadow: 'rgba(0, 0, 0, 0.06)',
  overlay: 'rgba(0, 0, 0, 0.4)',
};

// Dark theme colors (for future dark mode support)
export const darkColors = {
  background: '#F6F7FA', // Light background
  backgroundSecondary: '#FAFBFC',
  surface: '#FFFFFF',
  
  text: '#374151',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  
  primary: '#4A9B8E',
  primaryLight: '#7DBFB3',
  primaryDark: '#244354',
  
  secondary: '#EDF5F3',
  accent: '#F59E0B',
  highlight: '#E8F3F1',
  
  error: '#E53935',
  errorLight: '#FADBD8',
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  
  card: '#FFFFFF',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  disabled: '#F3F4F6',
  shadow: 'rgba(0, 0, 0, 0.06)',
  overlay: 'rgba(0, 0, 0, 0.4)',
};

// Default to light colors
export const colors = lightColors;

// Spacing scale - consistent and breathable
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  massive: 48,
};

// Screen layout constants
export const layout = {
  screenPaddingTop: 60,
  screenPaddingHorizontal: 24,
  contentPaddingBottom: 140,
  headerHeight: 60,
  bottomButtonHeight: 100,
};

// Typography scale - modern, clean, readable
// Using system fonts (SF Pro on iOS, Roboto on Android)
export const typography = {
  // H1 - Main titles (28-32pt, semibold, primaryDark)
  h1: {
    fontSize: 30,
    fontWeight: '600' as const,
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  
  // H2 - Section titles (20-22pt, semibold)
  h2: {
    fontSize: 21,
    fontWeight: '600' as const,
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  
  // Body - Regular text (15-17pt, regular, textPrimary)
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
    letterSpacing: 0,
  },
  
  bodyBold: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
    letterSpacing: 0,
  },
  
  // Helper/meta text (13-14pt, textSecondary)
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    letterSpacing: 0,
  },
  
  captionBold: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
    letterSpacing: 0,
  },
  
  // Legacy support
  hero: {
    fontSize: 36,
    fontWeight: '700' as const,
    lineHeight: 44,
    letterSpacing: -0.8,
  },
  
  title: {
    fontSize: 28,
    fontWeight: '600' as const,
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  
  subtitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  
  heading: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
    letterSpacing: -0.2,
  },
  
  small: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 18,
    letterSpacing: 0,
  },
  
  tiny: {
    fontSize: 11,
    fontWeight: '500' as const,
    lineHeight: 14,
    letterSpacing: 0.2,
  },
};

// Button styles - clean and minimal
export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  
  primaryActive: {
    backgroundColor: colors.primary,
  },
  
  primaryPressed: {
    backgroundColor: colors.primaryDark,
    transform: [{ scale: 0.98 }],
  },
  
  secondary: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  
  secondaryPressed: {
    backgroundColor: colors.backgroundSecondary,
    borderColor: colors.primary,
  },
  
  ghost: {
    backgroundColor: 'transparent',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  ghostPressed: {
    backgroundColor: colors.backgroundSecondary,
  },
  
  text: {
    ...typography.bodyBold,
    color: colors.surface,
  },
  
  textSecondary: {
    ...typography.bodyBold,
    color: colors.text,
  },
  
  textGhost: {
    ...typography.bodyBold,
    color: colors.primary,
  },
  
  link: {
    ...typography.caption,
    fontWeight: '500',
    color: colors.text,
    textDecorationLine: 'underline',
  },
  
  linkPrimary: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  
  disabled: {
    opacity: 0.4,
  },
});

// Common component styles
export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  
  title: {
    ...typography.h1,
    color: colors.primaryDark,
    marginBottom: spacing.sm,
  },
  
  subtitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  
  heading: {
    ...typography.heading,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  
  text: {
    ...typography.body,
    color: colors.text,
  },
  
  textSecondary: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  
  textTertiary: {
    ...typography.small,
    color: colors.textTertiary,
  },
  
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  
  cardElevated: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    ...typography.body,
    color: colors.text,
  },
  
  inputFocused: {
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  
  dividerVertical: {
    width: 1,
    backgroundColor: colors.border,
  },
});

// Animation configurations
export const animations = {
  spring: {
    damping: 20,
    stiffness: 120,
    mass: 1,
  },
  timing: {
    duration: 300,
  },
  timingFast: {
    duration: 150,
  },
  timingSlow: {
    duration: 500,
  },
};

// Border radius scale
export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 9999,
};

// Shadow presets - soft and subtle
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
};
