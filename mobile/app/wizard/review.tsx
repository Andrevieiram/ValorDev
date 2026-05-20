import React from "react";
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

const taxRegimeLabels: Record<string, string> = {
    mei: "MEI (~6%)",
    simples: "Simples Nacional (~15%)",
    lucro_presumido: "Lucro Presumido (~24%)",
    clt: "Equivalente CLT",
};

const mainStackLabels: Record<string, string> = {
    frontend: "Frontend",
    backend: "Backend",
    fullstack: "Fullstack / Mobile",
    devops: "DevOps / SRE",
    design: "UI/UX Design",
};

const workloadLabels: Record<string, string> = {
    normal: "Normal",
    high: "Elevada (+10%)",
    overloaded: "Sobrecarga (+25%)",
};

const paymentMethodLabels: Record<string, string> = {
    pix: "PIX",
    boleto: "Boleto bancário",
    creditCard: "Cartão de Crédito",
    international: "Transf. Internacional",
};

const installmentLabels: Record<string, string> = {
    oneTime: "À vista",
    twoInstallments: "2x sem juros",
    threeInstallments: "3x sem juros",
    fourOrMore: "4x ou mais (+juros)",
};

const downPaymentLabels: Record<string, string> = {
    none: "Sem sinal",
    twentyPercent: "20% no início",
    thirtyPercent: "30% no início",
    fiftyPercent: "50% no início",
};

const paymentTermLabels: Record<string, string> = {
    thirtyDays: "30 dias pós entrega",
    fifteenDays: "15 dias pós entrega",
    immediate: "Imediato após aceite",
};

const yesNoLabels: Record<string, string> = {
    yes: "Sim",
    no: "Não",
    true: "Sim",
    false: "Não",
};

export default function WizardReviewScreen() {
    const { goToResult, goBack } = useWizardNavigation();
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
                <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                    <View className="gap-6 pb-8">
                        <View className="gap-2">
                            <Text className="text-2xl font-bold text-foreground dark:text-white">
                                Revisão executiva
                            </Text>
                            <Text className="text-sm leading-6 text-muted-foreground">
                                Verifique as informações consolidadas antes de gerar a proposta comercial.
                            </Text>
                        </View>

                        {/* Financial Profile Card */}
                        <Card variant="outlined" className="p-5 gap-4">
                            <Text className="text-sm font-semibold text-primary">
                                1. Perfil do Desenvolvedor
                            </Text>
                            <View className="gap-3">
                                <View className="flex-row justify-between">
                                    <Text className="text-sm text-muted-foreground">Renda mensal desejada</Text>
                                    <Text className="text-sm font-semibold text-foreground dark:text-slate-100">
                                        {profile.desiredIncome ? formatCurrency(Number(profile.desiredIncome)) : "—"}
                                    </Text>
                                </View>
                                <View className="flex-row justify-between">
                                    <Text className="text-sm text-muted-foreground">Horas semanais</Text>
                                    <Text className="text-sm font-semibold text-foreground dark:text-slate-100">
                                        {profile.hoursPerWeek ? `${profile.hoursPerWeek}h / semana` : "—"}
                                    </Text>
                                </View>
                                <View className="flex-row justify-between">
                                    <Text className="text-sm text-muted-foreground">Regime Tributário</Text>
                                    <Text className="text-sm font-semibold text-foreground dark:text-slate-100">
                                        {taxRegimeLabels[profile.taxRegime] ?? "—"}
                                    </Text>
                                </View>
                                <View className="flex-row justify-between">
                                    <Text className="text-sm text-muted-foreground">Especialidade / Stack</Text>
                                    <Text className="text-sm font-semibold text-foreground dark:text-slate-100">
                                        {mainStackLabels[profile.mainStack] ?? "—"}
                                    </Text>
                                </View>
                                <View className="flex-row justify-between">
                                    <Text className="text-sm text-muted-foreground">Carga de trabalho</Text>
                                    <Text className="text-sm font-semibold text-foreground dark:text-slate-100">
                                        {workloadLabels[profile.workload] ?? "—"}
                                    </Text>
                                </View>
                            </View>
                        </Card>

                        {/* Project Details Card */}
                        <Card variant="outlined" className="p-5 gap-4">
                            <Text className="text-sm font-semibold text-primary">
                                2. Contexto do Projeto
                            </Text>
                            <View className="gap-3">
                                <View className="flex-row justify-between">
                                    <Text className="text-sm text-muted-foreground">Tipo de projeto</Text>
                                    <Text className="text-sm font-semibold text-foreground dark:text-slate-100">
                                        {projectTypeLabels[project.projectType] ?? "—"}
                                    </Text>
                                </View>
                                <View className="flex-row justify-between">
                                    <Text className="text-sm text-muted-foreground">Complexidade</Text>
                                    <Text className="text-sm font-semibold text-foreground dark:text-slate-100">
                                        {complexityLabels[project.complexity] ?? "—"}
                                    </Text>
                                </View>
                                <View className="flex-row justify-between">
                                    <Text className="text-sm text-muted-foreground">Horas estimadas</Text>
                                    <Text className="text-sm font-semibold text-foreground dark:text-slate-100">
                                        {project.estimatedHours ? `${project.estimatedHours}h` : "—"}
                                    </Text>
                                </View>
                                <View className="flex-row justify-between">
                                    <Text className="text-sm text-muted-foreground">Prazo de entrega</Text>
                                    <Text className="text-sm font-semibold text-foreground dark:text-slate-100">
                                        {project.deadline || "—"}
                                    </Text>
                                </View>
                                <View className="flex-row justify-between">
                                    <Text className="text-sm text-muted-foreground">Reaproveitamento de comp.</Text>
                                    <Text className="text-sm font-semibold text-foreground dark:text-slate-100">
                                        {yesNoLabels[String(project.reuseComponents)] ?? "—"}
                                    </Text>
                                </View>
                            </View>
                        </Card>

                        {/* Client Card */}
                        <Card variant="outlined" className="p-5 gap-4">
                            <Text className="text-sm font-semibold text-primary">
                                3. Perfil do Cliente
                            </Text>
                            <View className="gap-3">
                                <View className="flex-row justify-between">
                                    <Text className="text-sm text-muted-foreground">Cliente recorrente</Text>
                                    <Text className="text-sm font-semibold text-foreground dark:text-slate-100">
                                        {yesNoLabels[client.recurringClient] ?? "—"}
                                    </Text>
                                </View>
                                <View className="flex-row justify-between">
                                    <Text className="text-sm text-muted-foreground">Maturidade digital</Text>
                                    <Text className="text-sm font-semibold text-foreground dark:text-slate-100">
                                        {maturityLabels[client.digitalExperience] ?? "—"}
                                    </Text>
                                </View>
                                <View className="flex-row justify-between">
                                    <Text className="text-sm text-muted-foreground">Impacto no negócio</Text>
                                    <Text className="text-sm font-semibold text-foreground dark:text-slate-100">
                                        {impactLabels[client.businessImpact] ?? "—"}
                                    </Text>
                                </View>
                            </View>
                        </Card>

                        {/* Commercial Terms Card */}
                        <Card variant="outlined" className="p-5 gap-4">
                            <Text className="text-sm font-semibold text-primary">
                                4. Ajustes e Condições Comerciais
                            </Text>
                            <View className="gap-3">
                                <View className="flex-row justify-between">
                                    <Text className="text-sm text-muted-foreground">Modelo de precificação</Text>
                                    <Text className="text-sm font-semibold text-foreground dark:text-slate-100">
                                        {billingMethodLabels[adjustments.billingMethod] ?? "—"}
                                    </Text>
                                </View>
                                <View className="flex-row justify-between">
                                    <Text className="text-sm text-muted-foreground">Meio de pagamento</Text>
                                    <Text className="text-sm font-semibold text-foreground dark:text-slate-100">
                                        {paymentMethodLabels[adjustments.paymentMethod] ?? "—"}
                                    </Text>
                                </View>
                                <View className="flex-row justify-between">
                                    <Text className="text-sm text-muted-foreground">Sinal / Entrada</Text>
                                    <Text className="text-sm font-semibold text-foreground dark:text-slate-100">
                                        {downPaymentLabels[adjustments.downPayment] ?? "—"}
                                    </Text>
                                </View>
                                <View className="flex-row justify-between">
                                    <Text className="text-sm text-muted-foreground">Opção de parcelamento</Text>
                                    <Text className="text-sm font-semibold text-foreground dark:text-slate-100">
                                        {installmentLabels[adjustments.installmentOption] ?? "—"}
                                    </Text>
                                </View>
                                <View className="flex-row justify-between">
                                    <Text className="text-sm text-muted-foreground">Prazo de recebimento</Text>
                                    <Text className="text-sm font-semibold text-foreground dark:text-slate-100">
                                        {paymentTermLabels[adjustments.paymentTerm] ?? "—"}
                                    </Text>
                                </View>
                                <View className="flex-row justify-between">
                                    <Text className="text-sm text-muted-foreground">Contrato formal assinado</Text>
                                    <Text className="text-sm font-semibold text-foreground dark:text-slate-100">
                                        {yesNoLabels[adjustments.formalContract] ?? "—"}
                                    </Text>
                                </View>
                                <View className="flex-row justify-between">
                                    <Text className="text-sm text-muted-foreground">Recorrência ativada</Text>
                                    <Text className="text-sm font-semibold text-foreground dark:text-slate-100">
                                        {yesNoLabels[adjustments.recurringBilling] ?? "—"}
                                    </Text>
                                </View>
                            </View>
                        </Card>

                        {/* Consolidated Risk Card */}
                        <Card variant="outlined" className="p-5 gap-4">
                            <View className="flex-row items-center justify-between">
                                <View>
                                    <Text className="text-sm font-bold text-foreground dark:text-white">
                                        5. Análise de Risco Consolidada
                                    </Text>
                                    <Text className="text-xs text-muted-foreground mt-0.5">
                                        Score consolidado do projeto
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

                            <Text className="text-sm font-semibold text-foreground dark:text-slate-100 leading-6">
                                {summaryRisk.summary}
                            </Text>

                            <View className="gap-2">
                                {summaryRisk.riskFactors.slice(0, 3).map((factor) => (
                                    <Text key={factor} className="text-sm text-destructive font-medium">
                                        • {factor}
                                    </Text>
                                ))}
                                {summaryRisk.positiveFactors.slice(0, 3).map((factor) => (
                                    <Text key={factor} className="text-sm text-foreground dark:text-slate-200">
                                        • {factor}
                                    </Text>
                                ))}
                            </View>
                        </Card>

                        {/* Navigation Actions */}
                        <View className="gap-3 pt-2">
                            <Button
                                size="lg"
                                label="Gerar estimativa comercial"
                                onPress={goToResult}
                                className="rounded-3xl shadow-md py-4 animate-pulse"
                            />
                            <Button
                                size="lg"
                                variant="ghost"
                                label="Voltar e alterar"
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
