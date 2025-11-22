
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { IconSymbol } from '@/components/IconSymbol';

export default function HowItWorksScreen() {
  return (
    <View style={[commonStyles.container, styles.container]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[commonStyles.title, styles.title]}>How it works</Text>

        <View style={styles.stepContainer}>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <View style={styles.stepHeader}>
                <IconSymbol 
                  ios_icon_name="heart.fill" 
                  android_material_icon_name="favorite" 
                  size={24} 
                  color={colors.primary} 
                />
                <Text style={styles.stepTitle}>Choose your interests</Text>
              </View>
              <Text style={styles.stepDescription}>
                Pick 3-7 things you&apos;re passionate about
              </Text>
            </View>
          </View>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <View style={styles.stepHeader}>
                <IconSymbol 
                  ios_icon_name="power" 
                  android_material_icon_name="power_settings_new" 
                  size={24} 
                  color={colors.primary} 
                />
                <Text style={styles.stepTitle}>Turn &quot;Open&quot; on</Text>
              </View>
              <Text style={styles.stepDescription}>
                When you&apos;re ready to connect, toggle your status to Open
              </Text>
            </View>
          </View>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <View style={styles.stepHeader}>
                <IconSymbol 
                  ios_icon_name="sparkles" 
                  android_material_icon_name="auto_awesome" 
                  size={24} 
                  color={colors.primary} 
                />
                <Text style={styles.stepTitle}>Get matched</Text>
              </View>
              <Text style={styles.stepDescription}>
                If someone nearby with shared interests is also Open, you&apos;ll both get a match
              </Text>
            </View>
          </View>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>4</Text>
            </View>
            <View style={styles.stepContent}>
              <View style={styles.stepHeader}>
                <IconSymbol 
                  ios_icon_name="hand.wave.fill" 
                  android_material_icon_name="waving_hand" 
                  size={24} 
                  color={colors.primary} 
                />
                <Text style={styles.stepTitle}>Say hi in person</Text>
              </View>
              <Text style={styles.stepDescription}>
                Use quick coordination to find each other and meet face-to-face
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[buttonStyles.primary, styles.button]}
          onPress={() => router.push('/onboarding/safety')}
        >
          <Text style={[buttonStyles.text, { color: colors.card }]}>Next</Text>
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
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  title: {
    textAlign: 'center',
    marginBottom: 32,
  },
  stepContainer: {
    gap: 20,
  },
  step: {
    flexDirection: 'row',
    gap: 16,
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.card,
  },
  stepContent: {
    flex: 1,
    gap: 8,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  stepDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  buttonContainer: {
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
});
