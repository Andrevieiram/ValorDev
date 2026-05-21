import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { z } from "zod";
import { useAuthStore } from "@/store/auth.store";
import { AuthContainer } from "@/components/layout/AuthContainer";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useWizardStore } from "@/store/wizard.store";
import { ArrowLeft } from "lucide-react-native";

const loginSchema = z.object({
  email: z.string().nonempty("E-mail é obrigatório").email("Formato de e-mail inválido"),
  password: z.string().nonempty("Senha é obrigatória").min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setErrors({});
    const validation = loginSchema.safeParse({ email, password });
    
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
      // Mock login delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // Extract name from email for mock purposes
      const mockName = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, " ");
      const formattedName = mockName.charAt(0).toUpperCase() + mockName.slice(1);

      // Save session
      await login(email, formattedName);

      // Verify if the user has completed their financial profile
      const hasProfile = useWizardStore.getState().profile.desiredIncome !== "";
      
      if (hasProfile) {
        router.replace("/(tabs)");
      } else {
        router.replace("/setup-profile");
      }
    } catch (err) {
      setErrors({ general: "Ocorreu um erro ao fazer login. Tente novamente." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer>
      <View className="gap-6">
        {/* Back Link */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          className="flex-row items-center gap-2 mb-2 self-start"
        >
          <ArrowLeft size={16} color="#cbd5e1" />
          <Text style={{ color: '#cbd5e1', fontFamily: 'Inter_500Medium', fontSize: 14 }}>Voltar</Text>
        </TouchableOpacity>

        <View className="gap-1">
          <Text style={{ color: '#ffffff', fontFamily: 'Inter_700Bold', fontSize: 24 }}>
            Seja bem-vindo
          </Text>
          <Text style={{ color: '#cbd5e1', fontFamily: 'Inter_400Regular', fontSize: 14 }}>
            Acesse sua conta para salvar suas simulações.
          </Text>
        </View>

        {errors.general && (
          <View className="p-3 bg-destructive/10 border border-destructive/25 rounded-xl">
            <Text className="text-xs text-destructive text-center" style={{ fontFamily: 'Inter_500Medium' }}>
              {errors.general}
            </Text>
          </View>
        )}

        <View className="gap-4">
          <Input
            label="E-mail"
            labelClassName="text-slate-300"
            placeholder="seu-email@dominio.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />

          <Input
            label="Senha"
            labelClassName="text-slate-300"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            error={errors.password}
          />

          <Button
            variant="primary"
            size="lg"
            onPress={handleLogin}
            isLoading={isLoading}
            className="w-full rounded-xl"
          >
            Entrar
          </Button>
        </View>

        <View className="flex-row justify-center items-center gap-1.5 pt-4">
          <Text className="text-xs" style={{ color: '#94a3b8' }}>Não tem uma conta?</Text>
          <TouchableOpacity onPress={() => router.replace("/auth/register")}>
            <Text className="text-xs" style={{ color: '#3b82f6', fontFamily: 'Inter_600SemiBold' }}>
              Cadastre-se
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </AuthContainer>
  );
}
