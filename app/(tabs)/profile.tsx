import React from "react";
import { useRouter } from "expo-router";
import { ChevronRight, Settings, LogOut, User, DollarSign, Clock, Shield } from "lucide-react-native";
import { Pressable, Text, View, Alert, Platform } from "react-native";

import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { Card, Divider, MotionFadeUp } from "@/components/ui";
import { useAuthStore, useWizardStore } from "@/store";
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

    const handleLogout = async () => {
        if (Platform.OS === "web") {
            const confirmed = window.confirm("Deseja realmente sair da sua conta?");
            if (confirmed) {
                await logout();
                router.replace("/auth");
            }
            return;
        }

        Alert.alert(
            "Encerrar Sessão",
            "Deseja realmente sair da sua conta?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Sair",
                    style: "destructive",
                    onPress: async () => {
                        await logout();
                        router.replace("/auth");
                    },
                },
            ]
        );
    };

    return (
        <ScreenContainer>
            <View className="gap-6 pb-24">
                {/* Header Profile Title */}
                <MotionFadeUp delay={0} className="gap-1">
                    <Text className="text-2xl text-foreground" style={{ fontFamily: 'Inter_700Bold' }}>Perfil</Text>
                    <Text className="text-sm text-muted-foreground">
                        Visualize suas credenciais e perfil de trabalho padrão.
                    </Text>
                </MotionFadeUp>

                {/* Profile Card Info */}
                <MotionFadeUp delay={100}>
                    <Card variant="glass" className="flex-row items-center gap-4">
                        <View className="w-14 h-14 rounded-full bg-primary/10 items-center justify-center">
                            <User size={28} className="text-primary" />
                        </View>
                        <View className="flex-1 justify-center">
                            <Text className="text-lg text-foreground leading-5" style={{ fontFamily: 'Inter_700Bold' }}>
                                {user?.name || "Visitante"}
                            </Text>
                            <Text className="text-xs text-muted-foreground mt-0.5">
                                {user?.email || "modo_visitante@valordev.com"}
                            </Text>
                        </View>
                    </Card>
                </MotionFadeUp>

                {/* Quick Profile Summary */}
                <MotionFadeUp delay={200} className="gap-3">
                    <Text className="text-xs uppercase tracking-[0.1em] text-muted-foreground pl-1" style={{ fontFamily: 'Inter_700Bold' }}>
                        Resumo Financeiro Padrão
                    </Text>
                    <Card variant="outlined" className="gap-3">
                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center gap-2">
                                <DollarSign size={16} className="text-primary" />
                                <Text className="text-sm text-muted-foreground">Renda Desejada</Text>
                            </View>
                            <Text className="text-sm font-semibold text-foreground dark:text-slate-100">
                                {profile.desiredIncome ? formatCurrency(Number(profile.desiredIncome)) : "—"}
                            </Text>
                        </View>
                        <Divider />
                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center gap-2">
                                <Clock size={16} className="text-primary" />
                                <Text className="text-sm text-muted-foreground">Horas Disponíveis</Text>
                            </View>
                            <Text className="text-sm font-semibold text-foreground dark:text-slate-100">
                                {profile.hoursPerWeek ? `${profile.hoursPerWeek}h / sem` : "—"}
                            </Text>
                        </View>
                        <Divider />
                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center gap-2">
                                <Shield size={16} className="text-primary" />
                                <Text className="text-sm text-muted-foreground">Regime Fiscal</Text>
                            </View>
                            <Text className="text-sm font-semibold text-foreground dark:text-slate-100">
                                {taxRegimeLabels[profile.taxRegime] ?? "MEI"}
                            </Text>
                        </View>
                    </Card>
                </MotionFadeUp>

                {/* Option Menu Navigation */}
                <MotionFadeUp delay={300} className="gap-3">
                    <Text className="text-xs uppercase tracking-[0.1em] text-muted-foreground pl-1" style={{ fontFamily: 'Inter_700Bold' }}>
                        Opções e Conta
                    </Text>

                    <Card variant="outlined" className="p-0 overflow-hidden">
                        {/* Edit Financial Profile Button */}
                        <Pressable
                            onPress={() => router.push("/setup-profile")}
                            className="flex-row items-center justify-between p-4 active:bg-slate-50 dark:active:bg-white/5"
                        >
                            <View className="flex-row items-center gap-3">
                                <DollarSign size={20} className="text-foreground dark:text-white" />
                                <Text className="text-sm font-semibold text-foreground dark:text-white">
                                    Editar Perfil Financeiro
                                </Text>
                            </View>
                            <ChevronRight size={18} className="text-muted-foreground" />
                        </Pressable>

                        <Divider />

                        {/* Settings Button */}
                        <Pressable
                            onPress={() => router.push("/settings")}
                            className="flex-row items-center justify-between p-4 active:bg-slate-50 dark:active:bg-white/5"
                        >
                            <View className="flex-row items-center gap-3">
                                <Settings size={20} className="text-foreground dark:text-white" />
                                <Text className="text-sm font-semibold text-foreground dark:text-white">
                                    Configurações do Aplicativo
                                </Text>
                            </View>
                            <ChevronRight size={18} className="text-muted-foreground" />
                        </Pressable>

                        <Divider />

                        {/* Logout Button */}
                        <Pressable
                            onPress={handleLogout}
                            className="flex-row items-center justify-between p-4 active:bg-slate-50 dark:active:bg-white/5"
                        >
                            <View className="flex-row items-center gap-3">
                                <LogOut size={20} className="text-red-500" />
                                <Text className="text-sm font-semibold text-red-500">
                                    Sair da Conta
                                </Text>
                            </View>
                            <ChevronRight size={18} className="text-muted-foreground" />
                        </Pressable>
                    </Card>
                </MotionFadeUp>
            </View>
        </ScreenContainer>
    );
}
