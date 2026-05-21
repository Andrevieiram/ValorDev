import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export interface SegmentedControlOption {
  value: string;
  label: string;
}

export interface SegmentedControlProps {
  options: readonly SegmentedControlOption[] | SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function SegmentedControl({
  options,
  value,
  onChange,
  className = "",
}: SegmentedControlProps) {
  return (
    <View
      className={`flex-row p-1.5 bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-500/10 rounded-2xl gap-1.5 ${className}`}
    >
      {options.map((opt) => {
        const isActive = opt.value === value;
        return (
          <TouchableOpacity
            key={opt.value}
            activeOpacity={0.8}
            onPress={() => onChange(opt.value)}
            style={
              isActive
                ? {
                    shadowColor: '#2563eb',
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                    shadowOffset: { width: 0, height: 2 },
                    elevation: 3,
                  }
                : undefined
            }
            className={`flex-1 py-2.5 px-1 items-center justify-center rounded-xl ${
              isActive
                ? "bg-primary dark:bg-blue-500 border border-primary/20 dark:border-blue-400/20"
                : "active:bg-blue-100/60 dark:active:bg-blue-900/30"
            }`}
          >
            <Text
              className={`text-[11px] text-center px-0.5 leading-tight ${
                isActive
                  ? "font-semibold text-white"
                  : "text-blue-400/80 dark:text-blue-300/60"
              }`}
              style={{ fontFamily: isActive ? 'Inter_600SemiBold' : 'Inter_400Regular' }}
              numberOfLines={2}
              adjustsFontSizeToFit
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
