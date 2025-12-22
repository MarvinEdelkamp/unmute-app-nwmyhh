
import { StyleSheet } from 'react-native';
import { unmuteColors } from '@/constants/Colors';

// Unmute Premium Design System
// Trust-first, calm, privacy-by-default, warm minimalism
// Apple-level craft

// Color palette - warm, calm, readable
export const colors = {
  // Primary brand
  primary: unmuteColors.primary,
  primaryDark: unmuteColors.primaryDark,
  primaryLight: unmuteColors.primaryLight,
  
  // Backgrounds
  background: unmuteColors.background,
  surface: unmuteColors.surface,
  surface2: unmuteColors.surface2,
  
  // Text hierarchy
  text: unmuteColors.textPrimary,
  textSecondary: unmuteColors.textSecondary,
  textTertiary: unmuteColors.textTertiary,
  textPlaceholder: unmuteColors.textPlaceholder,
  
  // UI elements
  border: unmuteColors.border,
  infoBg: unmuteColors.infoBg,
  
  // Status
  danger: unmuteColors.danger,
  dangerBg: unmuteColors.dangerBg,
  success: unmuteColors.success,
  successBg: unmuteColors.successBg,
  warning: unmuteColors.warning,
  warningBg: unmuteColors.warningBg,
  
  // Accent
  accent: unmuteColors.accent,
  
  // Semantic aliases
  card: unmuteColors.surface,
  highlight: unmuteColors.infoBg,
  secondary: unmuteColors.infoBg,
  disabled: unmuteColors.surface2,
  error: unmuteColors.danger,
  errorLight: unmuteColors.dangerBg,
  successLight: unmuteColors.successBg,
  warningLight: unmuteColors.warningBg,
  backgroundSecondary: unmuteColors.surface,
  borderLight: unmuteColors.surface2,
  shadow: 'rgba(45, 42, 39, 0.08)',
  overlay: 'rgba(45, 42, 39, 0.4)',
};

// Spacing scale - consistent, breathable
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

// Typography scale - Inter-like system font
// H1: 34/40 Semibold
// H2: 24/30 Semibold
// Body: 16/26 Regular
// Caption: 13/18 Regular
export const typography = {
  // H1 - Main titles
  h1: {
    fontSize: 34,
    fontWeight: '600' as const,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  
  // H2 - Section titles
  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 30,
    letterSpacing: -0.3,
  },
  
  // Body - Regular text
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 26,
    letterSpacing: 0,
  },
  
  bodyBold: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 26,
    letterSpacing: 0,
  },
  
  // Caption - Helper/meta text
  caption: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 18,
    letterSpacing: 0,
  },
  
  captionBold: {
    fontSize: 13,
    fontWeight: '600' as const,
    lineHeight: 18,
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

// Shadow presets - soft, subtle
export const shadows = {
  sm: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 3,
  },
  xl: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 4,
  },
};

// Button styles - Primary (gradient), Secondary (flat), Tertiary (text), Danger
export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    ...shadows.md,
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
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  
  secondaryPressed: {
    backgroundColor: colors.surface2,
    borderColor: colors.primary,
  },
  
  ghost: {
    backgroundColor: 'transparent',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  ghostPressed: {
    backgroundColor: colors.surface2,
  },
  
  danger: {
    backgroundColor: colors.danger,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    ...shadows.md,
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
  
  textDanger: {
    ...typography.bodyBold,
    color: colors.surface,
  },
  
  link: {
    ...typography.caption,
    fontWeight: '500',
    color: colors.textSecondary,
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
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  
  cardElevated: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.md,
  },
  
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    ...typography.body,
    color: colors.text,
  },
  
  inputFocused: {
    borderColor: colors.primary,
    ...shadows.sm,
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
  // Breathing animation for Open ring
  breathing: {
    duration: 4500,
    scale: {
      from: 1,
      to: 1.03,
    },
    opacity: {
      from: 0.18,
      to: 0.28,
    },
  },
};

// Light theme colors (for ThemeContext)
export const lightColors = colors;

// Dark theme colors (same as light for now - no dark mode)
export const darkColors = colors;
