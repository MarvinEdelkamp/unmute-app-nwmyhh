
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert, Image, Platform } from 'react-native';
import { router } from 'expo-router';
import { colors, spacing, typography, borderRadius, layout } from '@/styles/commonStyles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useAuth } from '@/contexts/AuthContext';
import { IconSymbol } from '@/components/IconSymbol';
import * as ImagePicker from 'expo-image-picker';

export default function SignUpScreen() {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
      }
    } catch (error) {
      console.log('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleContinue = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      await signUp(email, 'password123', name);
      router.push('/auth/interests');
    } catch (error) {
      Alert.alert('Error', 'Failed to create profile. Please try again.');
      console.log('Sign up error:', error);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = name.trim().length > 0 && email.trim().length > 0 && email.includes('@');

  return (
    <View style={styles.container}>
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
                  size={32} 
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
            <View style={styles.inputWrapper}>
              <IconSymbol 
                ios_icon_name="person.fill" 
                android_material_icon_name="person" 
                size={20} 
                color={colors.textSecondary} 
              />
              <TextInput
                style={styles.input}
                placeholder="e.g. Sophie"
                placeholderTextColor={colors.textSecondary}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email address</Text>
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
              />
            </View>
            <Text style={styles.inputNote}>
              For account recovery only. Never shown to others
            </Text>
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
        >
          <Text style={styles.buttonText}>
            {loading ? 'Creating...' : 'Continue'}
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
    paddingTop: Platform.OS === 'android' ? layout.screenPaddingTop : layout.screenPaddingTop,
  },
  scrollContent: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.xl,
    paddingBottom: layout.contentPaddingBottom,
  },
  title: {
    ...typography.title,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.xxxl,
  },
  form: {
    gap: spacing.xxl,
  },
  photoSection: {
    gap: spacing.md,
  },
  label: {
    ...typography.bodyBold,
    color: colors.text,
  },
  photoButton: {
    width: 100,
    height: 100,
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
    ...typography.caption,
    color: colors.textSecondary,
  },
  inputContainer: {
    gap: spacing.sm,
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
    paddingVertical: spacing.md,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text,
  },
  inputNote: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  infoBox: {
    backgroundColor: colors.highlight,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
  },
  infoText: {
    ...typography.caption,
    color: colors.text,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: layout.screenPaddingHorizontal,
    paddingBottom: spacing.xxxl,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  button: {
    width: '100%',
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonActive: {
    backgroundColor: colors.primary,
  },
  buttonDisabled: {
    backgroundColor: colors.disabled,
  },
  buttonText: {
    ...typography.bodyBold,
    color: colors.card,
  },
});
