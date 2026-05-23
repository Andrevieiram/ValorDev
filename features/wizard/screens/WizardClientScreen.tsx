import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button, Select } from "@/components/ui";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { useWizardNavigation } from "@/hooks";
import { useWizardStore } from "@/store";
import {
    BUSINESS_IMPACT_OPTIONS,
    CLIENT_TYPE_OPTIONS,
    DIGITAL_EXPERIENCE_OPTIONS,
    LOCATION_OPTIONS,
    RECURRING_CLIENT_OPTIONS,
    WIZARD_CLIENT_SCHEMA,
    type WizardClientFormValues,
} from "../schema";

export function WizardClientScreen() {
    const { goToAdjustments, goBack } = useWizardNavigation();
    const client = useWizardStore((state) => state.client);
    const setClient = useWizardStore((state) => state.setClient);
    const persistDraft = useWizardStore((state) => state.persistDraft);

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<WizardClientFormValues>({
        mode: "onBlur",
        resolver: zodResolver(WIZARD_CLIENT_SCHEMA),
        defaultValues: {
            clientType: (client.clientType as any) || "business",
            digitalExperience: (client.digitalExperience as any) || "experienced",
            recurringClient: (client.recurringClient as any) || "no",
            location: (client.location as any) || "national",
            businessImpact: (client.businessImpact as any) || "medium",
        },
    });

    const handleSaveClient = async (values: WizardClientFormValues) => {
        setClient(values);
        await persistDraft();
        goToAdjustments();
    };

    return (
        <ScreenContainer maxWidth="wizard">
            <KeyboardAvoidingView
                behavior={Platform.select({ ios: "padding", android: "height" })}
                className="flex-1"
                keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 24}
            >
                <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                    <View className="gap-6 pb-8">
                        <View className="gap-2">
                            <Text className="text-2xl font-bold text-foreground dark:text-white">
                                Perfil do cliente
                            </Text>
                            <Text className="text-sm leading-6 text-muted-foreground">
                                Conte sobre a maturidade digital, localização e relacionamento com o cliente.
                            </Text>
                        </View>

                        {/* Client Identity Details */}
                        <View className="gap-4 rounded-3xl border border-border dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/20 p-5">
                            <Controller
                                control={control}
                                name="clientType"
                                render={({ field }) => (
                                    <Select
                                        label="Tipo de cliente"
                                        placeholder="Selecione o tipo..."
                                        value={field.value}
                                        options={CLIENT_TYPE_OPTIONS}
                                        onValueChange={field.onChange}
                                        error={errors.clientType?.message}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="digitalExperience"
                                render={({ field }) => (
                                    <Select
                                        label="Maturidade / Experiência digital"
                                        placeholder="Selecione a maturidade..."
                                        value={field.value}
                                        options={DIGITAL_EXPERIENCE_OPTIONS}
                                        onValueChange={field.onChange}
                                        error={errors.digitalExperience?.message}
                                    />
                                )}
                            />
                        </View>

                        {/* Client Scope Details */}
                        <View className="gap-4 rounded-3xl border border-border dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/20 p-5">
                            <Controller
                                control={control}
                                name="recurringClient"
                                render={({ field }) => (
                                    <Select
                                        label="Cliente recorrente (fidelizado)?"
                                        placeholder="Selecione..."
                                        value={field.value}
                                        options={RECURRING_CLIENT_OPTIONS}
                                        onValueChange={field.onChange}
                                        error={errors.recurringClient?.message}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="location"
                                render={({ field }) => (
                                    <Select
                                        label="Localização geográfica"
                                        placeholder="Selecione a localização..."
                                        value={field.value}
                                        options={LOCATION_OPTIONS}
                                        onValueChange={field.onChange}
                                        error={errors.location?.message}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="businessImpact"
                                render={({ field }) => (
                                    <Select
                                        label="Geração de receita / Impacto no negócio"
                                        placeholder="Selecione o impacto..."
                                        value={field.value}
                                        options={BUSINESS_IMPACT_OPTIONS}
                                        onValueChange={field.onChange}
                                        error={errors.businessImpact?.message}
                                    />
                                )}
                            />
                        </View>

                        {/* Navigation Actions */}
                        <View className="gap-3 pt-2">
                            <Button
                                size="md"
                                label="Próximo"
                                onPress={handleSubmit(handleSaveClient)}
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
