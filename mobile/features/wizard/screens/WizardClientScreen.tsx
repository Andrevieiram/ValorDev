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
            clientType: client.clientType || "business",
            digitalExperience: client.digitalExperience || "experienced",
            recurringClient: client.recurringClient || "no",
            location: client.location || "national",
            businessImpact: client.businessImpact || "medium",
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

    const handleSaveClient = async (values: WizardClientFormValues) => {
        setClient(values);
        await persistDraft();
        goToAdjustments();
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
                                Perfil do cliente
                            </Text>
                            <Text className="text-sm leading-6 text-muted-foreground">
                                Colete as informações essenciais do cliente para que a proposta
                                fique alinhada ao negócio.
                            </Text>
                        </View>

                        <View className="space-y-4 rounded-[28px] border border-input bg-background p-4">
                            <View className="space-y-2">
                                <Text className="text-sm font-medium text-foreground">
                                    Quem é o cliente
                                </Text>
                                <Text className="text-xs text-muted-foreground">
                                    Estruture o perfil do cliente sem adicionar decisões
                                    automáticas.
                                </Text>
                            </View>

                            <Controller
                                control={control}
                                name="clientType"
                                render={({ field }) => (
                                    <Pressable
                                        onPress={() =>
                                            showOptions(
                                                "Tipo de cliente",
                                                CLIENT_TYPE_OPTIONS,
                                                field.onChange,
                                            )
                                        }
                                        className="rounded-2xl border border-input bg-muted px-4 py-4"
                                    >
                                        <View className="flex-row items-center justify-between">
                                            <View>
                                                <Text className="text-sm font-medium text-foreground">
                                                    Tipo de cliente
                                                </Text>
                                                <Text className="text-sm text-muted-foreground">
                                                    {CLIENT_TYPE_OPTIONS.find(
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
                                name="digitalExperience"
                                render={({ field }) => (
                                    <Pressable
                                        onPress={() =>
                                            showOptions(
                                                "Experiência digital",
                                                DIGITAL_EXPERIENCE_OPTIONS,
                                                field.onChange,
                                            )
                                        }
                                        className="rounded-2xl border border-input bg-muted px-4 py-4"
                                    >
                                        <View className="flex-row items-center justify-between">
                                            <View>
                                                <Text className="text-sm font-medium text-foreground">
                                                    Experiência digital
                                                </Text>
                                                <Text className="text-sm text-muted-foreground">
                                                    {DIGITAL_EXPERIENCE_OPTIONS.find(
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

                        <View className="space-y-4 rounded-[28px] border border-input bg-background p-4">
                            <View className="space-y-2">
                                <Text className="text-sm font-medium text-foreground">
                                    Contexto do projeto
                                </Text>
                                <Text className="text-xs text-muted-foreground">
                                    Registre dados do cliente que ajudam a manter a proposta clara e
                                    consistente.
                                </Text>
                            </View>

                            <Controller
                                control={control}
                                name="recurringClient"
                                render={({ field }) => (
                                    <Pressable
                                        onPress={() =>
                                            showOptions(
                                                "Cliente recorrente",
                                                RECURRING_CLIENT_OPTIONS,
                                                field.onChange,
                                            )
                                        }
                                        className="rounded-2xl border border-input bg-muted px-4 py-4"
                                    >
                                        <View className="flex-row items-center justify-between">
                                            <View>
                                                <Text className="text-sm font-medium text-foreground">
                                                    Cliente recorrente
                                                </Text>
                                                <Text className="text-sm text-muted-foreground">
                                                    {RECURRING_CLIENT_OPTIONS.find(
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
                                name="location"
                                render={({ field }) => (
                                    <Pressable
                                        onPress={() =>
                                            showOptions(
                                                "Localização",
                                                LOCATION_OPTIONS,
                                                field.onChange,
                                            )
                                        }
                                        className="rounded-2xl border border-input bg-muted px-4 py-4"
                                    >
                                        <View className="flex-row items-center justify-between">
                                            <View>
                                                <Text className="text-sm font-medium text-foreground">
                                                    Localização
                                                </Text>
                                                <Text className="text-sm text-muted-foreground">
                                                    {LOCATION_OPTIONS.find(
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
                                name="businessImpact"
                                render={({ field }) => (
                                    <Pressable
                                        onPress={() =>
                                            showOptions(
                                                "Impacto no negócio",
                                                BUSINESS_IMPACT_OPTIONS,
                                                field.onChange,
                                            )
                                        }
                                        className="rounded-2xl border border-input bg-muted px-4 py-4"
                                    >
                                        <View className="flex-row items-center justify-between">
                                            <View>
                                                <Text className="text-sm font-medium text-foreground">
                                                    Impacto no negócio
                                                </Text>
                                                <Text className="text-sm text-muted-foreground">
                                                    {BUSINESS_IMPACT_OPTIONS.find(
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
                                onPress={handleSubmit(handleSaveClient)}
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
