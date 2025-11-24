
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Image, Platform, KeyboardAvoidingView, Alert } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { spacing, typography, borderRadius, layout, shadows } from '@/styles/commonStyles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useAuth } from '@/contexts/AuthContext';
import { IconSymbol } from '@/components/IconSymbol';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { hapticFeedback } from '@/utils/haptics';
import * as ImagePicker from 'expo-image-picker';

export default function SignUpScreen() {
  const { signUp, signIn, user, profile, createProfile } = useAuth();
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [step, setStep] = useState<'email' | 'profile'>('email');

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
      console.error('Image picker error:', error);
    }
  };

  const handleSendMagicLink = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    try {
      setLoading(true);
      hapticFeedback.medium();
      
      if (isLogin) {
        await signIn(email);
      } else {
        await signUp(email);
      }
      
      hapticFeedback.success();
    } catch (error) {
      hapticFeedback.error();
      const errorMessage = error instanceof Error ? error.message : 'Failed to send magic link';
      Alert.alert('Error', errorMessage);
      console.error('Magic link error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    try {
      setLoading(true);
      hapticFeedback.medium();
      
      await createProfile(name, avatar || undefined);
      
      hapticFeedback.success();
      router.replace('/auth/interests');
    } catch (error) {
      hapticFeedback.error();
      const errorMessage = error instanceof Error ? error.message : 'Failed to create profile';
      Alert.alert('Error', errorMessage);
      console.error('Create profile error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    hapticFeedback.light();
  };

  // If user is logged in but no profile, show profile creation
  if (user && !profile && step === 'email') {
    setStep('profile');
  }

  if (step === 'profile') {
    return (
      <KeyboardAvoidingView 
        style={[styles.container, { backgroundColor: theme.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[styles.title, { color: theme.text }]}>Create your profile</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Just the basics</Text>

          <View style={styles.form}>
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
              <View style={[styles.inputWrapper, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <IconSymbol 
                  ios_icon_name="person.fill" 
                  android_material_icon_name="person" 
                  size={20} 
                  color={theme.textSecondary} 
                />
                <TextInput
                  style={[styles.input, { color: theme.text }]}
                  placeholder="e.g. Sophie"
                  placeholderTextColor={theme.textSecondary}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  autoCorrect={false}
                  returnKeyType="done"
                  onSubmitEditing={handleCreateProfile}
                />
              </View>
            </View>

            <View style={[styles.infoBox, { backgroundColor: theme.secondary, borderColor: theme.primaryLight }]}>
              <Text style={[styles.infoText, { color: theme.text }]}>
                No bios, no follower counts. Unmute keeps profiles minimal so conversations stay real.
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={[styles.bottomContainer, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
          <TouchableOpacity 
            style={[
              styles.button,
              { backgroundColor: name.trim() ? theme.primary : theme.disabled },
              name.trim() ? shadows.md : {},
            ]}
            onPress={handleCreateProfile}
            disabled={!name.trim() || loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <LoadingSpinner size="small" />
            ) : (
              <Text style={[
                styles.buttonText,
                { color: name.trim() ? theme.card : theme.textTertiary }
              ]}>
                Continue
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.title, { color: theme.text }]}>
          {isLogin ? 'Welcome back' : 'Get started'}
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          {isLogin ? 'Sign in with your email' : 'Create your account'}
        </Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.text }]}>Email address</Text>
            <View style={[styles.inputWrapper, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <IconSymbol 
                ios_icon_name="envelope.fill" 
                android_material_icon_name="email" 
                size={20} 
                color={theme.textSecondary} 
              />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="your@email.com"
                placeholderTextColor={theme.textSecondary}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={handleSendMagicLink}
              />
            </View>
            <Text style={[styles.inputNote, { color: theme.textSecondary }]}>
              We&apos;ll send you a magic link to sign in
            </Text>
          </View>

          <View style={[styles.infoBox, { backgroundColor: theme.secondary, borderColor: theme.primaryLight }]}>
            <IconSymbol 
              ios_icon_name="lock.fill" 
              android_material_icon_name="lock" 
              size={18} 
              color={theme.primary} 
            />
            <Text style={[styles.infoText, { color: theme.text }]}>
              No passwords needed. We&apos;ll email you a secure link to sign in.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.bottomContainer, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
        <TouchableOpacity 
          style={[
            styles.button,
            { backgroundColor: email.trim() && email.includes('@') ? theme.primary : theme.disabled },
            email.trim() && email.includes('@') ? shadows.md : {},
          ]}
          onPress={handleSendMagicLink}
          disabled={!email.trim() || !email.includes('@') || loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <LoadingSpinner size="small" />
          ) : (
            <Text style={[
              styles.buttonText,
              { color: email.trim() && email.includes('@') ? theme.card : theme.textTertiary }
            ]}>
              {isLogin ? 'Send magic link' : 'Continue'}
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
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    padding: spacing.lg + spacing.xs,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  infoText: {
    flex: 1,
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
