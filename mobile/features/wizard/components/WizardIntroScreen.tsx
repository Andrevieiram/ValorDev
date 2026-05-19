import { Text } from "react-native";

import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { Button, Card } from "@/components/ui";
import { WIZARD_TOTAL_STEPS } from "@/constants";
import { useWizardNavigation } from "@/hooks";
import { useWizardStore } from "@/store";

export function WizardIntroScreen() {
    const { goToProfile, goHome } = useWizardNavigation();
    const resetWizard = useWizardStore((s) => s.resetWizard);

    const handleStart = () => {
        resetWizard();
        goToProfile();
    };

    return (
        <ScreenContainer>
            <Text className="text-2xl font-semibold text-foreground mb-2">
                Wizard de precificação
            </Text>
            <Text className="text-muted-foreground mb-6">
                Fluxo em {WIZARD_TOTAL_STEPS} etapas — navegação via Expo Router Stack.
            </Text>

            <Card variant="outlined" className="mb-6">
                <Text className="text-sm text-muted-foreground">
                    Estado global em Zustand (`useWizardStore`). Dados do formulário serão
                    conectados com React Hook Form na próxima etapa.
                </Text>
            </Card>

            <Button size="lg" className="mb-3" label="Iniciar cálculo" onPress={handleStart} />
            <Button size="lg" variant="ghost" label="Cancelar" onPress={goHome} />
        </ScreenContainer>
    );
}
