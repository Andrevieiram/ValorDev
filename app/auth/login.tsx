import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/store/auth.store";
import { AuthContainer } from "@/components/layout/AuthContainer";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useWizardStore } from "@/store/wizard.store";
import { ArrowLeft } from "lucide-react-native";

const loginSchema = z.object({
    email: z.string().min(1, "E-mail é obrigatório").email("Formato de e-mail inválido"),
    password: z
        .string()
        .min(1, "Senha é obrigatória")
        .min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
    const router = useRouter();
    const login = useAuthStore((s) => s.login);
    const [isLoading, setIsLoading] = useState(false);
    const [generalError, setGeneralError] = useState("");

    const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const handleLogin = async (data: LoginFormData) => {
        setGeneralError("");

        setIsLoading(true);
        try {
            // Mock login delay
            await new Promise((resolve) => setTimeout(resolve, 800));

            // Extract name from email for mock purposes
            const mockName = data.email.split("@")[0].replace(/[^a-zA-Z0-9]/g, " ");
            const formattedName = mockName.charAt(0).toUpperCase() + mockName.slice(1);

            // Save session with password verification
            await login(data.email, data.password, formattedName);

            // Verify if the user has completed their financial profile
            const hasProfile = useWizardStore.getState().profile.desiredIncome !== "";

            if (hasProfile) {
                router.replace("/(tabs)");
            } else {
                router.replace("/setup-profile");
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro ao fazer login. Tente novamente.";
            setGeneralError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContainer>
            <View className="gap-6">
                {/* Back Link */}
                <Pressable
                    onPress={() => router.back()}
                    className="flex-row items-center gap-2 mb-2 self-start"
                    style={({ pressed }) => ({
                        opacity: pressed ? 0.7 : 1,
                    })}
                >
                    <ArrowLeft size={16} color="#cbd5e1" />

                    <Text
                        style={{
                            color: "#cbd5e1",
                            fontFamily: "Inter_500Medium",
                            fontSize: 14,
                        }}
                    >
                        Voltar
                    </Text>
                </Pressable>

                <View className="gap-1">
                    <Text style={{ color: "#ffffff", fontFamily: "Inter_700Bold", fontSize: 24 }}>
                        Seja bem-vindo
                    </Text>
                    <Text
                        style={{ color: "#cbd5e1", fontFamily: "Inter_400Regular", fontSize: 14 }}
                    >
                        Acesse sua conta para salvar suas simulações.
                    </Text>
                </View>

                {generalError && (
                    <View className="p-3 bg-destructive/10 border border-destructive/25 rounded-xl">
                        <Text
                            className="text-xs text-destructive text-center"
                            style={{ fontFamily: "Inter_500Medium" }}
                        >
                            {generalError}
                        </Text>
                    </View>
                )}

                <View className="gap-4">
                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { value, onChange } }) => (
                            <Input
                                label="E-mail"
                                labelClassName="text-slate-300"
                                placeholder="seu-email@dominio.com"
                                value={value}
                                onChangeText={onChange}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                error={errors.email?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { value, onChange } }) => (
                            <Input
                                label="Senha"
                                labelClassName="text-slate-300"
                                placeholder="••••••••"
                                value={value}
                                onChangeText={onChange}
                                secureTextEntry
                                autoCapitalize="none"
                                error={errors.password?.message}
                            />
                        )}
                    />

                    <Button
                        variant="primary"
                        size="lg"
                        onPress={handleSubmit(handleLogin)}
                        isLoading={isLoading}
                        className="w-full rounded-xl"
                    >
                        Entrar
                    </Button>
                </View>

                <View className="flex-row justify-center items-center gap-1.5 pt-4">
                    <Text className="text-xs" style={{ color: "#94a3b8" }}>
                        Não tem uma conta?
                    </Text>
                    <Pressable
                        onPress={() => router.replace("/auth/register")}
                        style={({ pressed }) => ({
                            opacity: pressed ? 0.7 : 1,
                        })}
                    >
                        <Text
                            className="text-xs"
                            style={{
                                color: "#3b82f6",
                                fontFamily: "Inter_600SemiBold",
                            }}
                        >
                            Cadastre-se
                        </Text>
                    </Pressable>
                </View>
            </View>
        </AuthContainer>
    );
}
