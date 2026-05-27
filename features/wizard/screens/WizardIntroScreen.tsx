import { View, Text } from "react-native";
import { Sparkles } from "lucide-react-native";

import { Button, Card } from "@/components/ui";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { useWizardNavigation } from "@/hooks";

const BENEFITS = [
    "Estimativa guiada de horas e custo",
    "Visão clara de riscos e ajustes",
    "Fluxo rápido para propostas confiáveis",
] as const;

export function WizardIntroScreen() {
    const { goToNextStep } = useWizardNavigation();

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

                <Card className="space-y-4 p-5">
                    {BENEFITS.map((benefit) => (
                        <View key={benefit} className="flex-row items-start gap-3">
                            <View className="mt-1 rounded-full bg-primary/10 p-2">
                                <Sparkles size={18} color="#0f766e" />
                            </View>
                            <Text className="flex-1 text-base leading-6 text-foreground">
                                {benefit}
                            </Text>
                        </View>
                    ))}
                </Card>
            </View>

            <Button size="lg" label="Começar cálculo" onPress={() => goToNextStep("intro")} />
        </ScreenContainer>
    );
}
