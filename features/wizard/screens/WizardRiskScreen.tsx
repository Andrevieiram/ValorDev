import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { Card, Button, Badge } from '@/components/ui';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { WizardProgress } from '@/components/wizard/WizardProgress';
import { useWizardNavigation } from '@/hooks';
import { useWizardStore } from '@/store';
import { AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react-native';
import { calculateRisk } from '../risk';

export function WizardRiskScreen() {
  const { goToReview, goBack } = useWizardNavigation();
  const persistDraft = useWizardStore((state) => state.persistDraft);
  const project = useWizardStore((state) => state.project);
  const client = useWizardStore((state) => state.client);
  const adjustments = useWizardStore((state) => state.adjustments);

  // Calcular análise prévia de risco
  const riskReport = calculateRisk(project, client, adjustments);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Baixo':
        return { bg: 'rgba(34, 197, 94, 0.15)', text: '#22c55e', icon: 'success' };
      case 'Médio':
        return { bg: 'rgba(234, 179, 8, 0.15)', text: '#eab308', icon: 'warning' };
      case 'Alto':
        return { bg: 'rgba(249, 115, 22, 0.15)', text: '#f97316', icon: 'danger' };
      case 'Crítico':
        return { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444', icon: 'critical' };
      default:
        return { bg: 'rgba(148, 163, 184, 0.15)', text: '#94a3b8', icon: 'default' };
    }
  };

  const riskColor = getRiskColor(riskReport.level);

  const topRisks = (riskReport.factors || [])
    .filter((f) => f.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

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
                Veja a análise preliminar de riscos antes de gerar a estimativa comercial.
              </Text>
            </View>

            {/* Risk Score Card */}
            <Card
              variant="elevated"
              className="gap-4 p-6 items-center"
              style={{ backgroundColor: riskColor.bg }}
            >
              <View className="flex-row items-center gap-2">
                {riskColor.icon === 'success' && <CheckCircle size={24} color={riskColor.text} />}
                {riskColor.icon === 'warning' && <AlertCircle size={24} color={riskColor.text} />}
                {(riskColor.icon === 'danger' || riskColor.icon === 'critical') && (
                  <AlertTriangle size={24} color={riskColor.text} />
                )}
                <Text className="text-sm font-semibold" style={{ color: riskColor.text }}>
                  {riskReport.level}
                </Text>
              </View>

              <Text className="text-4xl font-bold" style={{ color: riskColor.text }}>
                {riskReport.score}
              </Text>
              <Text className="text-xs text-center text-muted-foreground">
                Score de risco (0-100)
              </Text>
            </Card>

            {/* Top Risk Factors */}
            {topRisks.length > 0 && (
              <Card variant="outlined" className="gap-4">
                <Text className="text-sm font-semibold text-foreground">
                  Fatores de Risco Identificados
                </Text>
                <View className="gap-3">
                  {topRisks.map((factor, idx) => (
                    <View
                      key={idx}
                      className="flex-row items-start gap-3 pb-3 border-b border-border last:border-b-0 last:pb-0"
                    >
                      <View className="flex-row items-center gap-2 flex-1">
                        <AlertTriangle size={16} color="#f97316" />
                        <Text className="text-sm font-medium text-foreground flex-1">
                          {factor.name}
                        </Text>
                      </View>
                      <Badge size="sm" variant="warning" label={`+${factor.score}`} />
                    </View>
                  ))}
                </View>

                {riskReport.level === 'Alto' || riskReport.level === 'Crítico' ? (
                  <View className="bg-destructive/10 p-3 rounded-lg gap-2 mt-2">
                    <Text className="text-xs font-semibold text-destructive">
                      ⚠️ Recomendação Importante
                    </Text>
                    <Text className="text-xs text-destructive/80">
                      {riskReport.level === 'Crítico'
                        ? 'Este projeto apresenta riscos críticos. Revise cuidadosamente os termos de contrato e prazo antes de prosseguir.'
                        : 'Este projeto apresenta riscos moderados. Considere revisar o escopo, prazo ou condições comerciais.'}
                    </Text>
                  </View>
                ) : null}
              </Card>
            )}

            <Card
              variant="outlined"
              className="gap-4 border-warning/50 bg-warning/5 flex-row items-start"
            >
              <View className="pt-0.5">
                <AlertCircle size={20} color="rgb(202, 138, 4)" />
              </View>
              <View className="flex-1 gap-2">
                <Text className="text-sm font-semibold text-amber-900">
                  Cálculo Completo no Backend
                </Text>
                <Text className="text-sm text-amber-800 leading-5">
                  Ao prosseguir, o servidor calculará a estimativa com maior precisão:
                </Text>
                <Text className="text-xs text-amber-700 leading-4 mt-2">
                  • Preços mínimo, recomendado e máximo
                  {'\n'}• Confiança da estimativa
                  {'\n'}• Breakdown detalhado de custos
                </Text>
              </View>
            </Card>

            <View className="gap-3 pt-1">
              <Button size="md" label="Prosseguir para revisão" onPress={handleContinue} />
              <Button size="md" variant="ghost" label="Voltar e editar" onPress={goBack} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
