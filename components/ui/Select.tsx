import React, { useState } from "react";
import { Modal, ScrollView, Text, Pressable, View } from "react-native";

import { ChevronDown, Check } from "lucide-react-native";
import { Card } from "./Card";

export interface SelectOption {
    value: string;
    label: string;
}

export interface SelectProps {
    label?: string;
    value: string;
    options: readonly SelectOption[] | SelectOption[];
    onValueChange: (value: string) => void;
    placeholder?: string;
    error?: string;
    className?: string;
}

export function Select({
    label,
    value,
    options,
    onValueChange,
    placeholder = "Selecione uma opção...",
    error,
    className = "",
}: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);

    const selectedOption = options.find((opt) => opt.value === value);

    const handleSelect = (val: string) => {
        onValueChange(val);
        setIsOpen(false);
    };

    return (
        <View className={`gap-2 ${className}`}>
            {label && (
                <Text className="text-sm font-medium text-foreground dark:text-slate-200">
                    {label}
                </Text>
            )}

            {/* SELECT TRIGGER */}
            <Pressable
                onPress={() => setIsOpen(true)}
                className={`flex-row items-center justify-between px-4 py-3 rounded-2xl border bg-card/50 border-border dark:border-white/10 ${
                    error ? "border-destructive" : ""
                }`}
                style={({ pressed }) => ({
                    opacity: pressed ? 0.8 : 1,
                })}
            >
                <Text
                    className={`text-sm ${
                        selectedOption ? "text-foreground" : "text-muted-foreground"
                    }`}
                >
                    {selectedOption ? selectedOption.label : placeholder}
                </Text>

                <ChevronDown size={18} className="text-muted-foreground" />
            </Pressable>

            {error && <Text className="text-xs text-destructive font-medium mt-1">{error}</Text>}

            {/* MODAL */}
            <Modal
                visible={isOpen}
                transparent
                animationType="fade"
                onRequestClose={() => setIsOpen(false)}
            >
                {/* BACKDROP */}
                <Pressable
                    onPress={() => setIsOpen(false)}
                    className="flex-1 bg-black/60 justify-center items-center p-6"
                >
                    {/* CONTENT */}
                    <Pressable
                        onPress={(e) => e.stopPropagation()}
                        style={{
                            width: "100%",
                            maxWidth: 440,
                        }}
                    >
                        <Card
                            variant="elevated"
                            className="max-h-[80vh] p-5 bg-background dark:bg-slate-900 border border-border dark:border-white/10 rounded-3xl"
                        >
                            <Text className="text-lg font-bold text-foreground mb-4 dark:text-white">
                                {label || "Selecione"}
                            </Text>

                            <ScrollView>
                                {options.map((opt) => {
                                    const isSelected = opt.value === value;

                                    return (
                                        <Pressable
                                            key={opt.value}
                                            onPress={() => handleSelect(opt.value)}
                                            className={`flex-row items-center justify-between p-3 rounded-xl ${
                                                isSelected ? "bg-primary/10 dark:bg-primary/20" : ""
                                            }`}
                                            style={({ pressed }) => ({
                                                opacity: pressed ? 0.7 : 1,
                                            })}
                                        >
                                            <Text
                                                className={`text-sm ${
                                                    isSelected
                                                        ? "font-semibold text-primary dark:text-blue-400"
                                                        : "text-foreground"
                                                }`}
                                            >
                                                {opt.label}
                                            </Text>

                                            {isSelected && (
                                                <Check
                                                    size={18}
                                                    className="text-primary dark:text-blue-400"
                                                />
                                            )}
                                        </Pressable>
                                    );
                                })}
                            </ScrollView>

                            {/* CANCEL BUTTON */}
                            <Pressable
                                onPress={() => setIsOpen(false)}
                                className="mt-4 py-3 bg-secondary dark:bg-slate-800 rounded-xl items-center"
                                style={({ pressed }) => ({
                                    opacity: pressed ? 0.8 : 1,
                                })}
                            >
                                <Text className="text-sm font-medium text-foreground dark:text-white">
                                    Cancelar
                                </Text>
                            </Pressable>
                        </Card>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
}
