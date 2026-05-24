import React from "react";
import { Pressable, View, Text } from "react-native";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";

export interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function Switch({
  value,
  onValueChange,
  label,
  disabled = false,
  className = "",
}: SwitchProps) {
  // Animating the toggle dot position
  const animatedTrackStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(
        value
          ? "rgba(37, 99, 235, 1)" // primary blue
          : "rgba(148, 163, 184, 0.3)", // gray-300 transparent
        { duration: 200 }
      ),
    };
  });

  const animatedThumbStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(value ? 20 : 2, { duration: 200 }),
        },
      ],
    };
  });

  return (
    <Pressable
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      className={`flex-row items-center gap-3 ${className}`}
    >
      <Animated.View
        style={[animatedTrackStyle]}
        className="w-11 h-6 rounded-full justify-center"
      >
        <Animated.View
          style={[animatedThumbStyle]}
          className="w-5 h-5 rounded-full bg-white shadow-sm"
        />
      </Animated.View>
      {label && (
        <Text className="text-sm font-medium text-foreground dark:text-slate-200">
          {label}
        </Text>
      )}
    </Pressable>
  );
}
