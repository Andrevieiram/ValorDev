import { useMemo } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { Card, Button } from "@/components/ui";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { useWizardNavigation } from "@/hooks";
import { useWizardStore } from "@/store";
import { calculateRisk } from "../risk";

export function WizardRiskScreen() {
    const { goToReview, goBack } = useWizardNavigation();
    const project = useWizardStore((state) => state.project);
    const client = useWizardStore((state) => state.client);
    const adjustments = useWizardStore((state) => state.adjustments);
    const setRiskReport = useWizardStore((state) => state.setRiskReport);
    const persistDraft = useWizardStore((state) => state.persistDraft);

    const riskReport = useMemo(
        () => calculateRisk(project, client, adjustments),
        [project, client, adjustments],
    );

    const handleContinue = async () => {
        setRiskReport(riskReport);
        await persistDraft();
        goToReview();
    };

    const progressColor =
        riskReport.level === "low"
            ? "bg-emerald-500"
            : riskReport.level === "medium"
              ? "bg-amber-500"
              : "bg-red-500";

    return (
        <ScreenContainer maxWidth="wizard">
            <KeyboardAvoidingView
                behavior={Platform.select({ ios: "padding", android: "height" })}
                className="flex-1"
                keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 24}
            >
                <ScrollView contentContainerStyle={{ paddingVertical: 24 }} className="px-4">
                    <View className="gap-5">
                        <View className="gap-2">
                            <Text className="text-2xl font-semibold text-foreground">
                                Mapa de risco
                            </Text>
                            <Text className="text-sm leading-6 text-muted-foreground">
                                Consolidando os dados do wizard para gerar um score simples e
                                transparente.
                            </Text>
                        </View>

                        <Card variant="outlined" className="gap-4">
                            <View className="gap-2">
                                <Text className="text-sm font-medium text-foreground">
                                    Nível de risco
                                </Text>
                                <Text className="text-xs text-muted-foreground">
                                    Score calculado com base nos fatores coletados anteriormente.
                                </Text>
                            </View>
                            <View className="rounded-full bg-muted h-3 overflow-hidden">
                                <View
                                    className={`${progressColor} h-full`}
                                    style={{ width: `${riskReport.score}%` }}
                                />
                            </View>
                            <View className="flex-row items-end justify-between">
                                <Text className="text-lg font-semibold text-foreground">
                                    {riskReport.score} / 100
                                </Text>
                                <Text className="text-sm font-medium text-foreground capitalize">
                                    {riskReport.level === "low"
                                        ? "Baixo"
                                        : riskReport.level === "medium"
                                          ? "Médio"
                                          : "Alto"}
                                </Text>
                            </View>
                            <Text className="text-sm text-muted-foreground">
                                {riskReport.recommendation}
                            </Text>
                        </Card>

                        <Card variant="outlined">
                            <Text className="text-sm font-medium text-foreground mb-3">
                                Fatores analisados
                            </Text>
                            <View className="gap-2">
                                {riskReport.factors.map((factor) => (
                                    <View key={factor.name} className="flex-row justify-between items-center">
                                        <Text className="text-sm text-foreground flex-1">
                                            {factor.name}
                                        </Text>
                                        <Text className={`text-sm font-medium ${factor.score > 0 ? 'text-destructive' : factor.score < 0 ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                                            {factor.score > 0 ? '+' : ''}{factor.score}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </Card>

                        <View className="gap-3 pt-1">
                            <Button
                                size="md"
                                label="Continuar para revisão"
                                onPress={handleContinue}
                            />
                            <Button
                                size="md"
                                variant="ghost"
                                label="Voltar"
                                onPress={goBack}
                            />
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenContainer>
    );
}
