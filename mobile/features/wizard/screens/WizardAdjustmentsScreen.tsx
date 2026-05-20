import {
    ActionSheetIOS,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown } from "lucide-react-native";

import { Button } from "@/components/ui";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { useWizardNavigation } from "@/hooks";
import { useWizardStore } from "@/store";
import {
    BILLING_METHOD_OPTIONS,
    DOWN_PAYMENT_OPTIONS,
    FORMAL_CONTRACT_OPTIONS,
    INSTALLMENT_OPTIONS,
    PAYMENT_TERM_OPTIONS,
    RECURRING_BILLING_OPTIONS,
    WIZARD_ADJUSTMENTS_SCHEMA,
    type WizardAdjustmentsFormValues,
} from "../schema";

export function WizardAdjustmentsScreen() {
    const { goToReview, goBack } = useWizardNavigation();
    const adjustments = useWizardStore((state) => state.adjustments);
    const setAdjustments = useWizardStore((state) => state.setAdjustments);
    const persistDraft = useWizardStore((state) => state.persistDraft);

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<WizardAdjustmentsFormValues>({
        mode: "onBlur",
        resolver: zodResolver(WIZARD_ADJUSTMENTS_SCHEMA),
        defaultValues: {
            billingMethod: adjustments.billingMethod || "fixed",
            installmentOption: adjustments.installmentOption || "oneTime",
            paymentTerm: adjustments.paymentTerm || "thirtyDays",
            downPayment: adjustments.downPayment || "none",
            recurringBilling: adjustments.recurringBilling || "no",
            formalContract: adjustments.formalContract || "yes",
        },
    });

    const showOptions = <T extends string>(
        title: string,
        options: ReadonlyArray<{ label: string; value: T }>,
        onSelect: (value: T) => void,
    ) => {
        if (Platform.OS === "ios") {
            const labels = options.map((option) => option.label);
            ActionSheetIOS.showActionSheetWithOptions(
                {
                    title,
                    options: [...labels, "Cancelar"],
                    cancelButtonIndex: labels.length,
                },
                (buttonIndex) => {
                    if (buttonIndex < labels.length) {
                        onSelect(options[buttonIndex].value);
                    }
                },
            );
            return;
        }

        Alert.alert(title, undefined, [
            ...options.map((option) => ({
                text: option.label,
                onPress: () => onSelect(option.value),
            })),
            { text: "Cancelar", style: "cancel" as const },
        ]);
    };

    const handleSaveAdjustments = async (values: WizardAdjustmentsFormValues) => {
        setAdjustments(values);
        await persistDraft();
        goToReview();
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
                                Ajustes financeiros
                            </Text>
                            <Text className="text-sm leading-6 text-muted-foreground">
                                Defina as preferências comerciais e de cobrança para a proposta sem
                                criar cálculos.
                            </Text>
                        </View>

                        <View className="space-y-4 rounded-[28px] border border-input bg-background p-4">
                            <View className="space-y-2">
                                <Text className="text-sm font-medium text-foreground">
                                    Como será cobrado
                                </Text>
                                <Text className="text-xs text-muted-foreground">
                                    Escolha uma forma de cobrança que deixe a negociação clara e
                                    confiante.
                                </Text>
                            </View>

                            <Controller
                                control={control}
                                name="billingMethod"
                                render={({ field }) => (
                                    <Pressable
                                        onPress={() =>
                                            showOptions(
                                                "Forma de cobrança",
                                                BILLING_METHOD_OPTIONS,
                                                field.onChange,
                                            )
                                        }
                                        className="rounded-2xl border border-input bg-muted px-4 py-4"
                                    >
                                        <View className="flex-row items-center justify-between">
                                            <View>
                                                <Text className="text-sm font-medium text-foreground">
                                                    Forma de cobrança
                                                </Text>
                                                <Text className="text-sm text-muted-foreground">
                                                    {BILLING_METHOD_OPTIONS.find(
                                                        (item) => item.value === field.value,
                                                    )?.label ?? "Selecione"}
                                                </Text>
                                            </View>
                                            <ChevronDown size={20} color="#64748b" />
                                        </View>
                                    </Pressable>
                                )}
                            />

                            <Controller
                                control={control}
                                name="installmentOption"
                                render={({ field }) => (
                                    <Pressable
                                        onPress={() =>
                                            showOptions(
                                                "Parcelamento",
                                                INSTALLMENT_OPTIONS,
                                                field.onChange,
                                            )
                                        }
                                        className="rounded-2xl border border-input bg-muted px-4 py-4"
                                    >
                                        <View className="flex-row items-center justify-between">
                                            <View>
                                                <Text className="text-sm font-medium text-foreground">
                                                    Parcelamento
                                                </Text>
                                                <Text className="text-sm text-muted-foreground">
                                                    {INSTALLMENT_OPTIONS.find(
                                                        (item) => item.value === field.value,
                                                    )?.label ?? "Selecione"}
                                                </Text>
                                            </View>
                                            <ChevronDown size={20} color="#64748b" />
                                        </View>
                                    </Pressable>
                                )}
                            />

                            <Controller
                                control={control}
                                name="paymentTerm"
                                render={({ field }) => (
                                    <Pressable
                                        onPress={() =>
                                            showOptions(
                                                "Prazo de pagamento",
                                                PAYMENT_TERM_OPTIONS,
                                                field.onChange,
                                            )
                                        }
                                        className="rounded-2xl border border-input bg-muted px-4 py-4"
                                    >
                                        <View className="flex-row items-center justify-between">
                                            <View>
                                                <Text className="text-sm font-medium text-foreground">
                                                    Prazo de pagamento
                                                </Text>
                                                <Text className="text-sm text-muted-foreground">
                                                    {PAYMENT_TERM_OPTIONS.find(
                                                        (item) => item.value === field.value,
                                                    )?.label ?? "Selecione"}
                                                </Text>
                                            </View>
                                            <ChevronDown size={20} color="#64748b" />
                                        </View>
                                    </Pressable>
                                )}
                            />

                            <Controller
                                control={control}
                                name="downPayment"
                                render={({ field }) => (
                                    <Pressable
                                        onPress={() =>
                                            showOptions(
                                                "Entrada inicial",
                                                DOWN_PAYMENT_OPTIONS,
                                                field.onChange,
                                            )
                                        }
                                        className="rounded-2xl border border-input bg-muted px-4 py-4"
                                    >
                                        <View className="flex-row items-center justify-between">
                                            <View>
                                                <Text className="text-sm font-medium text-foreground">
                                                    Entrada inicial
                                                </Text>
                                                <Text className="text-sm text-muted-foreground">
                                                    {DOWN_PAYMENT_OPTIONS.find(
                                                        (item) => item.value === field.value,
                                                    )?.label ?? "Selecione"}
                                                </Text>
                                            </View>
                                            <ChevronDown size={20} color="#64748b" />
                                        </View>
                                    </Pressable>
                                )}
                            />

                            <Controller
                                control={control}
                                name="recurringBilling"
                                render={({ field }) => (
                                    <Pressable
                                        onPress={() =>
                                            showOptions(
                                                "Cobrança recorrente",
                                                RECURRING_BILLING_OPTIONS,
                                                field.onChange,
                                            )
                                        }
                                        className="rounded-2xl border border-input bg-muted px-4 py-4"
                                    >
                                        <View className="flex-row items-center justify-between">
                                            <View>
                                                <Text className="text-sm font-medium text-foreground">
                                                    Cobrança recorrente
                                                </Text>
                                                <Text className="text-sm text-muted-foreground">
                                                    {RECURRING_BILLING_OPTIONS.find(
                                                        (item) => item.value === field.value,
                                                    )?.label ?? "Selecione"}
                                                </Text>
                                            </View>
                                            <ChevronDown size={20} color="#64748b" />
                                        </View>
                                    </Pressable>
                                )}
                            />

                            <Controller
                                control={control}
                                name="formalContract"
                                render={({ field }) => (
                                    <Pressable
                                        onPress={() =>
                                            showOptions(
                                                "Contrato formal",
                                                FORMAL_CONTRACT_OPTIONS,
                                                field.onChange,
                                            )
                                        }
                                        className="rounded-2xl border border-input bg-muted px-4 py-4"
                                    >
                                        <View className="flex-row items-center justify-between">
                                            <View>
                                                <Text className="text-sm font-medium text-foreground">
                                                    Contrato formal
                                                </Text>
                                                <Text className="text-sm text-muted-foreground">
                                                    {FORMAL_CONTRACT_OPTIONS.find(
                                                        (item) => item.value === field.value,
                                                    )?.label ?? "Selecione"}
                                                </Text>
                                            </View>
                                            <ChevronDown size={20} color="#64748b" />
                                        </View>
                                    </Pressable>
                                )}
                            />
                        </View>

                        <View className="space-y-3 pt-1">
                            <Button
                                size="lg"
                                label="Próximo"
                                onPress={handleSubmit(handleSaveAdjustments)}
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
                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenContainer>
    );
}
