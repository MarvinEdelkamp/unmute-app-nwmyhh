
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { router } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
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
      router.replace('/auth/interests');
    } catch (error) {
      Alert.alert('Error', 'Failed to create profile. Please try again.');
      console.log('Sign up error:', error);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = name.trim().length > 0 && email.trim().length > 0 && email.includes('@');

  return (
    <View style={[commonStyles.container, styles.container]}>
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
            buttonStyles.primary, 
            styles.button,
            (!isFormValid || loading) && styles.buttonDisabled
          ]}
          onPress={handleContinue}
          disabled={!isFormValid || loading}
        >
          <Text style={[buttonStyles.text, { color: colors.card }]}>
            {loading ? 'Creating...' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
  },
  scrollContent: {
    paddingHorizontal: 32,
    paddingTop: 20,
    paddingBottom: 140,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 40,
  },
  form: {
    gap: 32,
  },
  photoSection: {
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  photoButton: {
    width: 100,
    height: 100,
    borderRadius: 16,
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
    borderRadius: 14,
  },
  photoNote: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  inputContainer: {
    gap: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  inputNote: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  infoBox: {
    backgroundColor: colors.highlight,
    padding: 16,
    borderRadius: 12,
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: colors.background,
  },
  button: {
    width: '100%',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
});
