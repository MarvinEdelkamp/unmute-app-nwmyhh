
import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { router } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSession } from '@/contexts/SessionContext';
import { useAuth } from '@/contexts/AuthContext';
import { IconSymbol } from '@/components/IconSymbol';

export default function ConfirmMatchScreen() {
  const { matches, confirmMatch } = useSession();
  const { user } = useAuth();

  const readyMatch = matches.find(
    m => m.status === 'user_a_interested' || m.status === 'user_b_interested'
  );

  if (!readyMatch) {
    router.back();
    return null;
  }

  const handleConfirm = async () => {
    await confirmMatch(readyMatch.id);
    router.replace('/match/ready');
  };

  const handleNotInterested = () => {
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
          <Text style={styles.headerTitle}>Confirm</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <IconSymbol 
              ios_icon_name="xmark" 
              android_material_icon_name="close" 
              size={20} 
              color={colors.text} 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>
            Share your profile with this match?
          </Text>

          <Text style={styles.subtitle}>
            Once you both confirm, you can coordinate and meet
          </Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>They&apos;ll see:</Text>
            
            <View style={styles.infoItem}>
              <View style={styles.checkCircle}>
                <IconSymbol 
                  ios_icon_name="checkmark" 
                  android_material_icon_name="check" 
                  size={16} 
                  color={colors.primary} 
                />
              </View>
              <Text style={styles.infoText}>Your first name</Text>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.checkCircle}>
                <IconSymbol 
                  ios_icon_name="checkmark" 
                  android_material_icon_name="check" 
                  size={16} 
                  color={colors.primary} 
                />
              </View>
              <Text style={styles.infoText}>Your profile photo (if set)</Text>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.checkCircle}>
                <IconSymbol 
                  ios_icon_name="checkmark" 
                  android_material_icon_name="check" 
                  size={16} 
                  color={colors.primary} 
                />
              </View>
              <Text style={styles.infoText}>Your shared interests</Text>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.checkCircle}>
                <IconSymbol 
                  ios_icon_name="checkmark" 
                  android_material_icon_name="check" 
                  size={16} 
                  color={colors.primary} 
                />
              </View>
              <Text style={styles.infoText}>Approximate location</Text>
            </View>
          </View>

          <View style={styles.privacyBox}>
            <IconSymbol 
              ios_icon_name="lock.fill" 
              android_material_icon_name="lock" 
              size={18} 
              color={colors.textSecondary} 
            />
            <Text style={styles.privacyText}>
              Your privacy: We never share your exact location. Only both of you can see this match.
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[buttonStyles.primary, styles.button]}
            onPress={handleConfirm}
          >
            <Text style={[buttonStyles.text]}>
              Yes, share my profile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[buttonStyles.secondary, styles.button]}
            onPress={handleNotInterested}
          >
            <Text style={buttonStyles.textSecondary}>Not interested</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 32,
    lineHeight: 24,
  },
  infoBox: {
    backgroundColor: colors.secondary,
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoText: {
    fontSize: 15,
    color: colors.text,
    flex: 1,
  },
  privacyBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.highlight,
    padding: 16,
    borderRadius: 12,
    gap: 10,
  },
  privacyText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  buttonContainer: {
    padding: 24,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  button: {
    width: '100%',
  },
});
