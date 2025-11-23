
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Image, Platform, KeyboardAvoidingView } from 'react-native';
import { router } from 'expo-router';
import { colors, spacing, typography, borderRadius, layout } from '@/styles/commonStyles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useAuth } from '@/contexts/AuthContext';
import { IconSymbol } from '@/components/IconSymbol';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { validation, sanitize } from '@/utils/validation';
import { errorHandler } from '@/utils/errorHandler';
import { hapticFeedback } from '@/utils/haptics';
import * as ImagePicker from 'expo-image-picker';

export default function SignUpScreen() {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

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

    const nameValidation = validation.name(name);
    if (!nameValidation.valid) {
      newErrors.name = nameValidation.error;
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
      
      await signUp(email, 'password123', name);
      
      hapticFeedback.success();
      router.replace('/auth/interests');
    } catch (error) {
      hapticFeedback.error();
      const errorMessage = error instanceof Error ? error.message : 'Failed to create profile';
      errorHandler.showError(errorMessage);
      console.error('Sign up error:', error);
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

  const isFormValid = name.trim().length > 0 && email.trim().length > 0 && email.includes('@');

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Create your profile</Text>
        <Text style={styles.subtitle}>Just the basics</Text>

        <View style={styles.form}>
          <View style={styles.photoSection}>
            <Text style={styles.label}>Photo (optional)</Text>
            <TouchableOpacity 
              style={styles.photoButton}
              onPress={handlePickImage}
            >
              {avatar ? (
                <Image source={{ uri: avatar }} style={styles.avatarImage} />
              ) : (
                <IconSymbol 
                  ios_icon_name="camera.fill" 
                  android_material_icon_name="photo_camera" 
                  size={36} 
                  color={colors.textSecondary} 
                />
              )}
            </TouchableOpacity>
            <Text style={styles.photoNote}>
              Shared only with matches when you both say yes
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>First name or nickname</Text>
            <View style={[
              styles.inputWrapper,
              errors.name && styles.inputWrapperError
            ]}>
              <IconSymbol 
                ios_icon_name="person.fill" 
                android_material_icon_name="person" 
                size={20} 
                color={errors.name ? colors.error : colors.textSecondary} 
              />
              <TextInput
                style={styles.input}
                placeholder="e.g. Sophie"
                placeholderTextColor={colors.textSecondary}
                value={name}
                onChangeText={handleNameChange}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="next"
              />
            </View>
            {errors.name && (
              <Text style={styles.errorText}>{errors.name}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email address</Text>
            <View style={[
              styles.inputWrapper,
              errors.email && styles.inputWrapperError
            ]}>
              <IconSymbol 
                ios_icon_name="envelope.fill" 
                android_material_icon_name="email" 
                size={20} 
                color={errors.email ? colors.error : colors.textSecondary} 
              />
              <TextInput
                style={styles.input}
                placeholder="your@email.com"
                placeholderTextColor={colors.textSecondary}
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
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
            {!errors.email && (
              <Text style={styles.inputNote}>
                For account recovery only. Never shown to others
              </Text>
            )}
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              No bios, no follower counts. Unmute keeps profiles minimal so conversations stay real.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={[
            styles.button,
            isFormValid ? styles.buttonActive : styles.buttonDisabled
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
              isFormValid ? styles.buttonTextActive : styles.buttonTextDisabled
            ]}>
              Continue
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    paddingBottom: 160,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '400',
    color: colors.textSecondary,
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
    color: colors.text,
  },
  photoButton: {
    width: 110,
    height: 110,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.md,
  },
  photoNote: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 20,
  },
  inputContainer: {
    gap: spacing.md,
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
  inputWrapperError: {
    borderColor: colors.error,
    backgroundColor: colors.errorLight,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
    color: colors.text,
  },
  inputNote: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 20,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.error,
    lineHeight: 20,
  },
  infoBox: {
    backgroundColor: colors.secondary,
    padding: spacing.lg + spacing.xs,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  infoText: {
    fontSize: 15,
    fontWeight: '400',
    color: colors.text,
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
    backgroundColor: colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 8,
  },
  button: {
    width: '100%',
    minHeight: 56,
    paddingVertical: spacing.lg + spacing.xs,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonActive: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: colors.disabled,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  buttonTextActive: {
    color: '#FFFFFF',
  },
  buttonTextDisabled: {
    color: colors.textTertiary,
  },
});
