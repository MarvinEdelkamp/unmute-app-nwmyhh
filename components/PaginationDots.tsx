
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors, spacing } from '@/styles/commonStyles';

interface PaginationDotsProps {
  total: number;
  current: number;
}

export function PaginationDots({ total, current }: PaginationDotsProps) {
  const animations = useRef(
    Array.from({ length: total }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    animations.forEach((anim, index) => {
      Animated.spring(anim, {
        toValue: index === current ? 1 : 0,
        useNativeDriver: false,
        damping: 15,
        stiffness: 150,
      }).start();
    });
  }, [current]);

  return (
    <View style={styles.container}>
      {animations.map((anim, index) => {
        const width = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [10, 28],
        });

        const backgroundColor = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [colors.border, colors.primary],
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              {
                width,
                backgroundColor,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  dot: {
    height: 10,
    borderRadius: 5,
  },
});
