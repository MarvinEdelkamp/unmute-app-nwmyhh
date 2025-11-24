
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { spacing, typography, borderRadius, layout, shadows } from '@/styles/commonStyles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useAuth } from '@/contexts/AuthContext';
import { IconSymbol } from '@/components/IconSymbol';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { hapticFeedback } from '@/utils/haptics';
import { interestCategories } from '@/data/interests';

export default function InterestsScreen() {
  const { setInterests, interests: existingInterests } = useAuth();
  const { theme } = useTheme();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(interestCategories[0].id);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load existing interests if any
    if (existingInterests && existingInterests.length > 0) {
      const labels = existingInterests.map(i => i.interest_label || '').filter(Boolean);
      setSelectedInterests(labels);
    }
  }, [existingInterests]);

  const handleToggleInterest = (interest: string) => {
    hapticFeedback.light();
    
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      if (selectedInterests.length >= 7) {
        Alert.alert('Maximum reached', 'You can select up to 7 interests');
        return;
      }
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleContinue = async () => {
    if (selectedInterests.length < 3) {
      Alert.alert('Select more interests', 'Please select at least 3 interests');
      return;
    }

    try {
      setLoading(true);
      hapticFeedback.medium();
      
      await setInterests(selectedInterests);
      
      hapticFeedback.success();
      router.replace('/(tabs)/(home)/');
    } catch (error) {
      hapticFeedback.error();
      const errorMessage = error instanceof Error ? error.message : 'Failed to save interests';
      Alert.alert('Error', errorMessage);
      console.error('Save interests error:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentCategory = interestCategories.find(c => c.id === selectedCategory);
  const isValid = selectedInterests.length >= 3 && selectedInterests.length <= 7;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Choose your interests</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Select 3–7 things you love
        </Text>
        <View style={[styles.counter, { backgroundColor: theme.secondary, borderColor: theme.border }]}>
          <Text style={[styles.counterText, { color: theme.text }]}>
            {selectedInterests.length} / 7 selected
          </Text>
        </View>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {interestCategories.map((category, index) => {
          const isSelected = category.id === selectedCategory;
          return (
            <TouchableOpacity
              key={`category-${category.id}`}
              style={[
                styles.categoryChip,
                { backgroundColor: theme.card, borderColor: theme.border },
                isSelected && { backgroundColor: theme.primary, borderColor: theme.primary },
              ]}
              onPress={() => {
                setSelectedCategory(category.id);
                hapticFeedback.light();
              }}
            >
              <Text style={[
                styles.categoryText,
                { color: theme.text },
                isSelected && { color: theme.surface, fontWeight: '600' },
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView 
        contentContainerStyle={styles.interestsContainer}
        showsVerticalScrollIndicator={false}
      >
        {currentCategory?.interests.map((interest, index) => {
          const isSelected = selectedInterests.includes(interest);
          return (
            <TouchableOpacity
              key={`interest-${currentCategory.id}-${index}-${interest}`}
              style={[
                styles.interestChip,
                { backgroundColor: theme.card, borderColor: theme.border },
                isSelected && { backgroundColor: theme.highlight, borderColor: theme.primary },
              ]}
              onPress={() => handleToggleInterest(interest)}
            >
              {isSelected && (
                <View style={[styles.checkmark, { backgroundColor: theme.primary }]}>
                  <IconSymbol 
                    ios_icon_name="checkmark" 
                    android_material_icon_name="check" 
                    size={14} 
                    color={theme.surface} 
                  />
                </View>
              )}
              <Text style={[
                styles.interestText,
                { color: theme.text },
                isSelected && { color: theme.primary, fontWeight: '600' },
              ]}>
                {interest}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={[styles.bottomContainer, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
        <TouchableOpacity 
          style={[
            styles.button,
            { backgroundColor: isValid ? theme.primary : theme.disabled },
            isValid ? shadows.md : {},
          ]}
          onPress={handleContinue}
          disabled={!isValid || loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <LoadingSpinner size="small" />
          ) : (
            <Text style={[
              styles.buttonText,
              { color: isValid ? theme.card : theme.textTertiary }
            ]}>
              Continue
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 60 : 80,
  },
  header: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: spacing.sm,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: spacing.lg,
  },
  counter: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
  },
  counterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoriesContainer: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  categoryChip: {
    paddingVertical: spacing.sm + spacing.xs,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1.5,
  },
  categoryText: {
    fontSize: 15,
    fontWeight: '500',
  },
  interestsContainer: {
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingBottom: 140,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  interestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1.5,
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  interestText: {
    fontSize: 15,
    fontWeight: '500',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: layout.screenPaddingHorizontal,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl + spacing.md,
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 8,
  },
  button: {
    width: '100%',
    minHeight: 56,
    paddingVertical: spacing.lg + spacing.xs,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
