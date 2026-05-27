import { View, Text } from "react-native";
import { Sparkles } from "lucide-react-native";

import { Button, Card } from "@/components/ui";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { useWizardNavigation } from "@/hooks";
import { useTheme } from "@/theme";

const BENEFITS = [
    "Estimativa guiada de horas e custo",
    "Visão clara de riscos e ajustes",
    "Fluxo rápido para propostas confiáveis",
] as const;

export function WizardIntroScreen() {
    const { goToNextStep } = useWizardNavigation();
    const { colors } = useTheme();

    return (
        <ScreenContainer maxWidth="wizard" className="justify-between pb-8">
            <View className="gap-6">
                {/* Header */}
                <View className="gap-3">
                    <Text
                        className="text-3xl text-foreground"
                        style={{ fontFamily: 'Inter_800ExtraBold' }}
                    >
                        Comece seu cálculo de precificação
                    </Text>
                    <Text
                        className="text-base leading-7 text-muted-foreground"
                        style={{ fontFamily: 'Inter_300Light' }}
                    >
                        Um fluxo guiado para estimar o valor de seus projetos de software com clareza e precisão.
                    </Text>
                </View>

                {/* Benefits Card */}
                <Card variant="outlined" className="gap-4 p-5">
                    {BENEFITS.map((benefit) => (
                        <View key={benefit} className="flex-row items-start gap-3">
                            {/* Ícone com cor do design system (primary azul) */}
                            <View className="mt-1 rounded-full bg-primary/10 p-2">
                                <Sparkles size={18} color={colors.primary} />
                            </View>
                            <Text
                                className="flex-1 text-base leading-6 text-foreground"
                                style={{ fontFamily: 'Inter_400Regular' }}
                            >
                                {benefit}
                            </Text>
                        </View>
                    ))}
                </Card>
            </View>

            {/* CTA — botão glow primário com gradiente */}
            <Button
                size="lg"
                variant="primary"
                label="Começar cálculo"
                onPress={() => goToNextStep("intro")}
            />
        </ScreenContainer>
    );
}
