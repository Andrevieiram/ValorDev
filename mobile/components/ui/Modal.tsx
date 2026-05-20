import React from "react";
import { Modal as RNModal, TouchableOpacity, Text, View } from "react-native";
import { X } from "lucide-react-native";
import { Card } from "./Card";

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({
  visible,
  onClose,
  title,
  children,
  className = "",
}: ModalProps) {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        className="flex-1 bg-black/60 justify-center items-center p-6"
      >
        <TouchableOpacity
          activeOpacity={1}
          style={{ width: "100%", maxWidth: 500 }}
          className={className}
        >
          <Card
            variant="elevated"
            className="p-6 bg-background dark:bg-slate-900 border border-border dark:border-white/10 rounded-3xl"
          >
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold text-foreground dark:text-white">
                {title}
              </Text>
              <TouchableOpacity
                onPress={onClose}
                className="p-1 rounded-full bg-secondary dark:bg-slate-800"
              >
                <X size={18} className="text-muted-foreground" />
              </TouchableOpacity>
            </View>
            <View className="gap-4">{children}</View>
          </Card>
        </TouchableOpacity>
      </TouchableOpacity>
    </RNModal>
  );
}
