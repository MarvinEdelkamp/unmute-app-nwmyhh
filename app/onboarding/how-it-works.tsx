
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { router } from 'expo-router';
import { colors, spacing, typography, borderRadius, layout } from '@/styles/commonStyles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { IconSymbol } from '@/components/IconSymbol';

export default function HowItWorksScreen() {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <IconSymbol 
          ios_icon_name="chevron.left" 
          android_material_icon_name="arrow_back" 
          size={24} 
          color={colors.text} 
        />
      </TouchableOpacity>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>How it works</Text>
        <Text style={styles.subtitle}>Three simple steps</Text>

        <View style={styles.stepsContainer}>
          <View style={styles.step}>
            <View style={styles.stepLeft}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepLine} />
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Toggle &quot;Open&quot;</Text>
              <Text style={styles.stepDescription}>
                When you&apos;re ready to connect, tap Open. You&apos;re only visible while it&apos;s on.
              </Text>
            </View>
          </View>

          <View style={styles.step}>
            <View style={styles.stepLeft}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepLine} />
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Get matched nearby</Text>
              <Text style={styles.stepDescription}>
                When someone here shares your interests and is also Open, you both get a quiet notification.
              </Text>
            </View>
          </View>

          <View style={styles.step}>
            <View style={styles.stepLeft}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Say hi in person</Text>
              <Text style={styles.stepDescription}>
                The app creates the opportunity. The real conversation happens face to face.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.infoBox}>
          <IconSymbol 
            ios_icon_name="lock.fill" 
            android_material_icon_name="lock" 
            size={20} 
            color={colors.primary} 
          />
          <Text style={styles.infoText}>
            We never show your exact location. Matches expire quickly if no one responds.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.push('/onboarding/safety')}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
        
        <View style={styles.pagination}>
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
        </View>
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
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? layout.screenPaddingTop + spacing.sm : layout.screenPaddingTop + spacing.sm,
    left: layout.screenPaddingHorizontal,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
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
  stepsContainer: {
    marginBottom: spacing.xxl,
  },
  step: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.xxl,
  },
  stepLeft: {
    alignItems: 'center',
  },
  stepNumber: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    ...typography.subtitle,
    color: colors.card,
  },
  stepLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
    marginTop: spacing.sm,
  },
  stepContent: {
    flex: 1,
    paddingTop: spacing.xs,
  },
  stepTitle: {
    ...typography.heading,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  stepDescription: {
    ...typography.body,
    color: colors.textSecondary,
  },
  infoBox: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.highlight,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
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
    alignItems: 'center',
    gap: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  button: {
    width: '100%',
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    ...typography.bodyBold,
    color: colors.card,
  },
  pagination: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: {
    backgroundColor: colors.primary,
  },
});
