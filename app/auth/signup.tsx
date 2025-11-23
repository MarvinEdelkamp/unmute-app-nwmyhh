
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Image, Platform, KeyboardAvoidingView } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { spacing, typography, borderRadius, layout, shadows } from '@/styles/commonStyles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useAuth } from '@/contexts/AuthContext';
import { IconSymbol } from '@/components/IconSymbol';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { validation, sanitize } from '@/utils/validation';
import { errorHandler } from '@/utils/errorHandler';
import { hapticFeedback } from '@/utils/haptics';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '@/utils/storage';
import { User } from '@/types';

export default function SignUpScreen() {
  const { signUp, signIn } = useAuth();
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [isLogin, setIsLogin] = useState(false);

  // Check if user already exists
  useEffect(() => {
    checkExistingUser();
  }, []);

  const checkExistingUser = async () => {
    try {
      const userData = await storage.getItem<User>('user');
      if (userData) {
        setIsLogin(true);
        setEmail(userData.email);
        console.log('[SignUp] Existing user found, switching to login mode');
      }
    } catch (error) {
      console.error('[SignUp] Error checking existing user:', error);
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setAvatar(result.assets[0].uri);
        hapticFeedback.success();
      }
    } catch (error) {
      errorHandler.logError(error as Error, 'IMAGE_PICKER');
      errorHandler.showError('Failed to pick image. Please try again.');
      console.error('Image picker error:', error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { name?: string; email?: string } = {};

    if (!isLogin) {
      const nameValidation = validation.name(name);
      if (!nameValidation.valid) {
        newErrors.name = nameValidation.error;
      }
    }

    const emailValidation = validation.email(email);
    if (!emailValidation.valid) {
      newErrors.email = emailValidation.error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async () => {
    if (!validateForm()) {
      hapticFeedback.warning();
      return;
    }

    try {
      setLoading(true);
      hapticFeedback.medium();
      
      if (isLogin) {
        await signIn(email, 'password123');
        hapticFeedback.success();
        router.replace('/(tabs)/(home)/');
      } else {
        await signUp(email, 'password123', name);
        hapticFeedback.success();
        router.replace('/auth/interests');
      }
    } catch (error) {
      hapticFeedback.error();
      const errorMessage = error instanceof Error ? error.message : isLogin ? 'Failed to sign in' : 'Failed to create profile';
      errorHandler.showError(errorMessage);
      console.error(isLogin ? 'Sign in error:' : 'Sign up error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (text: string) => {
    setName(text);
    if (errors.name) {
      setErrors({ ...errors, name: undefined });
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (errors.email) {
      setErrors({ ...errors, email: undefined });
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    hapticFeedback.light();
  };

  const isFormValid = isLogin 
    ? email.trim().length > 0 && email.includes('@')
    : name.trim().length > 0 && email.trim().length > 0 && email.includes('@');

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.title, { color: theme.text }]}>
          {isLogin ? 'Welcome back' : 'Create your profile'}
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          {isLogin ? 'Sign in to continue' : 'Just the basics'}
        </Text>

        <View style={styles.form}>
          {!isLogin && (
            <>
              <View style={styles.photoSection}>
                <Text style={[styles.label, { color: theme.text }]}>Photo (optional)</Text>
                <TouchableOpacity 
                  style={[styles.photoButton, { borderColor: theme.border, backgroundColor: theme.card }]}
                  onPress={handlePickImage}
                >
                  {avatar ? (
                    <Image source={{ uri: avatar }} style={styles.avatarImage} />
                  ) : (
                    <IconSymbol 
                      ios_icon_name="camera.fill" 
                      android_material_icon_name="photo_camera" 
                      size={36} 
                      color={theme.textSecondary} 
                    />
                  )}
                </TouchableOpacity>
                <Text style={[styles.photoNote, { color: theme.textSecondary }]}>
                  Shared only with matches when you both say yes
                </Text>
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: theme.text }]}>First name or nickname</Text>
                <View style={[
                  styles.inputWrapper,
                  { backgroundColor: theme.card, borderColor: errors.name ? theme.error : theme.border },
                  errors.name && { backgroundColor: theme.errorLight }
                ]}>
                  <IconSymbol 
                    ios_icon_name="person.fill" 
                    android_material_icon_name="person" 
                    size={20} 
                    color={errors.name ? theme.error : theme.textSecondary} 
                  />
                  <TextInput
                    style={[styles.input, { color: theme.text }]}
                    placeholder="e.g. Sophie"
                    placeholderTextColor={theme.textSecondary}
                    value={name}
                    onChangeText={handleNameChange}
                    autoCapitalize="words"
                    autoCorrect={false}
                    returnKeyType="next"
                  />
                </View>
                {errors.name && (
                  <Text style={[styles.errorText, { color: theme.error }]}>{errors.name}</Text>
                )}
              </View>
            </>
          )}

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.text }]}>Email address</Text>
            <View style={[
              styles.inputWrapper,
              { backgroundColor: theme.card, borderColor: errors.email ? theme.error : theme.border },
              errors.email && { backgroundColor: theme.errorLight }
            ]}>
              <IconSymbol 
                ios_icon_name="envelope.fill" 
                android_material_icon_name="email" 
                size={20} 
                color={errors.email ? theme.error : theme.textSecondary} 
              />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="your@email.com"
                placeholderTextColor={theme.textSecondary}
                value={email}
                onChangeText={handleEmailChange}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleContinue}
              />
            </View>
            {errors.email && (
              <Text style={[styles.errorText, { color: theme.error }]}>{errors.email}</Text>
            )}
            {!errors.email && !isLogin && (
              <Text style={[styles.inputNote, { color: theme.textSecondary }]}>
                For account recovery only. Never shown to others
              </Text>
            )}
          </View>

          {!isLogin && (
            <View style={[styles.infoBox, { backgroundColor: theme.secondary, borderColor: theme.primaryLight }]}>
              <Text style={[styles.infoText, { color: theme.text }]}>
                No bios, no follower counts. Unmute keeps profiles minimal so conversations stay real.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={[styles.bottomContainer, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
        <TouchableOpacity 
          style={[
            styles.button,
            { backgroundColor: isFormValid ? theme.primary : theme.disabled },
            isFormValid ? shadows.md : {},
          ]}
          onPress={handleContinue}
          disabled={!isFormValid || loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <LoadingSpinner size="small" />
          ) : (
            <Text style={[
              styles.buttonText,
              { color: isFormValid ? theme.card : theme.textTertiary }
            ]}>
              {isLogin ? 'Sign In' : 'Continue'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.linkButton}
          onPress={toggleMode}
        >
          <Text style={[styles.linkText, { color: theme.textSecondary }]}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Text style={[styles.linkTextBold, { color: theme.primary }]}>
              {isLogin ? 'Sign up' : 'Sign in'}
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Platform.OS === 'android' ? 80 : 100,
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingBottom: 200,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: spacing.sm,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '400',
    marginBottom: spacing.xxxl + spacing.lg,
  },
  form: {
    gap: spacing.xxl + spacing.xs,
  },
  photoSection: {
    gap: spacing.md,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  photoButton: {
    width: 110,
    height: 110,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.md,
  },
  photoNote: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  inputContainer: {
    gap: spacing.md,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1.5,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + spacing.xs,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
  },
  inputNote: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  infoBox: {
    padding: spacing.lg + spacing.xs,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  infoText: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 22,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl + spacing.md,
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 8,
    gap: spacing.md,
  },
  button: {
    width: '100%',
    minHeight: 56,
    paddingVertical: spacing.lg + spacing.xs,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  linkButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  linkText: {
    fontSize: 15,
    fontWeight: '400',
  },
  linkTextBold: {
    fontSize: 15,
    fontWeight: '600',
  },
});
