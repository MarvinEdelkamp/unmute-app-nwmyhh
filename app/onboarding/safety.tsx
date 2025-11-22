
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { IconSymbol } from '@/components/IconSymbol';

export default function SafetyScreen() {
  return (
    <View style={[commonStyles.container, styles.container]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconContainer}>
          <IconSymbol 
            ios_icon_name="shield.checkered" 
            android_material_icon_name="verified_user" 
            size={64} 
            color={colors.secondary} 
          />
        </View>

        <Text style={[commonStyles.title, styles.title]}>Your safety matters</Text>

        <View style={styles.safetyContainer}>
          <View style={styles.safetyItem}>
            <IconSymbol 
              ios_icon_name="eye.slash.fill" 
              android_material_icon_name="visibility_off" 
              size={24} 
              color={colors.primary} 
            />
            <View style={styles.safetyContent}>
              <Text style={styles.safetyTitle}>Visible only when Open</Text>
              <Text style={styles.safetyDescription}>
                You&apos;re only discoverable when you choose to be
              </Text>
            </View>
          </View>

          <View style={styles.safetyItem}>
            <IconSymbol 
              ios_icon_name="location.slash.fill" 
              android_material_icon_name="location_off" 
              size={24} 
              color={colors.primary} 
            />
            <View style={styles.safetyContent}>
              <Text style={styles.safetyTitle}>Approximate location only</Text>
              <Text style={styles.safetyDescription}>
                Your exact location is never shown to anyone
              </Text>
            </View>
          </View>

          <View style={styles.safetyItem}>
            <IconSymbol 
              ios_icon_name="hand.raised.fill" 
              android_material_icon_name="block" 
              size={24} 
              color={colors.primary} 
            />
            <View style={styles.safetyContent}>
              <Text style={styles.safetyTitle}>Block & report available</Text>
              <Text style={styles.safetyDescription}>
                You can block users and report problems anytime
              </Text>
            </View>
          </View>

          <View style={styles.safetyItem}>
            <IconSymbol 
              ios_icon_name="clock.fill" 
              android_material_icon_name="schedule" 
              size={24} 
              color={colors.primary} 
            />
            <View style={styles.safetyContent}>
              <Text style={styles.safetyTitle}>Sessions auto-close</Text>
              <Text style={styles.safetyDescription}>
                Your Open status automatically turns off after 45 minutes
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.tipBox}>
          <Text style={styles.tipTitle}>💡 Safety tip</Text>
          <Text style={styles.tipText}>
            Always meet in public places and trust your instincts. If something doesn&apos;t feel right, it&apos;s okay to decline a match.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[buttonStyles.primary, styles.button]}
          onPress={() => router.push('/auth/signup')}
        >
          <Text style={[buttonStyles.text, { color: colors.card }]}>Get started</Text>
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
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: 32,
  },
  safetyContainer: {
    gap: 16,
    marginBottom: 24,
  },
  safetyItem: {
    flexDirection: 'row',
    gap: 16,
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
  },
  safetyContent: {
    flex: 1,
    gap: 4,
  },
  safetyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  safetyDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  tipBox: {
    backgroundColor: colors.highlight,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  tipText: {
    fontSize: 14,
    color: colors.text,
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
