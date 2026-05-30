import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { Card, Button } from '@/components/ui';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { WizardProgress } from '@/components/wizard/WizardProgress';
import { useWizardNavigation } from '@/hooks';
import { useWizardStore } from '@/store';
import { AlertCircle } from 'lucide-react-native';

export function WizardRiskScreen() {
  const { goToReview, goBack } = useWizardNavigation();
  const persistDraft = useWizardStore((state) => state.persistDraft);

  const handleContinue = async () => {
    await persistDraft();
    goToReview();
  };

  return (
    <ScreenContainer maxWidth="wizard">
      <WizardProgress current={4} />
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: 'height' })}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 24}
      >
        <ScrollView contentContainerStyle={{ paddingVertical: 24 }} className="px-4">
          <View className="gap-5">
            <View className="gap-2">
              <Text className="text-2xl font-semibold text-foreground">Análise de Risco</Text>
              <Text className="text-sm leading-6 text-muted-foreground">
                Seus dados serão analisados no próximo passo para gerar a proposta com cálculo
                completo de risco.
              </Text>
            </View>

            <Card
              variant="outlined"
              className="gap-4 border-warning/50 bg-warning/5 flex-row items-start"
            >
              <View className="pt-0.5">
                <AlertCircle size={20} color="rgb(202, 138, 4)" />
              </View>
              <View className="flex-1 gap-2">
                <Text className="text-sm font-semibold text-amber-900">
                  Cálculo de Risco no Backend
                </Text>
                <Text className="text-sm text-amber-800 leading-5">
                  O risco será calculado no servidor considerando todos os fatores coletados:
                </Text>
                <Text className="text-xs text-amber-700 leading-4 mt-2">
                  • Complexidade e prazo do projeto
                  {'\n'}• Experiência digital do cliente
                  {'\n'}• Termos de contrato e pagamento
                  {'\n'}• Outras condições comerciais
                </Text>
              </View>
            </Card>

            <Card variant="outlined" className="gap-3">
              <Text className="text-sm font-semibold text-foreground">
                O que esperar na próxima etapa
              </Text>
              <View className="gap-2">
                <View className="flex-row gap-2">
                  <Text className="text-muted-foreground">✓</Text>
                  <Text className="text-sm text-foreground flex-1">
                    Score de risco consolidado (0-100)
                  </Text>
                </View>
                <View className="flex-row gap-2">
                  <Text className="text-muted-foreground">✓</Text>
                  <Text className="text-sm text-foreground flex-1">
                    Classificação (Baixo, Médio, Alto)
                  </Text>
                </View>
                <View className="flex-row gap-2">
                  <Text className="text-muted-foreground">✓</Text>
                  <Text className="text-sm text-foreground flex-1">Recomendação personalizada</Text>
                </View>
                <View className="flex-row gap-2">
                  <Text className="text-muted-foreground">✓</Text>
                  <Text className="text-sm text-foreground flex-1">
                    Estimativa comercial (MIN, REC, MAX)
                  </Text>
                </View>
              </View>
            </Card>

            <View className="gap-3 pt-1">
              <Button size="md" label="Prosseguir para revisão" onPress={handleContinue} />
              <Button size="md" variant="ghost" label="Voltar" onPress={goBack} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
