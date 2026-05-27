import React from "react";
import { Modal as RNModal, Pressable, Text, View } from "react-native";
import { X } from "lucide-react-native";
import { useTheme } from "@/theme";

export interface ModalProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    className?: string;
}

export function Modal({ visible, onClose, title, children }: ModalProps) {
    const { colors, theme } = useTheme();
    const isDark = theme === "dark";

    const modalBg = isDark ? "#0f172a" : "#ffffff";
    const modalBorder = isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0";
    const closeBg = isDark ? "#1e293b" : "#f1f5f9";

    return (
        <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            {/* BACKDROP */}
            <Pressable
                onPress={onClose}
                style={{
                    flex: 1,
                    backgroundColor: "rgba(0,0,0,0.6)",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 24,
                }}
            >
                {/* CONTENT — impede fechamento ao clicar dentro */}
                <Pressable
                    onPress={(e) => e.stopPropagation()}
                    style={{ width: "100%", maxWidth: 500 }}
                >
                    <View
                        style={{
                            backgroundColor: modalBg,
                            borderWidth: 1,
                            borderColor: modalBorder,
                            borderRadius: 24,
                            padding: 24,
                            shadowColor: "#000",
                            shadowOpacity: isDark ? 0.5 : 0.1,
                            shadowRadius: 20,
                            shadowOffset: { width: 0, height: 8 },
                            elevation: 12,
                        }}
                    >
                        {/* HEADER */}
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: 16,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontFamily: "Inter_700Bold",
                                    color: colors.foreground,
                                    flex: 1,
                                    paddingRight: 8,
                                }}
                            >
                                {title}
                            </Text>

                            {/* CLOSE BUTTON */}
                            <Pressable
                                onPress={onClose}
                                style={({ pressed }) => ({
                                    padding: 6,
                                    borderRadius: 999,
                                    backgroundColor: pressed ? (isDark ? "#334155" : "#e2e8f0") : closeBg,
                                    opacity: pressed ? 0.8 : 1,
                                })}
                            >
                                <X size={18} color={colors.textMuted} />
                            </Pressable>
                        </View>

                        {/* BODY */}
                        <View style={{ gap: 16 }}>{children}</View>
                    </View>
                </Pressable>
            </Pressable>
        </RNModal>
    );
}
