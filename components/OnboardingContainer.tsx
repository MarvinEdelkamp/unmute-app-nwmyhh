
import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { colors } from '@/styles/commonStyles';

const { width } = Dimensions.get('window');

interface OnboardingContainerProps {
  children: React.ReactNode;
  currentPage: number;
}

export function OnboardingContainer({ children, currentPage }: OnboardingContainerProps) {
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      damping: 20,
      stiffness: 90,
    }).start();
  }, [currentPage]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            transform: [
              {
                translateX: slideAnim,
              },
            ],
          },
        ]}
      >
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
});
