import {
    ActionSheetIOS,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    Text,
    View,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, ChevronDown, Link, Clock3 } from "lucide-react-native";

import { Button, Input } from "@/components/ui";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { useWizardNavigation } from "@/hooks";
import { useWizardStore } from "@/store";
import {
    PROJECT_TYPE_OPTIONS,
    COMPLEXITY_OPTIONS,
    WIZARD_PROJECT_SCHEMA,
    type WizardProjectFormValues,
} from "../schema";

export function WizardProjectScreen() {
    const { goToClient, goBack } = useWizardNavigation();
    const project = useWizardStore((s) => s.project);
    const setProject = useWizardStore((s) => s.setProject);
    const persistDraft = useWizardStore((s) => s.persistDraft);

    const {
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<WizardProjectFormValues>({
        mode: "onBlur",
        resolver: zodResolver(WIZARD_PROJECT_SCHEMA),
        defaultValues: {
            projectType: project.projectType || "webapp",
            complexity: project.complexity || "medium",
            deadline: project.deadline || "",
            scopeDocumented: !!project.deadline ? true : false,
            maintenance:
                project.maintenance === "yes" || project.maintenance === "true" ? true : false,
            meetingsFrequency: project.meetings || "Semanal",
            externalDependencies: project.projectType || "",
            reuseComponents: false,
            toolsUsed: project.projectType || "",
        },
    });

    const projectType = watch("projectType");
    const complexity = watch("complexity");
    const scopeDocumented = watch("scopeDocumented");
    const maintenance = watch("maintenance");

    const showOptions = <T extends string | boolean>(
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

    const handleSaveProject = async (values: WizardProjectFormValues) => {
        // Persist only the fields relevant to store.ProjectData shape
        setProject({
            projectType: values.projectType,
            complexity: values.complexity,
            deadline: values.deadline,
            scopeDocumented: values.scopeDocumented,
            isUrgent: "",
            meetings: values.meetingsFrequency,
            maintenance: values.maintenance ? "yes" : "no",
        });

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
                <View className="space-y-6">
                    <View className="space-y-3">
                        <Text className="text-2xl font-semibold text-foreground">
                            Contexto do projeto
                        </Text>
                        <Text className="text-sm leading-6 text-muted-foreground">
                            Conte de forma sucinta o escopo e características do projeto.
                        </Text>
                    </View>

                    <View className="space-y-4 rounded-[28px] border border-input bg-background p-4">
                        <View className="space-y-2">
                            <Text className="text-sm font-medium text-foreground">
                                O que será construído
                            </Text>
                            <Text className="text-xs text-muted-foreground">
                                Selecione o tipo e a complexidade do produto.
                            </Text>
                        </View>

                        <Pressable
                            onPress={() =>
                                showOptions("Tipo de projeto", PROJECT_TYPE_OPTIONS, (value) =>
                                    setValue("projectType", value as any, { shouldValidate: true }),
                                )
                            }
                            className="rounded-2xl border border-input bg-muted px-4 py-4"
                        >
                            <View className="flex-row items-center justify-between">
                                <View>
                                    <Text className="text-sm font-medium text-foreground">
                                        Tipo de projeto
                                    </Text>
                                    <Text className="text-sm text-muted-foreground">
                                        {PROJECT_TYPE_OPTIONS.find(
                                            (opt) => opt.value === projectType,
                                        )?.label ?? "Selecione"}
                                    </Text>
                                </View>
                                <ChevronDown size={20} color="#64748b" />
                            </View>
                        </Pressable>

                        <Pressable
                            onPress={() =>
                                showOptions("Complexidade", COMPLEXITY_OPTIONS, (value) =>
                                    setValue("complexity", value as any, { shouldValidate: true }),
                                )
                            }
                            className="rounded-2xl border border-input bg-muted px-4 py-4"
                        >
                            <View className="flex-row items-center justify-between">
                                <View>
                                    <Text className="text-sm font-medium text-foreground">
                                        Complexidade
                                    </Text>
                                    <Text className="text-sm text-muted-foreground">
                                        {COMPLEXITY_OPTIONS.find((opt) => opt.value === complexity)
                                            ?.label ?? "Selecione"}
                                    </Text>
                                </View>
                                <ChevronDown size={20} color="#64748b" />
                            </View>
                        </Pressable>
                    </View>

                    <View className="space-y-4 rounded-[28px] border border-input bg-background p-4">
                        <View className="space-y-2">
                            <Text className="text-sm font-medium text-foreground">
                                Detalhes do escopo
                            </Text>
                            <Text className="text-xs text-muted-foreground">
                                Adicione informações que vão deixar o projeto mais claro.
                            </Text>
                        </View>

                        <Controller
                            control={control}
                            name="deadline"
                            render={({ field }) => (
                                <Input
                                    label="Prazo estimado"
                                    placeholder="Ex: 3 meses"
                                    value={field.value}
                                    onChangeText={field.onChange}
                                    onBlur={field.onBlur}
                                    error={errors.deadline?.message}
                                    helper="Informe o período em que pretende entregar o trabalho."
                                    leftIcon={<Calendar size={18} color="#0f766e" />}
                                    className="rounded-2xl"
                                    inputClassName="py-3 text-sm"
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="scopeDocumented"
                            render={({ field }) => (
                                <Pressable
                                    onPress={() =>
                                        showOptions(
                                            "Escopo documentado",
                                            [
                                                { label: "Sim", value: true },
                                                { label: "Não", value: false },
                                            ],
                                            field.onChange,
                                        )
                                    }
                                    className="rounded-2xl border border-input bg-muted px-4 py-4"
                                >
                                    <View className="flex-row items-center justify-between">
                                        <View>
                                            <Text className="text-sm font-medium text-foreground">
                                                Escopo documentado
                                            </Text>
                                            <Text className="text-sm text-muted-foreground">
                                                {field.value ? "Sim" : "Não"}
                                            </Text>
                                        </View>
                                        <ChevronDown size={20} color="#64748b" />
                                    </View>
                                </Pressable>
                            )}
                        />

                        <Controller
                            control={control}
                            name="maintenance"
                            render={({ field }) => (
                                <Pressable
                                    onPress={() =>
                                        showOptions(
                                            "Manutenção pós-entrega",
                                            [
                                                { label: "Sim", value: true },
                                                { label: "Não", value: false },
                                            ],
                                            field.onChange,
                                        )
                                    }
                                    className="rounded-2xl border border-input bg-muted px-4 py-4"
                                >
                                    <View className="flex-row items-center justify-between">
                                        <View>
                                            <Text className="text-sm font-medium text-foreground">
                                                Manutenção pós-entrega
                                            </Text>
                                            <Text className="text-sm text-muted-foreground">
                                                {field.value ? "Sim" : "Não"}
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
                                Como o processo vai funcionar
                            </Text>
                            <Text className="text-xs text-muted-foreground">
                                Compartilhe o que torna a entrega mais previsível.
                            </Text>
                        </View>

                        <Controller
                            control={control}
                            name="meetingsFrequency"
                            render={({ field }) => (
                                <Input
                                    label="Frequência de reuniões"
                                    placeholder="Ex: Semanal"
                                    value={field.value}
                                    onChangeText={field.onChange}
                                    onBlur={field.onBlur}
                                    helper="Como serão as checagens de progresso?"
                                    leftIcon={<Clock3 size={18} color="#0f766e" />}
                                    className="rounded-2xl"
                                    inputClassName="py-3 text-sm"
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="externalDependencies"
                            render={({ field }) => (
                                <Input
                                    label="Dependências externas"
                                    placeholder="APIs, serviços ou terceiros"
                                    value={field.value}
                                    onChangeText={field.onChange}
                                    onBlur={field.onBlur}
                                    helper="Liste integrações ou serviços de terceiros."
                                    leftIcon={<Link size={18} color="#0f766e" />}
                                    className="rounded-2xl"
                                    inputClassName="py-3 text-sm"
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="reuseComponents"
                            render={({ field }) => (
                                <View className="space-y-3">
                                    <Text className="text-sm font-medium text-foreground">
                                        Reaproveitamento
                                    </Text>
                                    <Text className="text-xs text-muted-foreground">
                                        Existem componentes ou design system reutilizáveis?
                                    </Text>
                                    <View className="flex-row gap-2">
                                        <Button
                                            size="sm"
                                            variant={field.value ? "primary" : "ghost"}
                                            label="Sim"
                                            onPress={() => field.onChange(true)}
                                            className="rounded-2xl"
                                        />
                                        <Button
                                            size="sm"
                                            variant={!field.value ? "ghost" : "secondary"}
                                            label="Não"
                                            onPress={() => field.onChange(false)}
                                            className="rounded-2xl"
                                        />
                                    </View>
                                </View>
                            )}
                        />

                        <Controller
                            control={control}
                            name="toolsUsed"
                            render={({ field }) => (
                                <Input
                                    label="Ferramentas utilizadas"
                                    placeholder="Ex: React, Expo, Firebase"
                                    value={field.value}
                                    onChangeText={field.onChange}
                                    onBlur={field.onBlur}
                                    helper="Principais ferramentas e stacks previstas para o projeto."
                                    className="rounded-2xl"
                                    inputClassName="py-3 text-sm"
                                />
                            )}
                        />
                    </View>

                    <View className="space-y-3 pt-1">
                        <Button
                            size="lg"
                            label="Próximo"
                            onPress={handleSubmit(handleSaveProject)}
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
