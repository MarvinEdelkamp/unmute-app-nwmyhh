
import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
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
  };

  const handleNotNow = async () => {
    await respondToMatch(pendingMatch.id, false);
    router.back();
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <Modal
      visible={true}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={[commonStyles.container, styles.container]}>
        <View style={styles.header}>
          <View style={styles.dragHandle} />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>
            Someone here shares your interests
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>You both love:</Text>
            <View style={styles.interestsRow}>
              {pendingMatch.sharedInterests.map((interest, index) => (
                <View key={index} style={styles.interestChip}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.locationSection}>
            <Text style={styles.locationLabel}>Approximate area:</Text>
            <Text style={styles.locationText}>English Garden</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              If you both agree, you&apos;ll see each other&apos;s profile and can say hi in person
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[buttonStyles.primary, styles.button]}
              onPress={handleInterested}
            >
              <Text style={[buttonStyles.text]}>
                See if you&apos;re both ready
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[buttonStyles.secondary, styles.button]}
              onPress={handleNotNow}
            >
              <Text style={buttonStyles.textSecondary}>Not now</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <IconSymbol 
            ios_icon_name="xmark" 
            android_material_icon_name="close" 
            size={20} 
            color={colors.text} 
          />
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 32,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  interestsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestChip: {
    backgroundColor: colors.highlight,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  interestText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  locationSection: {
    marginBottom: 24,
  },
  locationLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  locationText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: colors.secondary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 24,
  },
  button: {
    width: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0px 2px 4px ${colors.shadow}`,
    elevation: 2,
  },
});
