import React, { useMemo } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { Badge, Button, Card } from "@/components/ui";
import { useWizardNavigation } from "@/hooks";
import { useWizardStore, useHistoryStore } from "@/store";
import { calculatePricingResult } from "@/features/pricing";
import { formatCurrency } from "@/utils";

const riskLabelMap = {
    low: { label: "Baixo risco", variant: "success" as const },
    medium: { label: "Risco moderado", variant: "warning" as const },
    high: { label: "Alto risco", variant: "danger" as const },
};

const projectTypeLabels: Record<string, string> = {
    landing: "Landing page",
    website: "Website",
    webapp: "Web App",
    mobile: "App móvel",
    api: "API",
};

export default function ResultScreen() {
    const { goBack, goHome } = useWizardNavigation();
    const router = useRouter();
    const profile = useWizardStore((s) => s.profile);
    const project = useWizardStore((s) => s.project);
    const client = useWizardStore((s) => s.client);
    const adjustments = useWizardStore((s) => s.adjustments);
    const riskReport = useWizardStore((s) => s.riskReport);

    const result = useMemo(
        () =>
            calculatePricingResult(
                profile,
                project,
                client,
                adjustments,
                riskReport ?? {
                    score: 50,
                    level: "medium",
                    summary: "O risco será atualizado com base nas respostas do wizard.",
                    riskFactors: [],
                    positiveFactors: [],
                },
            ),
        [profile, project, client, adjustments, riskReport],
    );

    const positiveHighlights = riskReport?.positiveFactors.slice(0, 3) ?? [
        "Ajuste final com base no perfil do cliente.",
    ];
    const riskHighlights = riskReport?.riskFactors.slice(0, 3) ?? [
        "Risco calculado a partir do escopo e prazo.",
    ];

    const insights = [
        project.complexity === "high"
            ? "Complexidade alta é o principal impulsionador desse valor premium."
            : "Complexidade controlada mantém a proposta clara e bem dimensionada.",
        client.recurringClient === "yes"
            ? "Cliente recorrente reduz o risco e aumenta a previsibilidade da entrega."
            : "Cliente não recorrente exige margem adicional de proteção.",
        project.deadline
            ? "Prazo definido orienta o preço e reforça a necessidade de alinhamento."
            : "Sem prazo firme, a proposta usa margem extra para evitar surpresas.",
    ];

    const handleExport = () =>
        Alert.alert("Exportar PDF", "Essa função de exportação em PDF será disponibilizada em breve.");

    const handleSave = async () => {
        try {
            await useHistoryStore.getState().addItem({
                name: projectTypeLabels[project.projectType] || 'Projeto Personalizado',
                value: result.recommended,
                date: new Date().toLocaleDateString('pt-BR'),
                status: 'sent',
            });
            Alert.alert(
                "Sucesso",
                "O cálculo foi salvo com sucesso no seu histórico!",
                [
                    { text: "Ver Histórico", onPress: () => router.replace("/history") },
                    { text: "Ir para Início", onPress: () => goHome() }
                ]
            );
        } catch (error) {
            Alert.alert("Erro", "Não foi possível salvar o cálculo.");
        }
    };

    return (
        <ScreenContainer maxWidth="simple">
            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                <View className="gap-6 pb-8">
                    <View className="gap-2">
                        <Text className="text-2xl text-foreground" style={{ fontFamily: 'Inter_700Bold' }}>
                            Estimativa comercial
                        </Text>
                        <Text className="text-sm leading-6 text-muted-foreground">
                            Proposta premium calculada com base no perfil técnico e condições comerciais.
                        </Text>
                    </View>

                    {/* Main Value Display */}
                    <Card variant="elevated" className="gap-4 p-6 items-center">
                        <Text className="text-xs uppercase tracking-[0.2em] text-muted-foreground" style={{ fontFamily: 'Inter_600SemiBold' }}>
                            Valor recomendado
                        </Text>
                        <Text className="text-5xl text-primary my-2" style={{ fontFamily: 'JetBrainsMono_700Bold' }}>
                            {formatCurrency(result.recommended)}
                        </Text>
                        <Text className="text-center text-sm text-muted-foreground leading-5 px-2">
                            Preço otimizado para cobertura de impostos, riscos e margem líquida pretendida.
                        </Text>

                        <View className="flex-row flex-wrap justify-center gap-2 pt-2">
                            <Badge
                                size="sm"
                                variant={riskLabelMap[result.riskLevel].variant}
                                label={riskLabelMap[result.riskLevel].label}
                            />
                            <Badge
                                size="sm"
                                variant="success"
                                label={`Confiança ${result.confidence}%`}
                            />
                        </View>
                    </Card>

                    {/* Proposal Range & Breakdown */}
                    <Card variant="outlined" className="gap-4">
                        <Text className="text-sm font-bold text-foreground dark:text-white">
                            Composição da proposta
                        </Text>
                        <View className="gap-3">
                            {result.breakdown.map((item) => (
                                <View key={item.label} className="flex-row justify-between items-start">
                                    <View className="flex-1 pr-3">
                                        <Text className="text-sm font-semibold text-foreground dark:text-slate-200">
                                            {item.label}
                                        </Text>
                                        <Text className="text-xs text-muted-foreground">
                                            {item.description}
                                        </Text>
                                    </View>
                                    <Text className="text-sm font-semibold text-foreground dark:text-slate-100">
                                        {item.value >= 0 ? "+" : ""}
                                        {formatCurrency(item.value)}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        <View className="border-t border-border dark:border-white/5 pt-4">
                            <View className="flex-row justify-between">
                                <Text className="text-sm font-bold text-foreground dark:text-white">
                                    Faixa recomendada de negociação
                                </Text>
                                <Text className="text-sm font-semibold text-primary">
                                    {formatCurrency(result.minimum)} — {formatCurrency(result.premium)}
                                </Text>
                            </View>
                        </View>
                    </Card>

                    {/* Detail Justification */}
                    <Card variant="outlined" className="gap-4">
                        <Text className="text-sm font-bold text-foreground dark:text-white">
                            Por que esse valor
                        </Text>
                        <View className="gap-4">
                            {positiveHighlights.length > 0 && (
                                <View>
                                    <Text className="text-xs uppercase tracking-[0.15em] text-primary font-bold mb-2">
                                        Fatores positivos
                                    </Text>
                                    {positiveHighlights.map((item) => (
                                        <Text key={item} className="text-sm text-foreground dark:text-slate-200 leading-5">
                                            • {item}
                                        </Text>
                                    ))}
                                </View>
                            )}

                            {riskHighlights.length > 0 && (
                                <View>
                                    <Text className="text-xs uppercase tracking-[0.15em] text-destructive font-bold mb-2">
                                        Fatores de atenção
                                    </Text>
                                    {riskHighlights.map((item) => (
                                        <Text key={item} className="text-sm text-destructive leading-5">
                                            • {item}
                                        </Text>
                                    ))}
                                </View>
                            )}
                        </View>
                    </Card>

                    {/* Quick Insights */}
                    <Card variant="outlined" className="gap-3">
                        <Text className="text-sm font-bold text-foreground dark:text-white">
                            Insights rápidos
                        </Text>
                        <View className="gap-2">
                            {insights.map((insight) => (
                                <Text key={insight} className="text-sm text-foreground dark:text-slate-200 leading-5">
                                    • {insight}
                                </Text>
                            ))}
                        </View>
                    </Card>

                    {/* Navigation Actions */}
                    <View className="gap-3 pt-2">
                        <Button size="lg" label="Salvar no Histórico" onPress={handleSave} className="rounded-3xl shadow-md py-4" />
                        <Button
                            size="lg"
                            variant="secondary"
                            label="Exportar PDF"
                            onPress={handleExport}
                            className="rounded-3xl"
                        />
                        <Button size="lg" variant="ghost" label="Refazer cálculo" onPress={goBack} className="rounded-3xl" />
                    </View>
                </View>
            </ScrollView>
        </ScreenContainer>
    );
}
