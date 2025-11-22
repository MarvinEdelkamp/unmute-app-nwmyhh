
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSession } from '@/contexts/SessionContext';
import { useAuth } from '@/contexts/AuthContext';
import { IconSymbol } from '@/components/IconSymbol';

export default function PendingMatchScreen() {
  const { matches, respondToMatch } = useSession();
  const { user } = useAuth();

  const pendingMatch = matches.find(
    m => m.status === 'pending' || m.status === 'user_a_interested' || m.status === 'user_b_interested'
  );

  if (!pendingMatch) {
    router.back();
    return null;
  }

  const handleInterested = async () => {
    await respondToMatch(pendingMatch.id, true);
    router.back();
  };

  const handleNotNow = async () => {
    await respondToMatch(pendingMatch.id, false);
    router.back();
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <View style={[commonStyles.container, styles.container]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Confirm</Text>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <IconSymbol 
            ios_icon_name="xmark" 
            android_material_icon_name="close" 
            size={24} 
            color={colors.text} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>
          Share your profile with this match?
        </Text>

        <Text style={styles.subtitle}>
          Once you both confirm, you can coordinate and meet
        </Text>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>They&apos;ll see:</Text>
          
          <View style={styles.infoItem}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check_circle" 
              size={20} 
              color={colors.primary} 
            />
            <Text style={styles.infoText}>Your first name</Text>
          </View>

          <View style={styles.infoItem}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check_circle" 
              size={20} 
              color={colors.primary} 
            />
            <Text style={styles.infoText}>Your profile photo (if set)</Text>
          </View>

          <View style={styles.infoItem}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check_circle" 
              size={20} 
              color={colors.primary} 
            />
            <Text style={styles.infoText}>Your shared interests</Text>
          </View>

          <View style={styles.infoItem}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check_circle" 
              size={20} 
              color={colors.primary} 
            />
            <Text style={styles.infoText}>Approximate location</Text>
          </View>
        </View>

        <View style={styles.privacyBox}>
          <IconSymbol 
            ios_icon_name="lock.fill" 
            android_material_icon_name="lock" 
            size={18} 
            color={colors.primary} 
          />
          <Text style={styles.privacyText}>
            Your privacy: We never share your exact location. Only both of you can see this match.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[buttonStyles.primary, styles.button]}
          onPress={handleInterested}
        >
          <Text style={[buttonStyles.text]}>
            Yes, share my profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[buttonStyles.secondary, styles.button]}
          onPress={handleNotNow}
        >
          <Text style={buttonStyles.textSecondary}>Not interested</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    padding: 8,
    backgroundColor: colors.card,
    borderRadius: 12,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 32,
    lineHeight: 22,
  },
  infoSection: {
    backgroundColor: colors.secondary,
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 15,
    color: colors.text,
  },
  privacyBox: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.highlight,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  privacyText: {
    flex: 1,
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
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  button: {
    width: '100%',
  },
});
