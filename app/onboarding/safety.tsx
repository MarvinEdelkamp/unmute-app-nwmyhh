
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { router } from 'expo-router';
import { colors, spacing, typography, borderRadius, layout } from '@/styles/commonStyles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { IconSymbol } from '@/components/IconSymbol';

export default function SafetyScreen() {
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
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <IconSymbol 
              ios_icon_name="shield.fill" 
              android_material_icon_name="shield" 
              size={56} 
              color={colors.primary} 
            />
          </View>
        </View>

        <Text style={styles.title}>You are always in control</Text>
        <Text style={styles.subtitle}>Your safety and comfort come first</Text>

        <View style={styles.safetyContainer}>
          <View style={styles.safetyItem}>
            <View style={styles.iconCircleSmall}>
              <IconSymbol 
                ios_icon_name="eye.fill" 
                android_material_icon_name="visibility" 
                size={24} 
                color={colors.primary} 
              />
            </View>
            <View style={styles.safetyContent}>
              <Text style={styles.safetyTitle}>Only visible when Open</Text>
              <Text style={styles.safetyDescription}>
                Toggle off anytime to become invisible
              </Text>
            </View>
          </View>

          <View style={styles.safetyItem}>
            <View style={styles.iconCircleSmall}>
              <IconSymbol 
                ios_icon_name="clock.fill" 
                android_material_icon_name="schedule" 
                size={24} 
                color={colors.primary} 
              />
            </View>
            <View style={styles.safetyContent}>
              <Text style={styles.safetyTitle}>Matches expire</Text>
              <Text style={styles.safetyDescription}>
                No pressure. If you don&apos;t respond, it disappears
              </Text>
            </View>
          </View>

          <View style={styles.safetyItem}>
            <View style={styles.iconCircleSmall}>
              <IconSymbol 
                ios_icon_name="shield.fill" 
                android_material_icon_name="shield" 
                size={24} 
                color={colors.primary} 
              />
            </View>
            <View style={styles.safetyContent}>
              <Text style={styles.safetyTitle}>Block & report available</Text>
              <Text style={styles.safetyDescription}>
                You can always block or report anyone
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.push('/onboarding/location')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
        
        <View style={styles.pagination}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.dotActive]} />
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
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.highlight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.title,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xxxl,
  },
  safetyContainer: {
    width: '100%',
    gap: spacing.xl,
  },
  safetyItem: {
    flexDirection: 'row',
    gap: spacing.lg,
    alignItems: 'flex-start',
  },
  iconCircleSmall: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.highlight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  safetyContent: {
    flex: 1,
    paddingTop: spacing.xs,
  },
  safetyTitle: {
    ...typography.heading,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  safetyDescription: {
    ...typography.body,
    color: colors.textSecondary,
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
