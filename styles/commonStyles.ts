
import { StyleSheet } from 'react-native';

// Enhanced color system with dark mode support - NEW CALMING BLUE COLOR SCHEME
export const lightColors = {
  background: '#FFFFFF',
  backgroundSecondary: '#F8F9FA',
  text: '#1A1A1A',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  primary: '#3B6B8C', // Darker, calming blue with slight teal influence
  primaryLight: '#A8C5D9',
  primaryDark: '#2A4F6C',
  secondary: '#E8F1F5',
  accent: '#FFD93D',
  card: '#FFFFFF',
  highlight: '#D4E4ED',
  error: '#E74C3C',
  errorLight: '#FADBD8',
  success: '#2ECC71',
  successLight: '#D5F4E6',
  warning: '#F39C12',
  warningLight: '#FCF3CF',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  disabled: '#F3F4F6',
  shadow: 'rgba(0, 0, 0, 0.08)',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

export const darkColors = {
  background: '#121212',
  backgroundSecondary: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textTertiary: '#808080',
  primary: '#5A8FB0', // Lighter blue for dark mode
  primaryLight: '#7FAFC9',
  primaryDark: '#3B6B8C',
  secondary: '#2A3F45',
  accent: '#FFD93D',
  card: '#1E1E1E',
  highlight: '#2A4A52',
  error: '#FF6B6B',
  errorLight: '#3D2626',
  success: '#51CF66',
  successLight: '#2D3D2F',
  warning: '#FFA94D',
  warningLight: '#3D3426',
  border: '#2C2C2C',
  borderLight: '#252525',
  disabled: '#2C2C2C',
  shadow: 'rgba(0, 0, 0, 0.3)',
  overlay: 'rgba(0, 0, 0, 0.7)',
};

// Default to light colors (will be overridden by theme context)
export const colors = lightColors;

// Standardized spacing scale - CONSISTENT ACROSS ALL SCREENS
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

// Screen layout constants - USE THESE FOR CONSISTENCY
export const layout = {
  screenPaddingTop: 60,
  screenPaddingHorizontal: 24,
  contentPaddingBottom: 140,
  headerHeight: 60,
  bottomButtonHeight: 100,
};

// Typography scale
export const typography = {
  hero: {
    fontSize: 36,
    fontWeight: '800' as const,
    lineHeight: 44,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyBold: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  captionBold: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  tiny: {
    fontSize: 10,
    fontWeight: '500' as const,
    lineHeight: 14,
  },
};

// Enhanced button styles
export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0px 4px 12px ${colors.shadow}`,
    elevation: 3,
  },
  primaryActive: {
    backgroundColor: colors.primary,
  },
  primaryPressed: {
    backgroundColor: colors.primaryDark,
    transform: [{ scale: 0.98 }],
  },
  secondary: {
    backgroundColor: colors.card,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
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
    color: colors.card,
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
    fontWeight: '500',
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
    ...typography.title,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.subtitle,
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
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 2,
  },
  cardElevated: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    boxShadow: `0px 4px 16px ${colors.shadow}`,
    elevation: 4,
  },
  input: {
    backgroundColor: colors.card,
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
    boxShadow: `0px 0px 0px 3px ${colors.primaryLight}33`,
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

// Shadow presets
export const shadows = {
  sm: {
    boxShadow: `0px 1px 3px ${colors.shadow}`,
    elevation: 1,
  },
  md: {
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 2,
  },
  lg: {
    boxShadow: `0px 4px 16px ${colors.shadow}`,
    elevation: 4,
  },
  xl: {
    boxShadow: `0px 8px 24px ${colors.shadow}`,
    elevation: 8,
  },
};
