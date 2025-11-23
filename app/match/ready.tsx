
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, Alert } from 'react-native';
import { router } from 'expo-router';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSession } from '@/contexts/SessionContext';
import { useAuth } from '@/contexts/AuthContext';
import { IconSymbol } from '@/components/IconSymbol';

export default function ReadyMatchScreen() {
  const { matches, closeMatch } = useSession();
  const { user } = useAuth();

  const readyMatch = matches.find(m => m.status === 'both_ready');

  if (!readyMatch) {
    router.back();
    return null;
  }

  const otherUser = readyMatch.userA.id === user?.id ? readyMatch.userB : readyMatch.userA;

  const handleYes = () => {
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

  const handleNotNow = () => {
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
    <Modal
      visible={true}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
    >
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
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <IconSymbol 
                ios_icon_name="person.2.fill" 
                android_material_icon_name="people" 
                size={48} 
                color={colors.primary} 
              />
            </View>
          </View>

          <Text style={styles.title}>
            Are you ready to meet?
          </Text>

          <Text style={styles.subtitle}>
            If you both say yes, you&apos;ll see each other&apos;s profile and a simple way to find each other here
          </Text>

          <View style={styles.infoBox}>
            <View style={styles.infoIconContainer}>
              <IconSymbol 
                ios_icon_name="hand.thumbsup.fill" 
                android_material_icon_name="thumb_up" 
                size={20} 
                color={colors.primary} 
              />
            </View>
            <Text style={styles.infoText}>
              <Text style={styles.infoTextBold}>Double opt-in:</Text> Both of you need to say yes. No pressure if you change your mind.
            </Text>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[buttonStyles.primary, styles.button]}
            onPress={handleYes}
          >
            <Text style={[buttonStyles.text]}>
              Yes, I&apos;m open to it
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[buttonStyles.secondary, styles.button]}
            onPress={handleNotNow}
          >
            <Text style={buttonStyles.textSecondary}>Not right now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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
    marginBottom: 40,
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
    boxShadow: `0px 2px 4px ${colors.shadow}`,
    elevation: 2,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 200,
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
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 32,
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  infoBox: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.highlight,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  infoIconContainer: {
    paddingTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },
  infoTextBold: {
    fontWeight: '600',
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
