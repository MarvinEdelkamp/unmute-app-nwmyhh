
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

  const otherUser = pendingMatch.userA.id === user?.id ? pendingMatch.userB : pendingMatch.userA;

  const handleInterested = async () => {
    await respondToMatch(pendingMatch.id, true);
    router.back();
  };

  const handleNotNow = async () => {
    await respondToMatch(pendingMatch.id, false);
    router.back();
  };

  return (
    <View style={[commonStyles.container, styles.container]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <IconSymbol 
              ios_icon_name="sparkles" 
              android_material_icon_name="auto_awesome" 
              size={48} 
              color={colors.primary} 
            />
          </View>
        </View>

        <Text style={[commonStyles.title, styles.title]}>
          Someone here shares your interests!
        </Text>

        <Text style={[commonStyles.textSecondary, styles.subtitle]}>
          You both have these interests in common:
        </Text>

        <View style={styles.interestsContainer}>
          {pendingMatch.sharedInterests.map((interest, index) => (
            <View key={index} style={styles.interestChip}>
              <IconSymbol 
                ios_icon_name="heart.fill" 
                android_material_icon_name="favorite" 
                size={16} 
                color={colors.primary} 
              />
              <Text style={styles.interestText}>{interest}</Text>
            </View>
          ))}
        </View>

        <View style={styles.infoBox}>
          <IconSymbol 
            ios_icon_name="info.circle.fill" 
            android_material_icon_name="info" 
            size={20} 
            color={colors.primary} 
          />
          <Text style={styles.infoText}>
            If you&apos;re both interested, we&apos;ll share your names and help you coordinate meeting up.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[buttonStyles.primary, styles.button]}
          onPress={handleInterested}
        >
          <Text style={[buttonStyles.text, { color: colors.card }]}>
            I&apos;m interested
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
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.highlight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
  },
  interestsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  interestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
  },
  interestText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  infoBox: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.highlight,
    padding: 16,
    borderRadius: 12,
  },
  infoText: {
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
  },
  button: {
    width: '100%',
  },
});
