import React from "react";
import { useRouter } from "expo-router";
import {
    ChevronRight,
    Settings,
    LogOut,
    User,
    DollarSign,
    Clock,
    Shield,
} from "lucide-react-native";
import { Pressable, Text, View, Alert, Platform } from "react-native";

import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { Card, Divider } from "@/components/ui";
import { useAuthStore, useWizardStore } from "@/store";
import { useTheme } from "@/theme/ThemeContext";
import { formatCurrency } from "@/utils";

const taxRegimeLabels: Record<string, string> = {
    mei: "MEI",
    simples: "Simples Nacional",
    lucro_presumido: "Lucro Presumido",
    clt: "Equivalente CLT",
};

export default function ProfileScreen() {
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const profile = useWizardStore((s) => s.profile);
    const themeContext = useTheme();
    const colors = themeContext?.colors || { primary: '#2563eb', background: '#ffffff', foreground: '#18181b' };

    const handleLogout = async () => {
        if (Platform.OS === "web") {
            const confirmed = window.confirm("Deseja realmente sair da sua conta?");
            if (confirmed) {
                await logout();
                router.replace("/auth");
            }
            return;
        }

        Alert.alert("Encerrar Sessão", "Deseja realmente sair da sua conta?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Sair",
                style: "destructive",
                onPress: async () => {
                    await logout();
                    router.replace("/auth");
                },
            },
        ]);
    };

    return (
        <ScreenContainer maxWidth="simple">
            <View className="gap-6 pb-24">
                {/* Header Profile Title */}
                <View className="gap-1">
                    <Text
                        className="text-2xl text-foreground"
                        style={{ fontFamily: "Inter_700Bold", color: colors.foreground }}
                    >
                        Perfil
                    </Text>
                    <Text
                        className="text-sm text-muted-foreground"
                        style={{ color: colors.textMuted }}
                    >
                        Visualize suas credenciais e perfil de trabalho padrão.
                    </Text>
                </View>

                {/* Profile Card Info */}
                <Card variant="glass" className="flex-row items-center gap-4">
                    <View
                        className="w-14 h-14 rounded-full items-center justify-center"
                        style={{ backgroundColor: `${colors.primary}18` }}
                    >
                        <User size={28} color={colors.primary} />
                    </View>
                    <View className="flex-1 justify-center">
                        <Text
                            className="text-lg leading-5"
                            style={{ fontFamily: "Inter_700Bold", color: colors.foreground }}
                        >
                            {user?.name || "Visitante"}
                        </Text>
                        <Text className="text-xs mt-0.5" style={{ color: colors.textMuted }}>
                            {user?.email || "modo_visitante@valordev.com"}
                        </Text>
                    </View>
                </Card>

                {/* Quick Profile Summary */}
                <View className="gap-3">
                    <Text
                        className="text-xs uppercase tracking-[0.1em] pl-1"
                        style={{ fontFamily: "Inter_700Bold", color: colors.textMuted }}
                    >
                        Resumo Financeiro Padrão
                    </Text>
                    <Card variant="outlined" className="gap-3">
                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center gap-2">
                                <DollarSign size={16} color={colors.primary} />
                                <Text className="text-sm" style={{ color: colors.textMuted }}>
                                    Renda Desejada
                                </Text>
                            </View>
                            <Text
                                className="text-sm"
                                style={{ fontFamily: "Inter_600SemiBold", color: colors.foreground }}
                            >
                                {profile.desiredIncome ? formatCurrency(Number(profile.desiredIncome)) : "—"}
                            </Text>
                        </View>
                        <Divider />
                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center gap-2">
                                <Clock size={16} color={colors.primary} />
                                <Text className="text-sm" style={{ color: colors.textMuted }}>
                                    Horas Disponíveis
                                </Text>
                            </View>
                            <Text
                                className="text-sm"
                                style={{ fontFamily: "Inter_600SemiBold", color: colors.foreground }}
                            >
                                {profile.hoursPerWeek ? `${profile.hoursPerWeek}h / sem` : "—"}
                            </Text>
                        </View>
                        <Divider />
                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center gap-2">
                                <Shield size={16} color={colors.primary} />
                                <Text className="text-sm" style={{ color: colors.textMuted }}>
                                    Regime Fiscal
                                </Text>
                            </View>
                            <Text
                                className="text-sm"
                                style={{ fontFamily: "Inter_600SemiBold", color: colors.foreground }}
                            >
                                {taxRegimeLabels[profile.taxRegime] ?? "MEI"}
                            </Text>
                        </View>
                    </Card>
                </View>

                {/* Option Menu Navigation */}
                <View className="gap-3">
                    <Text
                        className="text-xs uppercase tracking-[0.1em] pl-1"
                        style={{ fontFamily: "Inter_700Bold", color: colors.textMuted }}
                    >
                        Opções e Conta
                    </Text>

                    <Card variant="outlined" className="p-0 overflow-hidden">
                        {/* Edit Financial Profile Button */}
                        <Pressable
                            onPress={() => router.push("/setup-profile")}
                            className="flex-row items-center justify-between p-4"
                            style={({ pressed }) => pressed ? { opacity: 0.7 } : {}}
                        >
                            <View className="flex-row items-center gap-3">
                                <DollarSign size={20} color={colors.foreground} />
                                <Text
                                    className="text-sm"
                                    style={{ fontFamily: "Inter_600SemiBold", color: colors.foreground }}
                                >
                                    Editar Perfil Financeiro
                                </Text>
                            </View>
                            <ChevronRight size={18} color={colors.textMuted} />
                        </Pressable>

                        <Divider />

                        {/* Settings Button */}
                        <Pressable
                            onPress={() => router.push("/settings")}
                            className="flex-row items-center justify-between p-4"
                            style={({ pressed }) => pressed ? { opacity: 0.7 } : {}}
                        >
                            <View className="flex-row items-center gap-3">
                                <Settings size={20} color={colors.foreground} />
                                <Text
                                    className="text-sm"
                                    style={{ fontFamily: "Inter_600SemiBold", color: colors.foreground }}
                                >
                                    Configurações do Aplicativo
                                </Text>
                            </View>
                            <ChevronRight size={18} color={colors.textMuted} />
                        </Pressable>

                        <Divider />

                        {/* Logout Button */}
                        <Pressable
                            onPress={handleLogout}
                            className="flex-row items-center justify-between p-4"
                            style={({ pressed }) => pressed ? { opacity: 0.7 } : {}}
                        >
                            <View className="flex-row items-center gap-3">
                                <LogOut size={20} color={colors.danger} />
                                <Text
                                    className="text-sm"
                                    style={{ fontFamily: "Inter_600SemiBold", color: colors.danger }}
                                >
                                    Sair da Conta
                                </Text>
                            </View>
                            <ChevronRight size={18} color={colors.textMuted} />
                        </Pressable>
                    </Card>
                </View>
            </View>
        </ScreenContainer>
    );
}
