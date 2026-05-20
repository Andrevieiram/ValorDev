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
      className={`flex-row p-1 bg-secondary dark:bg-slate-800 border border-border dark:border-white/10 rounded-2xl ${className}`}
    >
      {options.map((opt) => {
        const isActive = opt.value === value;
        return (
          <TouchableOpacity
            key={opt.value}
            activeOpacity={0.8}
            onPress={() => onChange(opt.value)}
            className={`flex-1 py-2.5 items-center justify-center rounded-xl ${
              isActive
                ? "bg-white dark:bg-slate-950 shadow-sm border border-black/5 dark:border-white/5"
                : ""
            }`}
          >
            <Text
              className={`text-sm ${
                isActive
                  ? "font-semibold text-primary dark:text-blue-400"
                  : "text-muted-foreground"
              }`}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
