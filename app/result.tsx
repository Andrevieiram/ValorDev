import React, { useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Badge, Button, Card } from '@/components/ui';
import { useWizardNavigation } from '@/hooks';
import { useWizardStore, useHistoryStore } from '@/store';
import { formatCurrency } from '@/utils';
import { proposalsApi } from '@/api/proposals.api';

const riskLabelMap = {
  low: { label: 'Baixo risco', variant: 'success' as const },
  medium: { label: 'Risco moderado', variant: 'warning' as const },
  high: { label: 'Alto risco', variant: 'danger' as const },
};

const projectTypeLabels: Record<string, string> = {
  landing: 'Landing page',
  website: 'Website',
  webapp: 'Web App',
  mobile: 'App móvel',
  api: 'API',
};

export default function ResultScreen() {
  const { goBack, goHome } = useWizardNavigation();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const project = useWizardStore((s) => s.project);
  const client = useWizardStore((s) => s.client);
  const adjustments = useWizardStore((s) => s.adjustments);
  const result = useWizardStore((s) => s.result);

  // Se não houver resultado do backend, redirecionar de volta
  if (!result) {
    return (
      <ScreenContainer maxWidth="simple">
        <View className="flex-1 justify-center items-center gap-4">
          <Text className="text-lg font-semibold text-foreground">Estimativa não encontrada</Text>
          <Text className="text-sm text-muted-foreground text-center">
            Por favor, complete o wizard e gere a estimativa novamente.
          </Text>
          <Button label="Voltar ao Wizard" onPress={() => router.replace('/wizard')} />
        </View>
      </ScreenContainer>
    );
  }

  const positiveHighlights = (result.riskFactors ?? []).slice(0, 3);
  const riskHighlights = (result.riskFactors ?? []).slice(0, 3);

  const handleExport = () =>
    Alert.alert('Exportar PDF', 'Essa função de exportação em PDF será disponibilizada em breve.');

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const proposalName = projectTypeLabels[project.projectType] || 'Projeto Personalizado';

      // Criar proposta no backend
      await proposalsApi.create({
        name: proposalName,
        ...project,
        ...client,
        ...adjustments,
      });

      // Salvar no histórico local após sucesso no backend
      await useHistoryStore.getState().addItem({
        name: proposalName,
        value: result.recommended,
        date: new Date().toLocaleDateString('pt-BR'),
        status: 'sent',
      });

      Alert.alert('Sucesso', 'Proposta salva com sucesso no seu histórico!', [
        { text: 'Ver Histórico', onPress: () => router.replace('/history') },
        { text: 'Ir para Início', onPress: () => goHome() },
      ]);
    } catch (error) {
      console.error('Erro ao salvar proposta:', error);
      Alert.alert('Erro', 'Não foi possível salvar a proposta. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScreenContainer maxWidth="simple">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="gap-6 pb-8">
          <View className="gap-2">
            <Text className="text-2xl text-foreground" style={{ fontFamily: 'Inter_700Bold' }}>
              Estimativa comercial
            </Text>
            <Text className="text-sm leading-6 text-muted-foreground">
              Proposta premium calculada com base no perfil técnico e condições comerciais.
            </Text>
          </View>

          {/* Main Value Display */}
          <Card variant="elevated" className="gap-4 p-6 items-center">
            <Text
              className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
              style={{ fontFamily: 'Inter_600SemiBold' }}
            >
              Valor recomendado
            </Text>
            <Text
              className="text-5xl text-primary my-2"
              style={{ fontFamily: 'JetBrainsMono_700Bold' }}
            >
              {formatCurrency(result.recommended)}
            </Text>
            <Text className="text-center text-sm text-muted-foreground leading-5 px-2">
              Preço otimizado para cobertura de impostos, riscos e margem líquida pretendida.
            </Text>

            <View className="flex-row flex-wrap justify-center gap-2 pt-2">
              <Badge
                size="sm"
                variant={riskLabelMap[result.riskLevel].variant}
                label={riskLabelMap[result.riskLevel].label}
              />
              <Badge size="sm" variant="success" label={`Confiança ${result.confidence}%`} />
            </View>
          </Card>

          {/* Proposal Range & Breakdown */}
          <Card variant="outlined" className="gap-4">
            <Text className="text-sm font-bold text-foreground dark:text-white">
              Composição da proposta
            </Text>
            <View className="gap-3">
              {result.breakdown.map((item) => (
                <View key={item.label} className="flex-row justify-between items-start">
                  <View className="flex-1 pr-3">
                    <Text className="text-sm font-semibold text-foreground dark:text-slate-200">
                      {item.label}
                    </Text>
                    <Text className="text-xs text-muted-foreground">{item.description}</Text>
                  </View>
                  <Text className="text-sm font-semibold text-foreground dark:text-slate-100">
                    {item.value >= 0 ? '+' : ''}
                    {formatCurrency(item.value)}
                  </Text>
                </View>
              ))}
            </View>

            <View className="border-t border-border dark:border-white/5 pt-4">
              <View className="flex-row justify-between">
                <Text className="text-sm font-bold text-foreground dark:text-white">
                  Faixa recomendada de negociação
                </Text>
                <Text className="text-sm font-semibold text-primary">
                  {formatCurrency(result.minimum)} — {formatCurrency(result.premium)}
                </Text>
              </View>
            </View>
          </Card>

          {/* Detail Justification */}
          <Card variant="outlined" className="gap-4">
            <Text className="text-sm font-bold text-foreground dark:text-white">
              Por que esse valor
            </Text>
            <View className="gap-4">
              {positiveHighlights.length > 0 && (
                <View>
                  <Text className="text-xs uppercase tracking-[0.15em] text-primary font-bold mb-2">
                    Fatores positivos
                  </Text>
                  {positiveHighlights.map((item) => (
                    <Text
                      key={item}
                      className="text-sm text-foreground dark:text-slate-200 leading-5"
                    >
                      • {item}
                    </Text>
                  ))}
                </View>
              )}

              {riskHighlights.length > 0 && (
                <View>
                  <Text className="text-xs uppercase tracking-[0.15em] text-destructive font-bold mb-2">
                    Fatores de atenção
                  </Text>
                  {riskHighlights.map((item) => (
                    <Text key={item} className="text-sm text-destructive leading-5">
                      • {item}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          </Card>

          {/* Navigation Actions */}
          <View className="gap-3 pt-2">
            <Button
              size="lg"
              label={isSaving ? 'Salvando...' : 'Salvar no Histórico'}
              onPress={handleSave}
              disabled={isSaving}
              className="rounded-3xl shadow-md py-4"
            />
            <Button
              size="lg"
              variant="secondary"
              label="Exportar PDF"
              onPress={handleExport}
              disabled={isSaving}
              className="rounded-3xl"
            />
            <Button
              size="lg"
              variant="ghost"
              label="Refazer cálculo"
              onPress={goBack}
              disabled={isSaving}
              className="rounded-3xl"
            />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
