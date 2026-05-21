import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Clock3, Link, Wrench } from "lucide-react-native";

import { Button, Input, Select, Switch } from "@/components/ui";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { useWizardNavigation } from "@/hooks";
import { useWizardStore } from "@/store";
import {
    PROJECT_TYPE_OPTIONS,
    COMPLEXITY_OPTIONS,
    WIZARD_PROJECT_SCHEMA,
    type WizardProjectFormValues,
} from "../schema";

const MEETINGS_FREQUENCY_OPTIONS = [
    { value: "diaria", label: "Diária (+20% preço)" },
    { value: "semanal", label: "Semanal" },
    { value: "quinzenal", label: "Quinzenal" },
    { value: "mensal", label: "Mensal" },
] as const;

export function WizardProjectScreen() {
    const { goToClient, goBack } = useWizardNavigation();
    const project = useWizardStore((s) => s.project);
    const setProject = useWizardStore((s) => s.setProject);
    const persistDraft = useWizardStore((s) => s.persistDraft);

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<WizardProjectFormValues>({
        mode: "onBlur",
        resolver: zodResolver(WIZARD_PROJECT_SCHEMA),
        defaultValues: {
            projectType: (project.projectType as any) || "webapp",
            complexity: (project.complexity as any) || "medium",
            deadline: project.deadline || "",
            scopeDocumented: project.scopeDocumented ?? false,
            maintenance: project.maintenance ?? false,
            meetingsFrequency: (project.meetingsFrequency as any) || "semanal",
            externalDependencies: project.externalDependencies || "",
            reuseComponents: project.reuseComponents ?? false,
            toolsUsed: project.toolsUsed || "",
            estimatedHours: project.estimatedHours || "",
        },
    });

    const handleSaveProject = async (values: WizardProjectFormValues) => {
        setProject(values);
        await persistDraft();
        goToClient();
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
                                Contexto do projeto
                            </Text>
                            <Text className="text-sm leading-6 text-muted-foreground">
                                Conte as principais características técnicas e operacionais do projeto.
                            </Text>
                        </View>

                        {/* General Project Section */}
                        <View className="gap-4 rounded-3xl border border-border dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/20 p-5">
                            <Controller
                                control={control}
                                name="projectType"
                                render={({ field }) => (
                                    <Select
                                        label="Tipo de produto"
                                        placeholder="Selecione o produto..."
                                        value={field.value}
                                        options={PROJECT_TYPE_OPTIONS}
                                        onValueChange={field.onChange}
                                        error={errors.projectType?.message}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="complexity"
                                render={({ field }) => (
                                    <Select
                                        label="Complexidade do projeto"
                                        placeholder="Selecione a complexidade..."
                                        value={field.value}
                                        options={COMPLEXITY_OPTIONS}
                                        onValueChange={field.onChange}
                                        error={errors.complexity?.message}
                                    />
                                )}
                            />
                        </View>

                        {/* Metrics and Deadlines Section */}
                        <View className="gap-4 rounded-3xl border border-border dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/20 p-5">
                            <Controller
                                control={control}
                                name="estimatedHours"
                                render={({ field }) => (
                                    <Input
                                        label="Horas estimadas de trabalho"
                                        placeholder="Ex: 120"
                                        keyboardType="numeric"
                                        value={field.value}
                                        onChangeText={field.onChange}
                                        onBlur={field.onBlur}
                                        error={errors.estimatedHours?.message}
                                        helper="Esforço total em horas de desenvolvimento."
                                        leftIcon={<Clock3 size={18} className="text-primary" />}
                                        className="rounded-2xl"
                                        inputClassName="py-3 text-sm"
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="deadline"
                                render={({ field }) => (
                                    <Input
                                        label="Prazo de entrega (ex: 4 semanas)"
                                        placeholder="Ex: 8 semanas"
                                        value={field.value}
                                        onChangeText={field.onChange}
                                        onBlur={field.onBlur}
                                        error={errors.deadline?.message}
                                        helper="Período total estipulado para entrega."
                                        leftIcon={<Calendar size={18} className="text-primary" />}
                                        className="rounded-2xl"
                                        inputClassName="py-3 text-sm"
                                    />
                                )}
                            />
                        </View>

                        {/* Switch Toggles for Scope & Tech */}
                        <View className="gap-4 rounded-3xl border border-border dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/20 p-5">
                            <Controller
                                control={control}
                                name="scopeDocumented"
                                render={({ field }) => (
                                    <Switch
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        label="Escopo detalhado e documentado"
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="maintenance"
                                render={({ field }) => (
                                    <Switch
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        label="Previsão de manutenção mensal recorrente"
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="reuseComponents"
                                render={({ field }) => (
                                    <Switch
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        label="Reaproveitamento expressivo de componentes"
                                    />
                                )}
                            />
                        </View>

                        {/* Operations & Integrations Section */}
                        <View className="gap-4 rounded-3xl border border-border dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/20 p-5">
                            <Controller
                                control={control}
                                name="meetingsFrequency"
                                render={({ field }) => (
                                    <Select
                                        label="Frequência de alinhamentos"
                                        placeholder="Selecione a frequência..."
                                        value={field.value}
                                        options={MEETINGS_FREQUENCY_OPTIONS}
                                        onValueChange={field.onChange}
                                        error={errors.meetingsFrequency?.message}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="externalDependencies"
                                render={({ field }) => (
                                    <Input
                                        label="Dependências externas criticas"
                                        placeholder="Ex: API de pagamentos, IA, legado"
                                        value={field.value}
                                        onChangeText={field.onChange}
                                        onBlur={field.onBlur}
                                        error={errors.externalDependencies?.message}
                                        helper="APIs, sistemas de terceiros ou legados."
                                        leftIcon={<Link size={18} className="text-primary" />}
                                        className="rounded-2xl"
                                        inputClassName="py-3 text-sm"
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="toolsUsed"
                                render={({ field }) => (
                                    <Input
                                        label="Ferramentas e bibliotecas"
                                        placeholder="Ex: React, Node, PostgreSQL"
                                        value={field.value}
                                        onChangeText={field.onChange}
                                        onBlur={field.onBlur}
                                        error={errors.toolsUsed?.message}
                                        helper="Tecnologias principais de desenvolvimento."
                                        leftIcon={<Wrench size={18} className="text-primary" />}
                                        className="rounded-2xl"
                                        inputClassName="py-3 text-sm"
                                    />
                                )}
                            />
                        </View>

                        {/* Navigation Actions */}
                        <View className="gap-3 pt-2">
                            <Button
                                size="md"
                                label="Próximo"
                                onPress={handleSubmit(handleSaveProject)}
                                isLoading={isSubmitting}
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
