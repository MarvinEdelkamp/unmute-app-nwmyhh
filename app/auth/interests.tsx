
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Platform, KeyboardAvoidingView, Dimensions, Animated } from 'react-native';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { interestCategories } from '@/data/interests';
import { IconSymbol } from '@/components/IconSymbol';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { spacing, typography, borderRadius, shadows } from '@/styles/commonStyles';
import { hapticFeedback } from '@/utils/haptics';
import { validation, sanitize } from '@/utils/validation';
import { errorHandler } from '@/utils/errorHandler';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function InterestsScreen() {
  const { updateUser, completeOnboarding } = useAuth();
  const { theme } = useTheme();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(interestCategories[0].id);
  const [customInterest, setCustomInterest] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      hapticFeedback.light();
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      hapticFeedback.selection();
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const addCustomInterest = () => {
    const trimmed = sanitize.text(customInterest);
    
    const customValidation = validation.customInterest(trimmed);
    if (!customValidation.valid) {
      hapticFeedback.warning();
      errorHandler.showValidationError(customValidation.error || 'Invalid interest');
      return;
    }

    if (selectedInterests.includes(trimmed)) {
      hapticFeedback.warning();
      errorHandler.showError('This interest is already in your list', 'Already Added');
      return;
    }

    hapticFeedback.success();
    setSelectedInterests([...selectedInterests, trimmed]);
    setCustomInterest('');
  };

  const handleContinue = async () => {
    const interestsValidation = validation.interests(selectedInterests);
    if (!interestsValidation.valid) {
      hapticFeedback.warning();
      errorHandler.showValidationError(interestsValidation.error || 'Please select at least 3 interests');
      return;
    }

    try {
      setLoading(true);
      hapticFeedback.medium();
      
      await updateUser({ interests: selectedInterests });
      
      hapticFeedback.success();
      router.replace('/(tabs)/(home)/');
    } catch (error) {
      hapticFeedback.error();
      const errorMessage = error instanceof Error ? error.message : 'Failed to save interests';
      errorHandler.showError(errorMessage);
      console.error('Save interests error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInterestEmoji = (interest: string) => {
    const emojiMap: { [key: string]: string } = {
      'Hiking': '🥾',
      'Running': '🏃',
      'Yoga': '🧘',
      'Cycling': '🚴',
      'Bouldering': '🧗',
      'Photography': '📷',
      'Coffee': '☕',
      'Music': '🎵',
      'Art': '🎨',
      'Reading': '📚',
      'Cooking': '🍳',
      'Gaming': '🎮',
      'Travel': '✈️',
      'Fitness': '💪',
      'Dancing': '💃',
      'Movies': '🎬',
      'Food': '🍕',
      'Swimming': '🏊',
      'Gym': '🏋️',
      'Basketball': '🏀',
      'Soccer': '⚽',
      'Tennis': '🎾',
      'Rock Climbing': '🧗',
      'Live Music': '🎸',
      'Jazz': '🎷',
      'Rock': '🎸',
      'Electronic': '🎧',
      'Hip Hop': '🎤',
      'Classical': '🎻',
      'Indie': '🎸',
      'Playing Guitar': '🎸',
      'DJing': '🎧',
      'Singing': '🎤',
      'Craft Beer': '🍺',
      'Wine': '🍷',
      'Baking': '🧁',
      'Vegan Food': '🥗',
      'Street Food': '🌮',
      'Fine Dining': '🍽️',
      'Food Photography': '📸',
      'Mixology': '🍸',
      'Painting': '🎨',
      'Museums': '🏛️',
      'Theater': '🎭',
      'Film': '🎬',
      'Writing': '✍️',
      'Poetry': '📝',
      'Dance': '💃',
      'Sculpture': '🗿',
      'Street Art': '🎨',
      'Coding': '💻',
      'AI': '🤖',
      'Startups': '🚀',
      'VR/AR': '🥽',
      'Crypto': '₿',
      'Robotics': '🤖',
      'Open Source': '💻',
      'Web3': '🌐',
      'Mobile Apps': '📱',
      'Board Games': '🎲',
      'Chess': '♟️',
      'Video Games': '🎮',
      'Card Games': '🃏',
      'Poker': '🃏',
      'Trivia': '❓',
      'Escape Rooms': '🔐',
      'D&D': '🎲',
      'Strategy Games': '♟️',
      'Party Games': '🎉',
      'Book Clubs': '📚',
      'Science Fiction': '🚀',
      'Non-Fiction': '📖',
      'Philosophy': '🤔',
      'History': '📜',
      'Psychology': '🧠',
      'Languages': '🗣️',
      'Podcasts': '🎙️',
      'Documentaries': '🎥',
      'Networking': '🤝',
      'Volunteering': '❤️',
      'Community Events': '🎪',
      'Meetups': '👥',
      'Public Speaking': '🎤',
      'Activism': '✊',
      'Sustainability': '♻️',
      'Entrepreneurship': '💼',
      'Mentoring': '👨‍🏫',
      'Coworking': '💼',
    };
    return emojiMap[interest] || '✨';
  };

  const currentCategory = interestCategories.find(cat => cat.id === selectedCategory) || interestCategories[0];
  const canContinue = selectedInterests.length >= 3;
  const progressPercentage = Math.min((selectedInterests.length / 3) * 100, 100);

  // Animate progress bar
  React.useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progressPercentage,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progressPercentage]);

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView 
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.title, { color: theme.text }]}>What are you into?</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Choose at least 3 interests to find your people
        </Text>

        {/* Category selector */}
        <View style={styles.categorySection}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScrollContent}
          >
            {interestCategories.map((category) => {
              const isSelected = category.id === selectedCategory;
              return (
                <TouchableOpacity
                  key={`category-${category.id}`}
                  style={[
                    styles.categoryChip,
                    { 
                      backgroundColor: isSelected ? theme.primary : theme.card,
                      borderColor: isSelected ? theme.primary : theme.border,
                    },
                    shadows.sm,
                  ]}
                  onPress={() => {
                    setSelectedCategory(category.id);
                    hapticFeedback.light();
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      { color: isSelected ? theme.card : theme.text },
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Interests grid */}
        <View style={styles.interestsGrid}>
          {currentCategory.interests.map((interest, index) => {
            const isSelected = selectedInterests.includes(interest);
            return (
              <TouchableOpacity
                key={`interest-${currentCategory.id}-${interest}-${index}`}
                style={[
                  styles.interestCard,
                  { 
                    backgroundColor: theme.card,
                    borderColor: isSelected ? theme.primary : theme.border,
                    borderWidth: isSelected ? 2.5 : 1.5,
                  },
                  isSelected && { ...shadows.md },
                  !isSelected && { ...shadows.sm },
                ]}
                onPress={() => toggleInterest(interest)}
                activeOpacity={0.7}
              >
                {isSelected && (
                  <View style={[styles.checkBadge, { backgroundColor: theme.primary }]}>
                    <IconSymbol
                      ios_icon_name="checkmark"
                      android_material_icon_name="check"
                      size={14}
                      color={theme.card}
                    />
                  </View>
                )}
                <Text style={styles.interestEmoji}>{getInterestEmoji(interest)}</Text>
                <Text
                  style={[
                    styles.interestText,
                    { color: theme.text },
                  ]}
                  numberOfLines={2}
                >
                  {interest}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Custom interest input */}
        <View style={styles.customSection}>
          <Text style={[styles.customTitle, { color: theme.text }]}>
            Can&apos;t find what you&apos;re looking for?
          </Text>
          <View style={styles.customInputContainer}>
            <TextInput
              style={[
                styles.customInput,
                { 
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                  color: theme.text,
                }
              ]}
              placeholder="Add your own interest"
              placeholderTextColor={theme.textSecondary}
              value={customInterest}
              onChangeText={setCustomInterest}
              onSubmitEditing={addCustomInterest}
              returnKeyType="done"
              maxLength={50}
              onFocus={() => {
                setTimeout(() => {
                  scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 100);
              }}
            />
            <TouchableOpacity
              style={[
                styles.addIconButton,
                { backgroundColor: theme.primary },
                shadows.sm,
              ]}
              onPress={addCustomInterest}
            >
              <IconSymbol
                ios_icon_name="plus"
                android_material_icon_name="add"
                size={24}
                color={theme.card}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Floating progress bar */}
      {selectedInterests.length > 0 && (
        <View style={[styles.floatingBar, { backgroundColor: theme.card, borderTopColor: theme.border }, shadows.lg]}>
          <View style={styles.floatingBarContent}>
            <View style={styles.progressInfo}>
              <IconSymbol
                ios_icon_name="checkmark.circle.fill"
                android_material_icon_name="check_circle"
                size={24}
                color={canContinue ? theme.primary : theme.textSecondary}
              />
              <Text style={[styles.progressText, { color: theme.text }]}>
                {selectedInterests.length} {selectedInterests.length === 1 ? 'interest' : 'interests'} selected
              </Text>
            </View>
            
            {!canContinue && (
              <Text style={[styles.progressHint, { color: theme.textSecondary }]}>
                Select {3 - selectedInterests.length} more to continue
              </Text>
            )}
          </View>
          
          {/* Progress line */}
          <View style={[styles.progressBarContainer, { backgroundColor: theme.border }]}>
            <Animated.View
              style={[
                styles.progressBarFill,
                {
                  backgroundColor: theme.primary,
                  width: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>

          {canContinue && (
            <TouchableOpacity 
              style={[
                styles.continueButton,
                { backgroundColor: theme.primary },
                shadows.md,
              ]}
              onPress={handleContinue}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <LoadingSpinner size="small" />
              ) : (
                <Text style={[styles.continueButtonText, { color: theme.card }]}>
                  Continue
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? spacing.massive : 60,
  },
  scrollContent: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: 200,
  },
  title: {
    ...typography.title,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    marginBottom: spacing.xxl,
  },
  categorySection: {
    marginBottom: spacing.xl,
  },
  categoryScrollContent: {
    gap: spacing.sm,
    paddingRight: spacing.xxl,
  },
  categoryChip: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.xxl,
    borderWidth: 1.5,
  },
  categoryChipText: {
    ...typography.caption,
    fontWeight: '600',
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  interestCard: {
    width: (SCREEN_WIDTH - spacing.xxl * 2 - spacing.md * 2) / 3,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
    position: 'relative',
  },
  checkBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  interestEmoji: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  interestText: {
    ...typography.caption,
    fontWeight: '500',
    textAlign: 'center',
  },
  customSection: {
    marginTop: spacing.md,
    marginBottom: spacing.xxl,
  },
  customTitle: {
    ...typography.body,
    marginBottom: spacing.md,
  },
  customInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  customInput: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    ...typography.body,
  },
  addIconButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
    borderTopWidth: 1,
  },
  floatingBarContent: {
    marginBottom: spacing.md,
  },
  progressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  progressText: {
    ...typography.bodyBold,
  },
  progressHint: {
    ...typography.caption,
    marginLeft: spacing.xxxl,
  },
  progressBarContainer: {
    height: 4,
    borderRadius: borderRadius.xs,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: borderRadius.xs,
  },
  continueButton: {
    width: '100%',
    paddingVertical: spacing.lg + spacing.xs,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  continueButtonText: {
    ...typography.bodyBold,
    fontSize: 17,
  },
});
