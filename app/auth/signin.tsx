
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { router } from 'expo-router';
import { colors, spacing, typography, borderRadius, layout, shadows } from '@/styles/commonStyles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useAuth } from '@/contexts/AuthContext';
import { IconSymbol } from '@/components/IconSymbol';
import Constants from 'expo-constants';

const isExpoGo = Constants.appOwnership === 'expo';

export default function SignInScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      await signIn(email.trim());
      // Don't navigate - user needs to click the magic link first
      // (unless it's a test email in Expo Go, which will auto-login)
    } catch (error) {
      console.log('Sign in error:', error);
      // Error is already handled in AuthContext with Alert
    } finally {
      setLoading(false);
    }
  };

  const handleSkipLogin = async () => {
    try {
      setLoading(true);
      // Use a test email for dummy login
      await signIn('test@test.com');
    } catch (error) {
      console.log('Skip login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={[styles.iconCircle, { backgroundColor: colors.highlight }, shadows.md]}>
            <Text style={[styles.bracketsLogo, { color: colors.primary }]}>[ ]</Text>
          </View>
        </View>

        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <IconSymbol 
                ios_icon_name="envelope.fill" 
                android_material_icon_name="email" 
                size={20} 
                color={colors.textSecondary} 
              />
              <TextInput
                style={styles.input}
                placeholder="your@email.com"
                placeholderTextColor={colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
                editable={!loading}
              />
            </View>
          </View>

          <View style={styles.infoBox}>
            <IconSymbol 
              ios_icon_name="info.circle.fill" 
              android_material_icon_name="info" 
              size={20} 
              color={colors.primary} 
            />
            <Text style={styles.infoText}>
              We&apos;ll send you a magic link to sign in. No password needed!
            </Text>
          </View>

          {isExpoGo && (
            <View style={styles.testInfoBox}>
              <IconSymbol 
                ios_icon_name="flask.fill" 
                android_material_icon_name="science" 
                size={20} 
                color={colors.accent} 
              />
              <Text style={styles.testInfoText}>
                <Text style={styles.testInfoBold}>Testing in Expo Go?</Text>{'\n'}
                Use AABB@test.com, test@test.com, or demo@test.com for instant login without email verification.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSignIn}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Signing in...' : 'Continue with email'}
          </Text>
        </TouchableOpacity>

        {isExpoGo && (
          <TouchableOpacity 
            style={[styles.skipButton, loading && styles.buttonDisabled]}
            onPress={handleSkipLogin}
            disabled={loading}
          >
            <IconSymbol 
              ios_icon_name="flask.fill" 
              android_material_icon_name="science" 
              size={18} 
              color={colors.accent} 
            />
            <Text style={styles.skipButtonText}>
              Skip Login (Testing)
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={styles.linkButton}
          onPress={() => router.back()}
          disabled={loading}
        >
          <Text style={styles.linkText}>
            Don&apos;t have an account? <Text style={styles.linkTextBold}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingTop: Platform.OS === 'android' ? 80 : 100,
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingBottom: 240,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bracketsLogo: {
    fontSize: 44,
    fontWeight: '300',
    letterSpacing: -2,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '400',
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xxxl + spacing.lg,
  },
  form: {
    gap: spacing.xxl,
  },
  inputContainer: {
    gap: spacing.md,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + spacing.xs,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
    color: colors.text,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.primary + '30',
    borderRadius: borderRadius.md,
    padding: spacing.lg,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 20,
  },
  testInfoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    backgroundColor: colors.accent + '15',
    borderWidth: 1.5,
    borderColor: colors.accent + '40',
    borderRadius: borderRadius.md,
    padding: spacing.lg,
  },
  testInfoText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 20,
  },
  testInfoBold: {
    fontWeight: '600',
    color: colors.accent,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl + spacing.md,
    backgroundColor: colors.background,
    gap: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 8,
  },
  button: {
    width: '100%',
    paddingVertical: spacing.lg + spacing.xs,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.card,
    letterSpacing: 0.2,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  skipButton: {
    width: '100%',
    paddingVertical: spacing.md + spacing.xs,
    borderRadius: borderRadius.md,
    backgroundColor: colors.accent + '15',
    borderWidth: 1.5,
    borderColor: colors.accent + '40',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  skipButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.accent,
    letterSpacing: 0.2,
  },
  linkButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  linkText: {
    fontSize: 15,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  linkTextBold: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
});
