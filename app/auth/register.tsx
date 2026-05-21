import React, { useState, useRef } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { z } from "zod";
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
});

export default function RegisterScreen() {
    const router = useRouter();
    const register = useAuthStore((s) => s.register);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

    const emailRef = useRef<TextInput>(null);
    const passwordRef = useRef<TextInput>(null);

    const handleRegister = async () => {
        setErrors({});
        const validation = registerSchema.safeParse({ name, email, password });

        if (!validation.success) {
            const fieldErrors: Record<string, string> = {};
            for (const issue of validation.error.issues) {
                if (issue.path[0]) {
                    fieldErrors[issue.path[0] as string] = issue.message;
                }
            }
            setErrors(fieldErrors);
            return;
        }

        setIsLoading(true);
        try {
            // Mock delay
            await new Promise((resolve) => setTimeout(resolve, 800));
            // Save session
            await register(name, email);
            router.replace("/setup-profile");
        } catch (err) {
            setErrors({ general: "Erro ao criar conta. Tente novamente." });
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

                {errors.general && (
                    <View className="p-3 bg-danger/10 border border-danger/25 rounded-xl">
                        <Text
                            className="text-xs text-destructive text-center"
                            style={{ fontFamily: "Inter_500Medium" }}
                        >
                            {errors.general}
                        </Text>
                    </View>
                )}

                <View className="gap-4">
                    <Input
                        label="Nome Completo"
                        labelClassName="text-slate-300"
                        placeholder="Seu nome"
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="words"
                        error={errors.name}
                        returnKeyType="next"
                        onSubmitEditing={() => emailRef.current?.focus()}
                        blurOnSubmit={false}
                    />

                    <Input
                        ref={emailRef}
                        label="E-mail"
                        labelClassName="text-slate-300"
                        placeholder="seu-email@dominio.com"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        error={errors.email}
                        returnKeyType="next"
                        onSubmitEditing={() => passwordRef.current?.focus()}
                        blurOnSubmit={false}
                    />

                    <Input
                        ref={passwordRef}
                        label="Senha"
                        labelClassName="text-slate-300"
                        placeholder="••••••••"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        autoCapitalize="none"
                        error={errors.password}
                        returnKeyType="done"
                        onSubmitEditing={handleRegister}
                    />

                    <Button
                        variant="primary"
                        size="lg"
                        onPress={handleRegister}
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
