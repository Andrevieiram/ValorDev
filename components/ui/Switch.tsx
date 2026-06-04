import React from 'react';
import { Pressable, View, Text } from 'react-native';

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
  className = '',
}: SwitchProps) {
  const trackColor = value ? 'bg-emerald-500' : 'bg-red-500';
  const thumbPosition = value ? 'translate-x-6' : 'translate-x-1';

  return (
    <Pressable
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      className={`flex-row items-center gap-3 active:opacity-70 ${className}`}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
    >
      <View className={`w-11 h-6 rounded-full justify-center ${trackColor} shadow-md`}>
        <View className={`w-5 h-5 rounded-full bg-white shadow-lg ${thumbPosition}`} />
      </View>
      {label && (
        <Text className="text-sm font-medium text-foreground dark:text-slate-200">{label}</Text>
      )}
    </Pressable>
  );
}
