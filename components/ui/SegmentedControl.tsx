import React from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { useTheme } from "@/theme";

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
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isWeb = Platform.OS === "web";

  // Cores nativas explícitas para cada estado
  const containerBg = isDark ? "rgba(30,41,59,0.4)" : "rgba(239,246,255,0.6)";
  const containerBorder = isDark ? "rgba(59,130,246,0.1)" : "#bfdbfe";

  const activeBg = isDark ? "#3b82f6" : "#2563eb";
  const activeBorder = isDark ? "rgba(147,197,253,0.2)" : "rgba(37,99,235,0.2)";

  const inactiveBg = isDark ? "rgba(15,23,42,0.4)" : "rgba(255,255,255,0.7)";
  const inactiveBorder = isDark ? "rgba(51,65,85,0.6)" : "rgba(191,219,254,0.6)";

  const activeText = "#ffffff";
  const inactiveText = isDark ? "#94a3b8" : "#60a5fa";

  return (
    <View
      className={`flex-row p-1.5 rounded-2xl gap-1.5 ${className}`}
      style={
        isWeb
          ? undefined
          : {
              backgroundColor: containerBg,
              borderWidth: 1,
              borderColor: containerBorder,
            }
      }
    >
      {options.map((opt) => {
        const isActive = opt.value === value;
        return (
          <TouchableOpacity
            key={opt.value}
            activeOpacity={0.8}
            onPress={() => onChange(opt.value)}
            className={`flex-1 py-2.5 px-1 items-center justify-center rounded-xl ${
              isActive
                ? "bg-primary dark:bg-blue-500 border border-primary/20 dark:border-blue-400/20"
                : "active:bg-blue-100/60 dark:active:bg-blue-900/30"
            }`}
            style={
              isWeb
                ? undefined
                : {
                    backgroundColor: isActive ? activeBg : inactiveBg,
                    borderWidth: 1,
                    borderColor: isActive ? activeBorder : inactiveBorder,
                    shadowColor: isActive ? "#2563eb" : "transparent",
                    shadowOpacity: isActive ? 0.2 : 0,
                    shadowRadius: isActive ? 8 : 0,
                    shadowOffset: { width: 0, height: isActive ? 2 : 0 },
                    elevation: isActive ? 3 : 0,
                  }
            }
          >
            <Text
              className={`text-[11px] text-center px-0.5 leading-tight ${
                isActive
                  ? "font-semibold text-white"
                  : "text-blue-400/80 dark:text-blue-300/60"
              }`}
              style={{
                fontFamily: isActive ? "Inter_600SemiBold" : "Inter_400Regular",
                color: isWeb ? undefined : isActive ? activeText : inactiveText,
              }}
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
