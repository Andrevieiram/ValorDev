import { Stack, useRouter } from "expo-router";
import { Platform, Pressable } from "react-native";
import { ChevronLeft } from "lucide-react-native";

import { useTheme } from "@/theme";

export default function WizardLayout() {
    const { colors } = useTheme();

    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: colors.background },
                headerTintColor: colors.foreground,
                headerTitleStyle: { fontWeight: "600", fontFamily: 'Inter_600SemiBold' },
                headerBackTitle: "Voltar",
                contentStyle: { backgroundColor: colors.background },
                animation: "slide_from_right",
                headerLeft: Platform.OS === "web" ? () => {
                    const router = useRouter();
                    if (!router.canGoBack()) return null;
                    return (
                        <Pressable onPress={() => router.back()} className="mr-4 flex-row items-center">
                            <ChevronLeft size={24} color={colors.foreground} />
                        </Pressable>
                    );
                } : undefined,
            }}
        >
            <Stack.Screen name="index" options={{ title: "Novo cálculo" }} />
            <Stack.Screen name="project" options={{ title: "Projeto" }} />
            <Stack.Screen name="client" options={{ title: "Cliente e riscos" }} />
            <Stack.Screen name="adjustments" options={{ title: "Ajustes finais" }} />
            <Stack.Screen name="risk" options={{ title: "Mapa de risco" }} />
            <Stack.Screen name="review" options={{ title: "Revisão", gestureEnabled: false }} />
        </Stack>
    );
}
