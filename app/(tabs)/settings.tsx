
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { router } from 'expo-router';
import { spacing, typography, borderRadius, shadows } from '@/styles/commonStyles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IconSymbol } from '@/components/IconSymbol';
import { Settings } from '@/types';

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const { theme } = useTheme();
  const [settings, setSettings] = useState<Settings>({
    defaultOpenTime: 45,
    blockedUsers: [],
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settingsData = await AsyncStorage.getItem('settings');
      if (settingsData) {
        setSettings(JSON.parse(settingsData));
      }
    } catch (error) {
      console.log('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings: Settings) => {
    try {
      await AsyncStorage.setItem('settings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.log('Error saving settings:', error);
    }
  };

  const handleTimeChange = (time: 30 | 45 | 60) => {
    saveSettings({ ...settings, defaultOpenTime: time });
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/onboarding/welcome');
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete account',
      'This will permanently delete your account and all data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/onboarding/welcome');
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <IconSymbol 
              ios_icon_name="chevron.left" 
              android_material_icon_name="arrow_back" 
              size={24} 
              color={theme.primaryDark} 
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.primaryDark }]}>Settings</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Profile</Text>
          <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }, shadows.sm]}>
            <View style={styles.profileInfo}>
              <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
                <Text style={[styles.avatarText, { color: theme.surface }]}>
                  {user?.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.profileText}>
                <Text style={[styles.profileName, { color: theme.primaryDark }]}>{user?.name}</Text>
                <Text style={[styles.profileEmail, { color: theme.textSecondary }]}>{user?.email}</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={[styles.editButton, { borderTopColor: theme.border }]}
              onPress={() => router.push('/auth/interests')}
            >
              <Text style={[styles.editButtonText, { color: theme.primary }]}>Edit interests</Text>
              <IconSymbol 
                ios_icon_name="chevron.right" 
                android_material_icon_name="chevron_right" 
                size={18} 
                color={theme.primary} 
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Default session time</Text>
          <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }, shadows.sm]}>
            {[30, 45, 60].map((time, index) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeOption,
                  index < 2 && { borderBottomColor: theme.border }
                ]}
                onPress={() => handleTimeChange(time as 30 | 45 | 60)}
              >
                <Text style={[styles.timeText, { color: theme.text }]}>{time} minutes</Text>
                {settings.defaultOpenTime === time && (
                  <IconSymbol 
                    ios_icon_name="checkmark.circle.fill" 
                    android_material_icon_name="check_circle" 
                    size={22} 
                    color={theme.primary} 
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Safety</Text>
          <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }, shadows.sm]}>
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <IconSymbol 
                  ios_icon_name="hand.raised.fill" 
                  android_material_icon_name="block" 
                  size={20} 
                  color={theme.primaryDark} 
                />
                <Text style={[styles.menuItemText, { color: theme.text }]}>Blocked users</Text>
              </View>
              <View style={styles.menuItemRight}>
                <Text style={[styles.menuItemBadge, { color: theme.textSecondary }]}>{settings.blockedUsers.length}</Text>
                <IconSymbol 
                  ios_icon_name="chevron.right" 
                  android_material_icon_name="chevron_right" 
                  size={18} 
                  color={theme.textSecondary} 
                />
              </View>
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <IconSymbol 
                  ios_icon_name="exclamationmark.bubble.fill" 
                  android_material_icon_name="report_problem" 
                  size={20} 
                  color={theme.primaryDark} 
                />
                <Text style={[styles.menuItemText, { color: theme.text }]}>Report a problem</Text>
              </View>
              <IconSymbol 
                ios_icon_name="chevron.right" 
                android_material_icon_name="chevron_right" 
                size={18} 
                color={theme.textSecondary} 
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Account</Text>
          <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }, shadows.sm]}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleSignOut}
            >
              <View style={styles.menuItemLeft}>
                <IconSymbol 
                  ios_icon_name="rectangle.portrait.and.arrow.right" 
                  android_material_icon_name="logout" 
                  size={20} 
                  color={theme.primaryDark} 
                />
                <Text style={[styles.menuItemText, { color: theme.text }]}>Sign out</Text>
              </View>
              <IconSymbol 
                ios_icon_name="chevron.right" 
                android_material_icon_name="chevron_right" 
                size={18} 
                color={theme.textSecondary} 
              />
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleDeleteAccount}
            >
              <View style={styles.menuItemLeft}>
                <IconSymbol 
                  ios_icon_name="trash.fill" 
                  android_material_icon_name="delete" 
                  size={20} 
                  color={theme.error} 
                />
                <Text style={[styles.menuItemText, { color: theme.error }]}>
                  Delete account & data
                </Text>
              </View>
              <IconSymbol 
                ios_icon_name="chevron.right" 
                android_material_icon_name="chevron_right" 
                size={18} 
                color={theme.error} 
              />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.version, { color: theme.textSecondary }]}>Unmute v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? spacing.massive : 60,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xxl,
    marginBottom: spacing.xxl,
  },
  headerTitle: {
    ...typography.h2,
  },
  section: {
    marginBottom: spacing.xxl,
    paddingHorizontal: spacing.xxl,
  },
  sectionTitle: {
    ...typography.caption,
    fontWeight: '600',
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '600',
  },
  profileText: {
    flex: 1,
  },
  profileName: {
    ...typography.h2,
    fontSize: 17,
    marginBottom: spacing.xs,
  },
  profileEmail: {
    ...typography.caption,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderTopWidth: 1,
  },
  editButtonText: {
    ...typography.body,
    fontWeight: '500',
  },
  timeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
  },
  timeText: {
    ...typography.body,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  menuItemText: {
    ...typography.body,
  },
  menuItemBadge: {
    ...typography.caption,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginLeft: spacing.massive,
  },
  version: {
    ...typography.small,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
});
