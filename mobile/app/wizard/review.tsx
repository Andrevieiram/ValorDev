import { Text, View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";

import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { Badge, Button, Card } from "@/components/ui";
import { useWizardNavigation } from "@/hooks";
import { useWizardStore } from "@/store";
import { formatCurrency } from "@/utils";

const billingMethodLabels: Record<string, string> = {
    fixed: "Projeto fechado",
    hourly: "Cobrança por hora",
    subscription: "Assinatura",
    milestone: "Por marcos",
};

const projectTypeLabels: Record<string, string> = {
    landing: "Landing page",
    website: "Website",
    webapp: "Web App",
    mobile: "App móvel",
    api: "API",
};

const complexityLabels: Record<string, string> = {
    low: "Baixa",
    medium: "Média",
    high: "Alta",
};

const maturityLabels: Record<string, string> = {
    none: "Sem experiência digital",
    beginner: "Iniciante",
    experienced: "Experiente",
    advanced: "Madura",
};

const impactLabels: Record<string, string> = {
    low: "Baixo impacto",
    medium: "Impacto médio",
    high: "Alto impacto",
    strategic: "Impacto estratégico",
};

const yesNoLabels: Record<string, string> = {
    yes: "Sim",
    no: "Não",
};

export default function WizardReviewScreen() {
    const { goHome, goToResult, goBack } = useWizardNavigation();
    const profile = useWizardStore((s) => s.profile);
    const project = useWizardStore((s) => s.project);
    const client = useWizardStore((s) => s.client);
    const adjustments = useWizardStore((s) => s.adjustments);
    const riskReport = useWizardStore((s) => s.riskReport);

    const summaryRisk = riskReport ?? {
        score: 0,
        level: "medium" as const,
        summary: "O risco ainda será preparado no passo anterior.",
        riskFactors: [],
        positiveFactors: [],
    };

    return (
        <ScreenContainer>
            <KeyboardAvoidingView
                behavior={Platform.select({ ios: "padding", android: "height" })}
                className="flex-1"
                keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 24}
            >
                <ScrollView contentContainerStyle={{ paddingVertical: 24 }} className="px-4">
                    <View className="space-y-5">
                        <View className="space-y-2">
                            <Text className="text-2xl font-semibold text-foreground">
                                Revisão executiva
                            </Text>
                            <Text className="text-sm leading-6 text-muted-foreground">
                                Confira os principais pontos do projeto antes de gerar a estimativa
                                final.
                            </Text>
                        </View>

                        <Card variant="outlined" className="space-y-4 p-4">
                            <Text className="text-sm font-medium text-foreground">
                                Resumo financeiro
                            </Text>
                            <View className="space-y-3">
                                <View className="flex-row justify-between">
                                    <Text className="text-sm text-muted-foreground">
                                        Renda desejada
                                    </Text>
                                    <Text className="text-sm font-semibold text-foreground">
                                        {profile.desiredIncome
                                            ? formatCurrency(Number(profile.desiredIncome))
                                            : "—"}
                                    </Text>
                                </View>
                                <View className="flex-row justify-between">
                                    <Text className="text-sm text-muted-foreground">
                                        Horas semanais
                                    </Text>
                                    <Text className="text-sm font-semibold text-foreground">
                                        {profile.hoursPerWeek ? `${profile.hoursPerWeek} h` : "—"}
                                    </Text>
                                </View>
                                <View className="flex-row justify-between">
                                    <Text className="text-sm text-muted-foreground">
                                        Modelo de cobrança
                                    </Text>
                                    <Text className="text-sm font-semibold text-foreground">
                                        {billingMethodLabels[adjustments.billingMethod] ?? "—"}
                                    </Text>
                                </View>
                            </View>
                        </Card>

                        <Card variant="outlined" className="space-y-4 p-4">
                            <Text className="text-sm font-medium text-foreground">Projeto</Text>
                            <View className="space-y-3">
                                <View className="flex-row justify-between">
                                    <Text className="text-sm text-muted-foreground">Tipo</Text>
                                    <Text className="text-sm font-semibold text-foreground">
                                        {projectTypeLabels[project.projectType] ?? "—"}
                                    </Text>
                                </View>
                                <View className="flex-row justify-between">
                                    <Text className="text-sm text-muted-foreground">
                                        Complexidade
                                    </Text>
                                    <Text className="text-sm font-semibold text-foreground">
                                        {complexityLabels[project.complexity] ?? "—"}
                                    </Text>
                                </View>
                                <View className="flex-row justify-between">
                                    <Text className="text-sm text-muted-foreground">
                                        Prazo estimado
                                    </Text>
                                    <Text className="text-sm font-semibold text-foreground">
                                        {project.deadline || "—"}
                                    </Text>
                                </View>
                            </View>
                        </Card>

                        <Card variant="outlined" className="space-y-4 p-4">
                            <Text className="text-sm font-medium text-foreground">Cliente</Text>
                            <View className="space-y-3">
                                <View className="flex-row justify-between">
                                    <Text className="text-sm text-muted-foreground">
                                        Cliente recorrente
                                    </Text>
                                    <Text className="text-sm font-semibold text-foreground">
                                        {yesNoLabels[client.recurringClient] ?? "—"}
                                    </Text>
                                </View>
                                <View className="flex-row justify-between">
                                    <Text className="text-sm text-muted-foreground">
                                        Maturidade digital
                                    </Text>
                                    <Text className="text-sm font-semibold text-foreground">
                                        {maturityLabels[client.digitalExperience] ?? "—"}
                                    </Text>
                                </View>
                                <View className="flex-row justify-between">
                                    <Text className="text-sm text-muted-foreground">
                                        Impacto do projeto
                                    </Text>
                                    <Text className="text-sm font-semibold text-foreground">
                                        {impactLabels[client.businessImpact] ?? "—"}
                                    </Text>
                                </View>
                            </View>
                        </Card>

                        <Card variant="outlined" className="space-y-4 p-4">
                            <View className="flex-row items-center justify-between">
                                <View>
                                    <Text className="text-sm font-medium text-foreground">
                                        Risco consolidado
                                    </Text>
                                    <Text className="text-xs text-muted-foreground">
                                        Visão simples do status do risco antes da estimativa.
                                    </Text>
                                </View>
                                <Badge
                                    variant={
                                        summaryRisk.level === "low"
                                            ? "success"
                                            : summaryRisk.level === "medium"
                                              ? "warning"
                                              : "danger"
                                    }
                                    size="sm"
                                    label={
                                        summaryRisk.level === "low"
                                            ? "Baixo"
                                            : summaryRisk.level === "medium"
                                              ? "Médio"
                                              : "Alto"
                                    }
                                />
                            </View>

                            <Text className="text-sm font-semibold text-foreground">
                                {summaryRisk.summary}
                            </Text>

                            <View className="space-y-2">
                                {summaryRisk.riskFactors.slice(0, 2).map((factor) => (
                                    <Text key={factor} className="text-sm text-destructive">
                                        • {factor}
                                    </Text>
                                ))}
                                {summaryRisk.positiveFactors.slice(0, 2).map((factor) => (
                                    <Text key={factor} className="text-sm text-foreground">
                                        • {factor}
                                    </Text>
                                ))}
                            </View>
                        </Card>

                        <View className="space-y-3 pt-1">
                            <Button
                                size="lg"
                                label="Gerar estimativa"
                                onPress={goToResult}
                                className="rounded-3xl"
                            />
                            <Button
                                size="lg"
                                variant="ghost"
                                label="Voltar"
                                onPress={goBack}
                                className="rounded-3xl"
                            />
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenContainer>
    );
}
