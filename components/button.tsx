
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography, borderRadius, shadows } from "@/styles/commonStyles";

type ButtonVariant = "primary" | "secondary" | "tertiary" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  children,
  style,
  textStyle,
}) => {
  const sizeStyles: Record<
    ButtonSize,
    { minHeight: number; fontSize: number; paddingHorizontal: number }
  > = {
    sm: { minHeight: 44, fontSize: 15, paddingHorizontal: spacing.lg },
    md: { minHeight: 56, fontSize: 16, paddingHorizontal: spacing.xxl },
    lg: { minHeight: 64, fontSize: 18, paddingHorizontal: spacing.xxxl },
  };

  const getVariantStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: borderRadius.xl,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      minHeight: sizeStyles[size].minHeight,
      paddingHorizontal: sizeStyles[size].paddingHorizontal,
    };

    switch (variant) {
      case "primary":
        return {
          ...baseStyle,
          ...shadows.md,
        };
      case "secondary":
        return {
          ...baseStyle,
          backgroundColor: colors.surface,
          borderWidth: 1.5,
          borderColor: colors.border,
        };
      case "tertiary":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
        };
      case "danger":
        return {
          ...baseStyle,
          backgroundColor: colors.danger,
          ...shadows.md,
        };
    }
  };

  const getTextColor = () => {
    if (disabled) {
      return colors.textPlaceholder;
    }

    switch (variant) {
      case "primary":
        return colors.surface;
      case "secondary":
      case "tertiary":
        return colors.text;
      case "danger":
        return colors.surface;
    }
  };

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator color={getTextColor()} />;
    }

    return (
      <Text
        style={StyleSheet.flatten([
          {
            fontSize: sizeStyles[size].fontSize,
            fontWeight: "600",
            color: getTextColor(),
            textAlign: "center",
            letterSpacing: 0.2,
          },
          textStyle,
        ])}
      >
        {children}
      </Text>
    );
  };

  if (variant === "primary" && !disabled) {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled || loading}
        style={[
          getVariantStyle(),
          { opacity: disabled ? 0.4 : 1 },
          style,
        ]}
      >
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.flatten([
            {
              width: '100%',
              height: '100%',
              borderRadius: borderRadius.xl,
              alignItems: 'center',
              justifyContent: 'center',
            },
          ])}
        >
          {renderContent()}
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        getVariantStyle(),
        { opacity: disabled ? 0.4 : 1 },
        variant === "primary" && { backgroundColor: colors.primary },
        style,
      ]}
    >
      {renderContent()}
    </Pressable>
  );
};

export default Button;
