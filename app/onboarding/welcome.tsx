
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { IconSymbol } from '@/components/IconSymbol';

export default function WelcomeScreen() {
  return (
    <View style={[commonStyles.container, styles.container]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <IconSymbol 
              ios_icon_name="person.2.fill" 
              android_material_icon_name="people" 
              size={64} 
              color={colors.primary} 
            />
          </View>
        </View>

        <Text style={[commonStyles.title, styles.title]}>Welcome to Unmute</Text>
        
        <Text style={[commonStyles.text, styles.description]}>
          Real-life connections with people who share your interests, right here, right now.
        </Text>

        <View style={styles.featureContainer}>
          <View style={styles.feature}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check_circle" 
              size={24} 
              color={colors.secondary} 
            />
            <Text style={styles.featureText}>No endless feeds</Text>
          </View>

          <View style={styles.feature}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check_circle" 
              size={24} 
              color={colors.secondary} 
            />
            <Text style={styles.featureText}>No followers</Text>
          </View>

          <View style={styles.feature}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check_circle" 
              size={24} 
              color={colors.secondary} 
            />
            <Text style={styles.featureText}>No long chats</Text>
          </View>

          <View style={styles.feature}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check_circle" 
              size={24} 
              color={colors.secondary} 
            />
            <Text style={styles.featureText}>Just real connections</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[buttonStyles.primary, styles.button]}
          onPress={() => router.push('/onboarding/how-it-works')}
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
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
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
    textAlign: 'center',
    fontSize: 32,
    marginBottom: 16,
  },
  description: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 40,
    color: colors.textSecondary,
  },
  featureContainer: {
    gap: 16,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
  },
  featureText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
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
