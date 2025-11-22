
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, commonStyles } from '@/styles/commonStyles';

export default function ProfileScreen() {
  return (
    <View style={[commonStyles.container, styles.container]}>
      <Text style={commonStyles.text}>Profile Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingHorizontal: 24,
  },
});
