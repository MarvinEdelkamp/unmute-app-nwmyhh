
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { IconSymbol } from '@/components/IconSymbol';

export default function SafetyScreen() {
  return (
    <View style={[commonStyles.container, styles.container]}>
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
              size={64} 
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
          style={[buttonStyles.primary, styles.button]}
          onPress={() => router.push('/onboarding/location')}
        >
          <Text style={[buttonStyles.text, { color: colors.card }]}>Get Started</Text>
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
    paddingTop: 60,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 24,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 32,
    paddingTop: 20,
    paddingBottom: 160,
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 40,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.highlight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
  },
  safetyContainer: {
    width: '100%',
    gap: 20,
  },
  safetyItem: {
    flexDirection: 'row',
    gap: 16,
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
    paddingTop: 4,
  },
  safetyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  safetyDescription: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: colors.background,
    alignItems: 'center',
    gap: 16,
  },
  button: {
    width: '100%',
  },
  pagination: {
    flexDirection: 'row',
    gap: 8,
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
