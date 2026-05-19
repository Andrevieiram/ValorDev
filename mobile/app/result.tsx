import { Alert, ScrollView, Text, View } from "react-native";
import { useMemo } from "react";

import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { Badge, Button, Card } from "@/components/ui";
import { useWizardNavigation } from "@/hooks";
import { useWizardStore } from "@/store";
import { calculatePricingResult } from "@/features/pricing";
import { formatCurrency } from "@/utils";

const riskLabelMap = {
    low: { label: "Baixo risco", variant: "success" as const },
    medium: { label: "Risco moderado", variant: "warning" as const },
    high: { label: "Alto risco", variant: "danger" as const },
};

export default function ResultScreen() {
    const { goBack } = useWizardNavigation();
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

    const positiveHighlights = riskReport?.positiveFactors.slice(0, 2) ?? [
        "Ajuste final com base no perfil do cliente.",
    ];
    const riskHighlights = riskReport?.riskFactors.slice(0, 2) ?? [
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
        Alert.alert("Exportar PDF", "Essa função de exportação será disponibilizada em breve.");

    const handleSave = () =>
        Alert.alert(
            "Salvar cálculo",
            "O cálculo já está pronto para ser usado como base de proposta.",
        );

    return (
        <ScreenContainer>
            <ScrollView contentContainerStyle={{ paddingVertical: 24 }} className="px-4">
                <View className="space-y-6">
                    <View className="space-y-3">
                        <Text className="text-2xl font-semibold text-foreground">
                            Estimativa final
                        </Text>
                        <Text className="text-sm leading-6 text-muted-foreground">
                            Proposta premium preparada para transmitir confiança ao cliente.
                        </Text>
                    </View>

                    <Card variant="elevated" className="space-y-4 p-5">
                        <View className="items-center gap-3">
                            <Text className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                                Valor recomendado
                            </Text>
                            <Text className="text-5xl font-bold text-foreground">
                                {formatCurrency(result.recommended)}
                            </Text>
                            <Text className="text-center text-sm text-muted-foreground">
                                Esse valor reflete o perfil do projeto, o risco e o posicionamento
                                de mercado.
                            </Text>
                        </View>

                        <View className="flex-row flex-wrap justify-center gap-3">
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

                    <Card variant="outlined" className="space-y-4 p-5">
                        <Text className="text-sm font-medium text-foreground">
                            Resumo da proposta
                        </Text>
                        <View className="space-y-3">
                            {result.breakdown.map((item) => (
                                <View key={item.label} className="flex-row justify-between">
                                    <View className="flex-1 pr-3">
                                        <Text className="text-sm text-muted-foreground">
                                            {item.label}
                                        </Text>
                                        <Text className="text-xs text-slate-500">
                                            {item.description}
                                        </Text>
                                    </View>
                                    <Text className="text-sm font-semibold text-foreground">
                                        {item.value >= 0 ? "+" : ""}
                                        {formatCurrency(item.value)}
                                    </Text>
                                </View>
                            ))}
                        </View>
                        <View className="border-t border-border pt-4">
                            <View className="flex-row justify-between">
                                <Text className="text-sm font-medium text-foreground">
                                    Faixa de proposta
                                </Text>
                                <Text className="text-sm text-muted-foreground">
                                    {formatCurrency(result.minimum)} —{" "}
                                    {formatCurrency(result.premium)}
                                </Text>
                            </View>
                        </View>
                    </Card>

                    <Card variant="outlined" className="space-y-4 p-5">
                        <Text className="text-sm font-medium text-foreground">
                            Por que esse valor
                        </Text>
                        <Text className="text-sm text-muted-foreground">
                            Os pontos abaixo ajudam a entender a inteligência da proposta.
                        </Text>
                        <View className="space-y-3">
                            <View>
                                <Text className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
                                    Fatores positivos
                                </Text>
                                {positiveHighlights.map((item) => (
                                    <Text key={item} className="text-sm text-foreground">
                                        • {item}
                                    </Text>
                                ))}
                            </View>
                            <View>
                                <Text className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
                                    Fatores de atenção
                                </Text>
                                {riskHighlights.map((item) => (
                                    <Text key={item} className="text-sm text-destructive">
                                        • {item}
                                    </Text>
                                ))}
                            </View>
                        </View>
                    </Card>

                    <Card variant="outlined" className="space-y-4 p-5">
                        <Text className="text-sm font-medium text-foreground">
                            Insights rápidos
                        </Text>
                        <View className="space-y-2">
                            {insights.map((insight) => (
                                <Text key={insight} className="text-sm text-foreground">
                                    • {insight}
                                </Text>
                            ))}
                        </View>
                    </Card>

                    <View className="space-y-3">
                        <Button size="lg" label="Salvar cálculo" onPress={handleSave} />
                        <Button
                            size="lg"
                            variant="secondary"
                            label="Exportar PDF"
                            onPress={handleExport}
                        />
                        <Button size="lg" variant="ghost" label="Recalcular" onPress={goBack} />
                    </View>
                </View>
            </ScrollView>
        </ScreenContainer>
    );
}
