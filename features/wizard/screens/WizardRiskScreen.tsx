import { useMemo, useState, useEffect } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { Card, Button } from '@/components/ui';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { WizardProgress } from '@/components/wizard/WizardProgress';
import { useWizardNavigation } from '@/hooks';
import { useWizardStore } from '@/store';
import { proposalsApi } from '@/api/proposals.api';
import type { CalculatePricingResponse } from '@/api/types';

export function WizardRiskScreen() {
  const { goToReview, goBack } = useWizardNavigation();
  const project = useWizardStore((state) => state.project);
  const client = useWizardStore((state) => state.client);
  const adjustments = useWizardStore((state) => state.adjustments);
  const setRiskReport = useWizardStore((state) => state.setRiskReport);
  const persistDraft = useWizardStore((state) => state.persistDraft);

  const [riskData, setRiskData] = useState<CalculatePricingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRiskCalculation = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = {
          profile: {}, // Não é necessário para o cálculo de risco
          project,
          client,
          adjustments,
        };

        const response = await proposalsApi.calculate(data);
        setRiskData(response);

        // Armazena o risco no store
        setRiskReport({
          score: response.riskScore,
          level: response.riskLevel as any,
          factors:
            response.riskFactors?.map((f) => ({
              name: f.name,
              score: f.score,
            })) || [],
          recommendation: response.riskRecommendation || '',
        });
      } catch (err) {
        console.error('Erro ao calcular risco:', err);
        setError('Erro ao calcular risco. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRiskCalculation();
  }, [project, client, adjustments, setRiskReport]);

  const progressColor =
    riskData?.riskLevel === 'low'
      ? 'bg-emerald-500'
      : riskData?.riskLevel === 'medium'
        ? 'bg-amber-500'
        : 'bg-red-500';

  const topRisks = useMemo(() => {
    if (!riskData?.riskFactors) return [];
    return riskData.riskFactors
      .filter((f) => f.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [riskData]);

  const handleContinue = async () => {
    await persistDraft();
    goToReview();
  };

  const getLevelLabel = (level: string | undefined) => {
    switch (level) {
      case 'low':
        return 'Baixo';
      case 'medium':
        return 'Médio';
      case 'high':
        return 'Alto';
      default:
        return 'Desconhecido';
    }
  };

  if (isLoading) {
    return (
      <ScreenContainer maxWidth="wizard">
        <WizardProgress current={4} />
        <View className="flex-1 justify-center items-center">
          <Text className="text-foreground">Calculando análise de risco...</Text>
        </View>
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer maxWidth="wizard">
        <WizardProgress current={4} />
        <View className="flex-1 justify-center gap-4 px-4">
          <Text className="text-center text-destructive font-semibold">{error}</Text>
          <Button size="md" label="Tentar novamente" onPress={() => window.location.reload()} />
          <Button size="md" variant="ghost" label="Voltar" onPress={goBack} />
        </View>
      </ScreenContainer>
    );
  }

  if (!riskData) {
    return (
      <ScreenContainer maxWidth="wizard">
        <WizardProgress current={4} />
        <View className="flex-1 justify-center items-center">
          <Text className="text-foreground">Nenhum dado disponível</Text>
        </View>
      </ScreenContainer>
    );
  }

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
              <Text className="text-2xl font-semibold text-foreground">Mapa de risco</Text>
              <Text className="text-sm leading-6 text-muted-foreground">
                Consolidando os dados do wizard para gerar um score simples e transparente.
              </Text>
            </View>

            <Card variant="outlined" className="gap-4">
              <View className="gap-2">
                <Text className="text-sm font-medium text-foreground">Nível de risco</Text>
                <Text className="text-xs text-muted-foreground">
                  Score calculado com base nos fatores coletados anteriormente.
                </Text>
              </View>
              <View className="rounded-full bg-muted h-3 overflow-hidden">
                <View
                  className={`${progressColor} h-full`}
                  style={{ width: `${riskData.riskScore}%` }}
                />
              </View>
              <View className="flex-row items-end justify-between">
                <Text className="text-lg font-semibold text-foreground">
                  {riskData.riskScore} / 100
                </Text>
                <Text className="text-sm font-medium text-foreground capitalize">
                  {getLevelLabel(riskData.riskLevel)}
                </Text>
              </View>
              <Text className="text-sm text-muted-foreground">{riskData.riskRecommendation}</Text>
            </Card>

            {topRisks.length > 0 && (
              <Card variant="outlined">
                <Text className="text-sm font-medium text-foreground mb-3">Fatores analisados</Text>
                <View className="gap-2">
                  {riskData.riskFactors?.map((factor) => (
                    <View key={factor.name} className="flex-row justify-between items-center">
                      <Text className="text-sm text-foreground flex-1">{factor.name}</Text>
                      <Text
                        className={`text-sm font-medium ${
                          factor.score > 0
                            ? 'text-destructive'
                            : factor.score < 0
                              ? 'text-emerald-500'
                              : 'text-muted-foreground'
                        }`}
                      >
                        {factor.score > 0 ? '+' : ''}
                        {factor.score}
                      </Text>
                    </View>
                  ))}
                </View>
              </Card>
            )}

            <View className="gap-3 pt-1">
              <Button size="md" label="Continuar para revisão" onPress={handleContinue} />
              <Button size="md" variant="ghost" label="Voltar" onPress={goBack} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
