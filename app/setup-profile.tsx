import React from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clock3, DollarSign, PiggyBank, Shield } from "lucide-react-native";
import { Stack, useRouter } from "expo-router";

import { Button, Input, Select, SegmentedControl } from "@/components/ui";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { useWizardStore } from "@/store";
import { cn } from "@/utils";
import { formatCurrencyInput, parseCurrencyInput } from "@/utils/currency";
import {
    EXPERIENCE_LEVEL_OPTIONS,
    TAX_REGIME_OPTIONS,
    MAIN_STACK_OPTIONS,
    WORKLOAD_OPTIONS,
    WIZARD_PROFILE_SCHEMA,
    type WizardProfileFormValues,
} from "@/features/wizard/schema";

export default function SetupProfileScreen() {
    const router = useRouter();
    const profile = useWizardStore((state) => state.profile);
    const setProfile = useWizardStore((state) => state.setProfile);
    const persistDraft = useWizardStore((state) => state.persistDraft);

    const {
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<WizardProfileFormValues>({
        mode: "onBlur",
        resolver: zodResolver(WIZARD_PROFILE_SCHEMA),
        defaultValues: {
            desiredIncome: profile.desiredIncome,
            hoursPerWeek: profile.hoursPerWeek,
            monthlyCosts: profile.monthlyCosts,
            financialReserve: profile.financialReserve,
            experienceLevel: (profile.experienceLevel as any) || "pleno",
            taxRegime: (profile.taxRegime as any) || "mei",
            mainStack: (profile.mainStack as any) || "fullstack",
            workload: (profile.workload as any) || "normal",
        },
    });

    const experienceLevel = watch("experienceLevel");

    const handleSaveProfile = async (values: WizardProfileFormValues) => {
        setProfile(values);
        await persistDraft();
        router.replace("/(tabs)");
    };

    return (
        <View className="flex-1">
            <Stack.Screen
                options={{
                    title: "Perfil Financeiro",
                }}
            />

            <ScreenContainer maxWidth="wizard">
                <KeyboardAvoidingView
                    behavior={Platform.select({ ios: "padding", android: "height" })}
                    className="flex-1"
                    keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 24}
                >
                    <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                        <View className="gap-6 pb-8 pt-8">
                            <View className="gap-2">
                                <Text className="text-2xl font-bold text-foreground dark:text-white">
                                    Seu Perfil Financeiro
                                </Text>
                                <Text className="text-sm leading-6 text-muted-foreground">
                                    Informe sua rotina, stack de especialidade e regime tributário.
                                    Isso será a base global para todos os seus cálculos de projetos.
                                </Text>
                            </View>

                            {/* Input Fields Container */}
                            <View className="gap-4 rounded-3xl border border-border dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/20 p-5">
                                <Controller
                                    control={control}
                                    name="desiredIncome"
                                    render={({ field }) => (
                                        <Input
                                            label="Renda mensal desejada"
                                            placeholder="Ex: 12000"
                                            keyboardType="number-pad"
                                            value={formatCurrencyInput(field.value ?? "")}
                                            onChangeText={(text) => {
                                                const numeric = parseCurrencyInput(text);

                                                field.onChange(numeric);
                                            }}
                                            onBlur={field.onBlur}
                                            error={errors.desiredIncome?.message}
                                            helper="Quanto você quer receber ao final do mês?"
                                            leftIcon={
                                                <DollarSign size={18} className="text-primary" />
                                            }
                                            className="rounded-2xl"
                                            inputClassName="py-3 text-sm"
                                        />
                                    )}
                                />

                                <Controller
                                    control={control}
                                    name="hoursPerWeek"
                                    render={({ field }) => (
                                        <Input
                                            label="Horas semanais disponíveis"
                                            placeholder="Ex: 40"
                                            keyboardType="number-pad"
                                            value={String(field.value ?? "")}
                                            onChangeText={(text) => {
                                                const numeric = text.replace(/\D/g, "");

                                                let hours = Number(numeric);

                                                if (hours > 60) {
                                                    hours = 60;
                                                }

                                                field.onChange(String(hours));
                                            }}
                                            onBlur={field.onBlur}
                                            error={errors.hoursPerWeek?.message}
                                            helper="Horas estimadas de dedicação por semana."
                                            leftIcon={<Clock3 size={18} className="text-primary" />}
                                            className="rounded-2xl"
                                            inputClassName="py-3 text-sm"
                                        />
                                    )}
                                />

                                <Controller
                                    control={control}
                                    name="monthlyCosts"
                                    render={({ field }) => (
                                        <Input
                                            label="Custos mensais de trabalho"
                                            placeholder="Ex: 2000"
                                            keyboardType="number-pad"
                                            value={formatCurrencyInput(field.value ?? "")}
                                            onChangeText={(text) => {
                                                const numeric = parseCurrencyInput(text);

                                                field.onChange(numeric);
                                            }}
                                            onBlur={field.onBlur}
                                            error={errors.monthlyCosts?.message}
                                            helper="Despesas fixas que devem ser diluídas na hora."
                                            leftIcon={
                                                <PiggyBank size={18} className="text-primary" />
                                            }
                                            className="rounded-2xl"
                                            inputClassName="py-3 text-sm"
                                        />
                                    )}
                                />

                                <Controller
                                    control={control}
                                    name="financialReserve"
                                    render={({ field }) => (
                                        <Input
                                            label="Reserva financeira recomendada"
                                            placeholder="Ex: 10000"
                                            keyboardType="number-pad"
                                            value={formatCurrencyInput(field.value ?? "")}
                                            onChangeText={(text) => {
                                                const numeric = parseCurrencyInput(text);

                                                field.onChange(numeric);
                                            }}
                                            onBlur={field.onBlur}
                                            error={errors.financialReserve?.message}
                                            helper="Colchão de liquidez desejado antes de novos projetos."
                                            leftIcon={<Shield size={18} className="text-primary" />}
                                            className="rounded-2xl"
                                            inputClassName="py-3 text-sm"
                                        />
                                    )}
                                />
                            </View>

                            {/* Dropdown Selects for taxRegime and mainStack */}
                            <View className="gap-4">
                                <Controller
                                    control={control}
                                    name="taxRegime"
                                    render={({ field }) => (
                                        <Select
                                            label="Regime Tributário"
                                            placeholder="Selecione o regime..."
                                            value={field.value}
                                            options={TAX_REGIME_OPTIONS}
                                            onValueChange={field.onChange}
                                            error={errors.taxRegime?.message}
                                        />
                                    )}
                                />

                                <Controller
                                    control={control}
                                    name="mainStack"
                                    render={({ field }) => (
                                        <Select
                                            label="Especialidade / Stack principal"
                                            placeholder="Selecione sua stack..."
                                            value={field.value}
                                            options={MAIN_STACK_OPTIONS}
                                            onValueChange={field.onChange}
                                            error={errors.mainStack?.message}
                                        />
                                    )}
                                />
                            </View>

                            {/* Segmented Controls for Workload */}
                            <View className="gap-3 pt-1">
                                <View className="gap-0.5">
                                    <Text className="text-sm font-semibold text-foreground dark:text-slate-200">
                                        Carga de trabalho atual
                                    </Text>
                                    <Text className="text-xs text-muted-foreground">
                                        Impacta o ajuste de urgência no cálculo
                                    </Text>
                                </View>
                                <Controller
                                    control={control}
                                    name="workload"
                                    render={({ field }) => (
                                        <SegmentedControl
                                            options={WORKLOAD_OPTIONS}
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </View>

                            {/* Experience Level Selection */}
                            <View className="gap-3 pt-1">
                                <View className="gap-0.5">
                                    <Text
                                        className="text-sm text-foreground dark:text-slate-200"
                                        style={{ fontFamily: "Inter_600SemiBold" }}
                                    >
                                        Nível de experiência
                                    </Text>
                                    <Text className="text-xs text-muted-foreground">
                                        Define o multiplicador base da sua hora
                                    </Text>
                                </View>
                                <View className="flex-row gap-2">
                                    {EXPERIENCE_LEVEL_OPTIONS.map((option) => {
                                        const isActive = experienceLevel === option.value;
                                        return (
                                            <Pressable
                                                key={option.value}
                                                onPress={() =>
                                                    setValue("experienceLevel", option.value, {
                                                        shouldValidate: true,
                                                    })
                                                }
                                                className={cn(
                                                    "flex-1 py-2.5 items-center justify-center rounded-xl border",
                                                    isActive
                                                        ? "bg-primary border-primary"
                                                        : "bg-card border-border active:bg-muted",
                                                )}
                                            >
                                                <Text
                                                    className={cn(
                                                        "text-sm",
                                                        isActive ? "text-white" : "text-foreground",
                                                    )}
                                                    style={{
                                                        fontFamily: isActive
                                                            ? "Inter_600SemiBold"
                                                            : "Inter_400Regular",
                                                    }}
                                                >
                                                    {option.label}
                                                </Text>
                                            </Pressable>
                                        );
                                    })}
                                </View>
                                {errors.experienceLevel && (
                                    <Text className="text-xs text-destructive font-medium">
                                        {errors.experienceLevel.message}
                                    </Text>
                                )}
                            </View>

                            {/* Navigation Actions */}
                            <View className="gap-3 pt-2">
                                <Button
                                    size="lg"
                                    label="Salvar Parâmetros"
                                    onPress={handleSubmit(handleSaveProfile)}
                                    isLoading={isSubmitting}
                                />
                                {/* O botão voltar só faz sentido se tivermos como voltar de forma segura, mas vamos remover aqui já que virou tela autônoma principal */}
                                <Button
                                    size="md"
                                    variant="ghost"
                                    label={
                                        profile.desiredIncome
                                            ? "Cancelar e Voltar"
                                            : "Configurar depois"
                                    }
                                    onPress={() => {
                                        if (profile.desiredIncome) {
                                            router.back();
                                        } else {
                                            router.replace("/(tabs)");
                                        }
                                    }}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </ScreenContainer>
        </View>
    );
}
