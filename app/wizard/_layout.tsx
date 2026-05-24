import { Stack } from "expo-router";

import { colors } from "@/theme";

export default function WizardLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: colors.background },
                headerTintColor: colors.foreground,
                headerTitleStyle: { fontWeight: "600" },
                headerBackTitle: "Voltar",
                contentStyle: { backgroundColor: colors.background },
                animation: "slide_from_right",
            }}
        >
            <Stack.Screen name="index" options={{ title: "Novo cálculo" }} />
            <Stack.Screen name="profile" options={{ title: "Perfil financeiro" }} />
            <Stack.Screen name="project" options={{ title: "Projeto" }} />
            <Stack.Screen name="client" options={{ title: "Cliente e riscos" }} />
            <Stack.Screen name="adjustments" options={{ title: "Ajustes finais" }} />
            <Stack.Screen name="risk" options={{ title: "Mapa de risco" }} />
            <Stack.Screen name="review" options={{ title: "Revisão", gestureEnabled: false }} />
        </Stack>
    );
}
