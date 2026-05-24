import React from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useAuthStore } from "@/store/auth.store";
import { AuthContainer } from "@/components/layout/AuthContainer";
import { Button } from "@/components/ui/Button";
import { Activity, ArrowRight, Zap } from "lucide-react-native";

export default function WelcomeScreen() {
    const router = useRouter();

    return (
        <AuthContainer>
            <View className="items-center justify-center py-8 gap-8">
                {/* Logo com glow */}
                <Animated.View entering={FadeInDown.duration(800).springify()}>
                    <LinearGradient
                        colors={["#2563eb", "#06b6d4"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                            width: 80,
                            height: 80,
                            borderRadius: 22,
                            alignItems: "center",
                            justifyContent: "center",
                            shadowColor: "#2563eb",
                            shadowOffset: { width: 0, height: 8 },
                            shadowOpacity: 0.35,
                            shadowRadius: 20,
                            elevation: 10,
                        }}
                    >
                        <Activity size={36} color="#ffffff" strokeWidth={2} />
                    </LinearGradient>
                </Animated.View>

                {/* Textos hero */}
                <View className="items-center gap-3">
                    <Animated.View
                        entering={FadeInDown.delay(200).duration(800).springify()}
                        className="px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/5"
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 6,
                        }}
                    >
                        <Zap size={10} color="#2563eb" />
                        <Text
                            className="text-[10px] tracking-widest text-primary uppercase"
                            style={{ fontFamily: "Inter_700Bold" }}
                        >
                            Precificação Inteligente
                        </Text>
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(300).duration(800).springify()}>
                        <Text
                            className="text-5xl tracking-tight text-center"
                            style={{ color: "#ffffff", fontFamily: "Inter_800ExtraBold" }}
                        >
                            Valor<Text style={{ color: "#2563eb" }}>Dev</Text>
                        </Text>
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(400).duration(800).springify()}>
                        <Text
                            className="text-base text-center px-4 leading-relaxed"
                            style={{
                                color: "#ffffff",
                                opacity: 0.85,
                                fontFamily: "Inter_300Light",
                            }}
                        >
                            A ferramenta definitiva de precificação e análise de risco para
                            freelancers.
                        </Text>
                    </Animated.View>
                </View>

                {/* Botões */}
                <View className="w-full gap-3">
                    <Button
                        variant="primary"
                        size="lg"
                        onPress={() => router.push("/auth/login")}
                        className="w-full rounded-2xl"
                    >
                        Entrar na minha conta
                    </Button>

                    <Button
                        variant="secondary"
                        size="lg"
                        onPress={() => router.push("/auth/register")}
                        className="w-full rounded-2xl"
                    >
                        Criar conta gratuita
                    </Button>
                </View>
            </View>
        </AuthContainer>
    );
}
