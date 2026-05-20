import React from "react";
import { View, Text } from "react-native";

export interface DividerProps {
  label?: string;
  className?: string;
}

export function Divider({ label, className = "" }: DividerProps) {
  if (label) {
    return (
      <View className={`flex-row items-center my-4 ${className}`}>
        <View className="flex-1 h-[1px] bg-border dark:bg-white/10" />
        <Text className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </Text>
        <View className="flex-1 h-[1px] bg-border dark:bg-white/10" />
      </View>
    );
  }

  return (
    <View className={`h-[1px] bg-border dark:bg-white/10 my-4 ${className}`} />
  );
}
