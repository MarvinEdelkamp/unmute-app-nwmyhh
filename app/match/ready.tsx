
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSession } from '@/contexts/SessionContext';
import { useAuth } from '@/contexts/AuthContext';
import { IconSymbol } from '@/components/IconSymbol';

const PRESET_MESSAGES = [
  "I'm at the bar in a blue hoodie",
  "Table by the window",
  "Meet at the entrance",
  "I'm wearing glasses",
];

export default function ReadyMatchScreen() {
  const { matches, closeMatch } = useSession();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [sentMessage, setSentMessage] = useState<string | null>(null);

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
    setSentMessage(message);
    setMessage('');
    Alert.alert('Message sent', 'Your coordination message has been sent');
  };

  const handlePresetMessage = (preset: string) => {
    setSentMessage(preset);
    Alert.alert('Message sent', 'Your coordination message has been sent');
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

  return (
    <View style={[commonStyles.container, styles.container]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {otherUser.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>

          <Text style={[commonStyles.title, styles.title]}>
            It&apos;s a match! 🎉
          </Text>

          <Text style={styles.name}>{otherUser.name}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shared interests</Text>
          <View style={styles.interestsGrid}>
            {readyMatch.sharedInterests.map((interest, index) => (
              <View key={index} style={styles.interestChip}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.encouragement}>
          <IconSymbol 
            ios_icon_name="hand.wave.fill" 
            android_material_icon_name="waving_hand" 
            size={24} 
            color={colors.accent} 
          />
          <Text style={styles.encouragementText}>
            Time to say hi in person! Use the quick messages below to help find each other.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick coordination</Text>
          
          {sentMessage && (
            <View style={styles.sentMessage}>
              <IconSymbol 
                ios_icon_name="checkmark.circle.fill" 
                android_material_icon_name="check_circle" 
                size={20} 
                color={colors.success} 
              />
              <Text style={styles.sentMessageText}>{sentMessage}</Text>
            </View>
          )}

          <View style={styles.presetButtons}>
            {PRESET_MESSAGES.map((preset, index) => (
              <TouchableOpacity
                key={index}
                style={styles.presetButton}
                onPress={() => handlePresetMessage(preset)}
              >
                <Text style={styles.presetButtonText}>{preset}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.customMessageContainer}>
            <TextInput
              style={[commonStyles.input, styles.messageInput]}
              placeholder="Or type your own message..."
              placeholderTextColor={colors.textSecondary}
              value={message}
              onChangeText={setMessage}
              maxLength={100}
            />
            <TouchableOpacity
              style={[buttonStyles.primary, styles.sendButton]}
              onPress={handleSendMessage}
            >
              <IconSymbol 
                ios_icon_name="paperplane.fill" 
                android_material_icon_name="send" 
                size={20} 
                color={colors.card} 
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.reportButton}>
          <IconSymbol 
            ios_icon_name="exclamationmark.shield.fill" 
            android_material_icon_name="report" 
            size={16} 
            color={colors.error} 
          />
          <Text style={styles.reportButtonText}>Block / Report</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[buttonStyles.primary, styles.button]}
          onPress={handleSayHi}
        >
          <Text style={[buttonStyles.text, { color: colors.card }]}>
            I&apos;ll say hi
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[buttonStyles.secondary, styles.button]}
          onPress={handleChangedMind}
        >
          <Text style={buttonStyles.textSecondary}>I changed my mind</Text>
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
    paddingBottom: 200,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.card,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestChip: {
    backgroundColor: colors.highlight,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  interestText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  encouragement: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  encouragementText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  sentMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.secondary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  sentMessageText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  presetButtons: {
    gap: 8,
    marginBottom: 12,
  },
  presetButton: {
    backgroundColor: colors.card,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  presetButtonText: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
  },
  customMessageContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  messageInput: {
    flex: 1,
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 12,
  },
  reportButtonText: {
    fontSize: 14,
    color: colors.error,
    fontWeight: '500',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: colors.background,
    gap: 12,
  },
  button: {
    width: '100%',
  },
});
