import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clock3, DollarSign, PiggyBank, Shield } from "lucide-react-native";

import { Button, Input } from "@/components/ui";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { useWizardNavigation } from "@/hooks";
import { useWizardStore } from "@/store";
import {
    EXPERIENCE_LEVEL_OPTIONS,
    WIZARD_PROFILE_SCHEMA,
    type WizardProfileFormValues,
} from "../schema";

export function WizardProfileScreen() {
    const { goToProject, goBack } = useWizardNavigation();
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
            experienceLevel: profile.experienceLevel || "pleno",
        },
    });

    const experienceLevel = watch("experienceLevel");

    const handleSaveProfile = async (values: WizardProfileFormValues) => {
        setProfile(values);
        await persistDraft();
        goToProject();
    };

    return (
        <ScreenContainer>
            <KeyboardAvoidingView
                behavior={Platform.select({ ios: "padding", android: "height" })}
                className="flex-1"
                keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 24}
            >
                <View className="space-y-5">
                    <View className="space-y-2">
                        <Text className="text-2xl font-semibold text-foreground">
                            Perfil financeiro
                        </Text>
                        <Text className="text-sm leading-6 text-muted-foreground">
                            Conte um pouco sobre sua rotina e capacidades para ajustar a estimativa.
                        </Text>
                    </View>

                    <View className="space-y-3 rounded-3xl border border-input bg-muted/70 p-4">
                        <Controller
                            control={control}
                            name="desiredIncome"
                            render={({ field }) => (
                                <Input
                                    label="Renda mensal desejada"
                                    placeholder="Ex: 12000"
                                    keyboardType="numeric"
                                    value={field.value}
                                    onChangeText={field.onChange}
                                    onBlur={field.onBlur}
                                    error={errors.desiredIncome?.message}
                                    helper="Quanto você quer receber ao final do mês?"
                                    leftIcon={<DollarSign size={18} color="#0f766e" />}
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
                                    keyboardType="numeric"
                                    value={field.value}
                                    onChangeText={field.onChange}
                                    onBlur={field.onBlur}
                                    error={errors.hoursPerWeek?.message}
                                    helper="Quantas horas você pode dedicar ao projeto por semana?"
                                    leftIcon={<Clock3 size={18} color="#0f766e" />}
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
                                    label="Custos mensais"
                                    placeholder="Ex: 2000"
                                    keyboardType="numeric"
                                    value={field.value}
                                    onChangeText={field.onChange}
                                    onBlur={field.onBlur}
                                    error={errors.monthlyCosts?.message}
                                    helper="Despesas fixas que devem ser consideradas no preço."
                                    leftIcon={<PiggyBank size={18} color="#0f766e" />}
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
                                    label="Reserva financeira"
                                    placeholder="Ex: 10000"
                                    keyboardType="numeric"
                                    value={field.value}
                                    onChangeText={field.onChange}
                                    onBlur={field.onBlur}
                                    error={errors.financialReserve?.message}
                                    helper="Valor que você precisa ter guardado antes de iniciar o projeto."
                                    leftIcon={<Shield size={18} color="#0f766e" />}
                                    className="rounded-2xl"
                                    inputClassName="py-3 text-sm"
                                />
                            )}
                        />
                    </View>

                    <View className="space-y-3">
                        <Text className="text-sm font-medium text-foreground">
                            Nível de experiência
                        </Text>
                        <Text className="text-xs leading-5 text-muted-foreground">
                            Escolha a opção que melhor descreve sua prática atual.
                        </Text>
                        <View className="flex-row flex-wrap gap-2">
                            {EXPERIENCE_LEVEL_OPTIONS.map((option) => (
                                <Button
                                    key={option.value}
                                    size="sm"
                                    variant={experienceLevel === option.value ? "primary" : "ghost"}
                                    label={option.label}
                                    onPress={() =>
                                        setValue("experienceLevel", option.value, {
                                            shouldValidate: true,
                                        })
                                    }
                                    className="flex-1 min-w-[30%] rounded-2xl"
                                />
                            ))}
                        </View>
                        {errors.experienceLevel ? (
                            <Text className="text-sm text-destructive">
                                {errors.experienceLevel.message}
                            </Text>
                        ) : null}
                    </View>

                    <View className="space-y-3 pt-1">
                        <Button
                            size="lg"
                            label="Próximo"
                            onPress={handleSubmit(handleSaveProfile)}
                            isLoading={isSubmitting}
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
            </KeyboardAvoidingView>
        </ScreenContainer>
    );
}
