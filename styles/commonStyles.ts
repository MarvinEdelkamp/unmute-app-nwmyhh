
import { StyleSheet } from 'react-native';

export const colors = {
  background: '#F8F9FA',
  text: '#2C3E50',
  textSecondary: '#7F8C8D',
  primary: '#4ECDC4',
  primaryLight: '#A8E6CF',
  secondary: '#E8F5F4',
  accent: '#FFD93D',
  card: '#FFFFFF',
  highlight: '#E8F5F4',
  error: '#E74C3C',
  success: '#2ECC71',
  border: '#E0E0E0',
  disabled: '#ECF0F1',
  shadow: 'rgba(0, 0, 0, 0.08)',
};

export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondary: {
    backgroundColor: colors.card,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.card,
  },
  textSecondary: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  link: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
    textDecorationLine: 'underline',
  },
  linkPrimary: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.primary,
    textDecorationLine: 'underline',
  },
});

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  textSecondary: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 2,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
