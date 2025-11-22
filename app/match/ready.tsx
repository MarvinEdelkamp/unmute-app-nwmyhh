
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSession } from '@/contexts/SessionContext';
import { useAuth } from '@/contexts/AuthContext';
import { IconSymbol } from '@/components/IconSymbol';

const PRESET_MESSAGES = [
  "I'm near the bar in a blue hoodie",
  "I'm at the table by the window",
  "Let's meet at the entrance in 2 min",
  "I'm standing near the coffee machine",
];

export default function ReadyMatchScreen() {
  const { matches, closeMatch } = useSession();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [sentMessages, setSentMessages] = useState<string[]>([]);

  const readyMatch = matches.find(m => m.status === 'both_ready');

  if (!readyMatch) {
    router.back();
    return null;
  }

  const otherUser = readyMatch.userA.id === user?.id ? readyMatch.userB : readyMatch.userA;

  const handleSendMessage = () => {
    if (!message.trim()) {
      return;
    }
    setSentMessages([...sentMessages, message]);
    setMessage('');
  };

  const handlePresetMessage = (preset: string) => {
    setSentMessages([...sentMessages, preset]);
  };

  const handleSayHi = () => {
    Alert.alert(
      'Great!',
      'Have a wonderful conversation! Remember to stay safe and meet in public.',
      [
        {
          text: 'OK',
          onPress: () => {
            closeMatch(readyMatch.id);
            router.back();
          },
        },
      ]
    );
  };

  const handleChangedMind = () => {
    Alert.alert(
      'Close match?',
      'Are you sure you want to close this match?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Close',
          style: 'destructive',
          onPress: () => {
            closeMatch(readyMatch.id);
            router.back();
          },
        },
      ]
    );
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <View style={[commonStyles.container, styles.container]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Match</Text>
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
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {otherUser.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.name}>{otherUser.name}</Text>
          <View style={styles.locationRow}>
            <IconSymbol 
              ios_icon_name="location.fill" 
              android_material_icon_name="location_on" 
              size={16} 
              color={colors.textSecondary} 
            />
            <Text style={styles.location}>English Garden</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>You both love:</Text>
          <View style={styles.interestsRow}>
            {readyMatch.sharedInterests.map((interest, index) => (
              <View key={index} style={styles.interestChip}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.sayHiSection}>
          <View style={styles.sayHiHeader}>
            <IconSymbol 
              ios_icon_name="hand.wave.fill" 
              android_material_icon_name="waving_hand" 
              size={20} 
              color={colors.primary} 
            />
            <Text style={styles.sayHiTitle}>Say hi for real</Text>
          </View>
          <Text style={styles.sayHiDescription}>
            If you feel comfortable, go and say hi in person. A simple opener works.
          </Text>
          <View style={styles.conversationStarter}>
            <Text style={styles.conversationStarterText}>
              &quot;Hi! Are you on Unmute? Looks like we both love Hiking.&quot;
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Help them find you (optional)</Text>
          
          {PRESET_MESSAGES.map((preset, index) => (
            <TouchableOpacity
              key={index}
              style={styles.presetButton}
              onPress={() => handlePresetMessage(preset)}
            >
              <Text style={styles.presetButtonText}>{preset}</Text>
            </TouchableOpacity>
          ))}

          <View style={styles.customMessageContainer}>
            <TextInput
              style={styles.messageInput}
              placeholder="Or type your own..."
              placeholderTextColor={colors.textSecondary}
              value={message}
              onChangeText={setMessage}
              maxLength={100}
            />
          </View>
        </View>

        <View style={styles.infoBox}>
          <IconSymbol 
            ios_icon_name="info.circle.fill" 
            android_material_icon_name="info" 
            size={18} 
            color={colors.primary} 
          />
          <Text style={styles.infoText}>
            No in-app chat. Unmute creates the opportunity—the real conversation happens face to face.
          </Text>
        </View>

        <View style={styles.warningBox}>
          <IconSymbol 
            ios_icon_name="clock.fill" 
            android_material_icon_name="schedule" 
            size={18} 
            color={colors.accent} 
          />
          <Text style={styles.warningText}>
            This match expires in a few minutes. If no one says hi, it disappears—no pressure, no awkwardness.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[buttonStyles.primary, styles.button]}
          onPress={handleSayHi}
        >
          <Text style={[buttonStyles.text]}>
            I&apos;ll say hi
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[buttonStyles.secondary, styles.button]}
          onPress={handleChangedMind}
        >
          <Text style={buttonStyles.textSecondary}>I changed my mind</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.reportButton} onPress={() => Alert.alert('Report', 'Report functionality')}>
          <IconSymbol 
            ios_icon_name="flag.fill" 
            android_material_icon_name="flag" 
            size={16} 
            color={colors.textSecondary} 
          />
          <Text style={styles.reportButtonText}>Block or report</Text>
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
    paddingBottom: 250,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.card,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  interestsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestChip: {
    backgroundColor: colors.highlight,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  interestText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  sayHiSection: {
    backgroundColor: colors.primary,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  sayHiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sayHiTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.card,
  },
  sayHiDescription: {
    fontSize: 14,
    color: colors.card,
    lineHeight: 20,
    marginBottom: 12,
  },
  conversationStarter: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 10,
  },
  conversationStarterText: {
    fontSize: 14,
    color: colors.card,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  presetButton: {
    backgroundColor: colors.card,
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  presetButtonText: {
    fontSize: 14,
    color: colors.text,
  },
  customMessageContainer: {
    marginTop: 4,
  },
  messageInput: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 14,
    color: colors.text,
  },
  infoBox: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.highlight,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  warningBox: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#FFF9E6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  warningText: {
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
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 8,
  },
  reportButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
