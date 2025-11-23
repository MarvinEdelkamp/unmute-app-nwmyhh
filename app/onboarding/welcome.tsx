
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Animated } from 'react-native';
import { router } from 'expo-router';
import { colors, spacing, typography, borderRadius, layout } from '@/styles/commonStyles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { IconSymbol } from '@/components/IconSymbol';
import { PaginationDots } from '@/components/PaginationDots';

export default function WelcomeScreen() {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        damping: 20,
        stiffness: 90,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.animatedContent,
          {
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <IconSymbol 
                ios_icon_name="person.2.fill" 
                android_material_icon_name="people" 
                size={56} 
                color={colors.primary} 
              />
              <View style={styles.locationBadge}>
                <IconSymbol 
                  ios_icon_name="mappin.circle.fill" 
                  android_material_icon_name="location_on" 
                  size={28} 
                  color={colors.card} 
                />
              </View>
            </View>
          </View>

          <Text style={styles.title}>Unmute</Text>
          <Text style={styles.tagline}>Say hi for real</Text>
          
          <Text style={styles.description}>
            Meet people nearby who share your interests. Right here, right now, in real life.
          </Text>

          <View style={styles.featureContainer}>
            <View style={styles.feature}>
              <View style={styles.checkmark}>
                <IconSymbol 
                  ios_icon_name="checkmark" 
                  android_material_icon_name="check" 
                  size={18} 
                  color={colors.card} 
                />
              </View>
              <Text style={styles.featureText}>No feeds, no scrolling, no social graph</Text>
            </View>

            <View style={styles.feature}>
              <View style={styles.checkmark}>
                <IconSymbol 
                  ios_icon_name="checkmark" 
                  android_material_icon_name="check" 
                  size={18} 
                  color={colors.card} 
                />
              </View>
              <Text style={styles.featureText}>Only when you&apos;re open to connect</Text>
            </View>

            <View style={styles.feature}>
              <View style={styles.checkmark}>
                <IconSymbol 
                  ios_icon_name="checkmark" 
                  android_material_icon_name="check" 
                  size={18} 
                  color={colors.card} 
                />
              </View>
              <Text style={styles.featureText}>Your privacy is protected</Text>
            </View>
          </View>
        </ScrollView>
      </Animated.View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.push('/onboarding/how-it-works')}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
        
        <PaginationDots total={3} current={0} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  animatedContent: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Platform.OS === 'android' ? 80 : 100,
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingBottom: 180,
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxxl + spacing.lg,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.highlight,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  locationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.card,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing.xxxl,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 17,
    fontWeight: '400',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xxxl + spacing.lg,
    lineHeight: 26,
    paddingHorizontal: spacing.sm,
  },
  featureContainer: {
    width: '100%',
    gap: spacing.lg + spacing.xs,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  checkmark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  featureText: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.text,
    flex: 1,
    lineHeight: 24,
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
    alignItems: 'center',
    gap: spacing.lg,
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
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.card,
    letterSpacing: 0.2,
  },
});
