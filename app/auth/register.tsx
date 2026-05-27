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
import { ArrowLeft } from "lucide-react-native";

const registerSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório").min(3, "O nome deve ter no mínimo 3 caracteres"),
    email: z.string().min(1, "E-mail é obrigatório").email("Formato de e-mail inválido"),
    password: z
        .string()
        .min(1, "Senha é obrigatória")
        .min(6, "A senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z
        .string()
        .min(1, "Confirmar senha é obrigatório"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não correspondem",
    path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
    const router = useRouter();
    const registerUser = useAuthStore((s) => s.register);
    const [isLoading, setIsLoading] = useState(false);
    const [generalError, setGeneralError] = useState("");

    const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const handleRegister = async (data: RegisterFormData) => {
        setGeneralError("");
        setIsLoading(true);
        try {
            // Mock delay
            await new Promise((resolve) => setTimeout(resolve, 800));
            // Save session with password hash
            await registerUser(data.name, data.email, data.password);
            router.replace("/setup-profile");
        } catch (err) {
            setGeneralError("Erro ao criar conta. Tente novamente.");
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
                        Criar sua conta
                    </Text>
                    <Text
                        style={{ color: "#cbd5e1", fontFamily: "Inter_400Regular", fontSize: 14 }}
                    >
                        Inscreva-se gratuitamente para começar a precificar.
                    </Text>
                </View>

                {generalError && (
                    <View className="p-3 bg-danger/10 border border-danger/25 rounded-xl">
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
                        name="name"
                        render={({ field: { value, onChange } }) => (
                            <Input
                                label="Nome Completo"
                                labelClassName="text-slate-300"
                                placeholder="Seu nome"
                                value={value}
                                onChangeText={onChange}
                                autoCapitalize="words"
                                error={errors.name?.message}
                            />
                        )}
                    />

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

                    <Controller
                        control={control}
                        name="confirmPassword"
                        render={({ field: { value, onChange } }) => (
                            <Input
                                label="Confirmar Senha"
                                labelClassName="text-slate-300"
                                placeholder="••••••••"
                                value={value}
                                onChangeText={onChange}
                                secureTextEntry
                                autoCapitalize="none"
                                error={errors.confirmPassword?.message}
                            />
                        )}
                    />

                    <Button
                        variant="primary"
                        size="lg"
                        onPress={handleSubmit(handleRegister)}
                        isLoading={isLoading}
                        className="w-full mt-4"
                    >
                        Criar conta
                    </Button>
                </View>

                <View className="flex-row justify-center items-center gap-1.5 pt-4">
                    <Text className="text-xs" style={{ color: "#94a3b8" }}>
                        Já possui uma conta?
                    </Text>

                    <Pressable
                        onPress={() => router.replace("/auth/login")}
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
                            Entrar
                        </Text>
                    </Pressable>
                </View>
            </View>
        </AuthContainer>
    );
}
