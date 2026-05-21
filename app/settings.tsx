import React from "react";
import { Text, View, ScrollView } from "react-native";
import { Moon, Sun, Monitor, Globe, CircleDollarSign } from "lucide-react-native";

import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { Card, Select, SegmentedControl, Divider } from "@/components/ui";
import { useSettingsStore } from "@/store";

const themeOptions = [
    { value: "light", label: "Claro" },
    { value: "dark", label: "Escuro" },
    { value: "system", label: "Sistema" },
] as const;

const currencyOptions = [
    { value: "BRL", label: "Real (R$ - BRL)" },
    { value: "USD", label: "Dólar ($ - USD)" },
    { value: "EUR", label: "Euro (€ - EUR)" },
] as const;

const languageOptions = [
    { value: "pt", label: "Português (Brasil)" },
    { value: "en", label: "English (US)" },
] as const;

export default function SettingsScreen() {
    const { theme, currency, language, setTheme, setCurrency, setLanguage } = useSettingsStore();

    return (
        <ScreenContainer>
            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                <View className="gap-6 pb-8">
                    <View className="gap-2">
                        <Text className="text-2xl text-foreground" style={{ fontFamily: 'Inter_700Bold' }}>
                            Configurações
                        </Text>
                        <Text className="text-sm leading-6 text-muted-foreground">
                            Personalize as preferências visuais, de localização e unidade monetária do app.
                        </Text>
                    </View>

                    {/* Theme Customization Section */}
                    <Card variant="outlined" className="gap-4">
                        <View className="gap-1">
                            <View className="flex-row items-center gap-2">
                                <Sun size={18} className="text-primary" />
                                <Text className="text-sm text-foreground" style={{ fontFamily: 'Inter_700Bold' }}>
                                    Tema do Aplicativo
                                </Text>
                            </View>
                            <Text className="text-xs text-muted-foreground">
                                Escolha entre as aparências claro, escuro ou automático do dispositivo.
                            </Text>
                        </View>
                        <SegmentedControl
                            options={themeOptions}
                            value={theme}
                            onChange={(val) => setTheme(val as any)}
                        />
                    </Card>

                    {/* Localization Customization Section */}
                    <Card variant="outlined" className="gap-4">
                        <View className="gap-1">
                            <View className="flex-row items-center gap-2">
                                <Globe size={18} className="text-primary" />
                                <Text className="text-sm text-foreground" style={{ fontFamily: 'Inter_700Bold' }}>
                                    Localização e Padrões
                                </Text>
                            </View>
                            <Text className="text-xs text-muted-foreground">
                                Defina o idioma padrão dos textos de auxílio e a moeda das propostas.
                            </Text>
                        </View>

                        <View className="gap-4 pt-2">
                            <Select
                                label="Unidade Monetária"
                                placeholder="Selecione a moeda..."
                                value={currency}
                                options={currencyOptions}
                                onValueChange={(val) => setCurrency(val as any)}
                            />

                            <Select
                                label="Idioma do App"
                                placeholder="Selecione o idioma..."
                                value={language}
                                options={languageOptions}
                                onValueChange={(val) => setLanguage(val as any)}
                            />
                        </View>
                    </Card>

                    {/* About details */}
                    <View className="pt-4 items-center justify-center gap-1">
                        <Text className="text-xs text-muted-foreground text-center">
                            ValorDev Premium • Versão 1.0.0
                        </Text>
                        <Text className="text-[10px] text-slate-400 text-center">
                            Desenvolvido com Expo & NativeWind
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </ScreenContainer>
    );
}
