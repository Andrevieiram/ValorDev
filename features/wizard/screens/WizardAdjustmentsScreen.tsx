import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button, Select, Switch } from '@/components/ui';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { WizardProgress } from '@/components/wizard/WizardProgress';
import { useWizardNavigation } from '@/hooks';
import { useWizardStore } from '@/store';
import {
  BILLING_METHOD_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  INSTALLMENT_OPTIONS,
  PAYMENT_TERM_OPTIONS,
  DOWN_PAYMENT_OPTIONS,
  WIZARD_ADJUSTMENTS_SCHEMA,
  type WizardAdjustmentsFormValues,
} from '../schema';

export function WizardAdjustmentsScreen() {
  const { goToRisk, goBack } = useWizardNavigation();
  const adjustments = useWizardStore((state) => state.adjustments);
  const setAdjustments = useWizardStore((state) => state.setAdjustments);
  const persistDraft = useWizardStore((state) => state.persistDraft);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<WizardAdjustmentsFormValues>({
    mode: 'onBlur',
    resolver: zodResolver(WIZARD_ADJUSTMENTS_SCHEMA),
    defaultValues: {
      billingMethod: (adjustments.billingMethod as any) || 'fixed',
      paymentMethod: (adjustments.paymentMethod as any) || 'pix',
      installmentOption: (adjustments.installmentOption as any) || 'oneTime',
      paymentTerm: (adjustments.paymentTerm as any) || 'thirtyDays',
      downPayment: (adjustments.downPayment as any) || 'none',
      recurringBilling: adjustments.recurringBilling || 'no',
      formalContract: adjustments.formalContract || 'yes',
    },
  });

  const handleSaveAdjustments = async (values: WizardAdjustmentsFormValues) => {
    setAdjustments(values);
    await persistDraft();
    goToRisk();
  };

  return (
    <ScreenContainer maxWidth="wizard">
      <WizardProgress current={3} />
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: 'height' })}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 24}
      >
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          <View className="gap-6 pb-8">
            <View className="gap-2">
              <Text className="text-2xl font-bold text-foreground dark:text-white">
                Ajustes comerciais
              </Text>
              <Text className="text-sm leading-6 text-muted-foreground">
                Escolha a modalidade de faturamento, forma de recebimento e prazos.
              </Text>
            </View>

            {/* Billing and Method Selection */}
            <View className="gap-4 rounded-3xl border border-border dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/20 p-5">
              <Controller
                control={control}
                name="billingMethod"
                render={({ field }) => (
                  <Select
                    label="Forma de cobrança"
                    placeholder="Selecione a forma..."
                    value={field.value}
                    options={BILLING_METHOD_OPTIONS}
                    onValueChange={field.onChange}
                    error={errors.billingMethod?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="paymentMethod"
                render={({ field }) => (
                  <Select
                    label="Meio de pagamento principal"
                    placeholder="Selecione o meio..."
                    value={field.value}
                    options={PAYMENT_METHOD_OPTIONS}
                    onValueChange={field.onChange}
                    error={errors.paymentMethod?.message}
                  />
                )}
              />
            </View>

            {/* Installments & Terms Selection */}
            <View className="gap-4 rounded-3xl border border-border dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/20 p-5">
              <Controller
                control={control}
                name="installmentOption"
                render={({ field }) => (
                  <Select
                    label="Opção de parcelamento"
                    placeholder="Selecione o parcelamento..."
                    value={field.value}
                    options={INSTALLMENT_OPTIONS}
                    onValueChange={field.onChange}
                    error={errors.installmentOption?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="paymentTerm"
                render={({ field }) => (
                  <Select
                    label="Prazo de recebimento"
                    placeholder="Selecione o prazo..."
                    value={field.value}
                    options={PAYMENT_TERM_OPTIONS}
                    onValueChange={field.onChange}
                    error={errors.paymentTerm?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="downPayment"
                render={({ field }) => (
                  <Select
                    label="Sinal / Entrada na assinatura"
                    placeholder="Selecione a entrada..."
                    value={field.value}
                    options={DOWN_PAYMENT_OPTIONS}
                    onValueChange={field.onChange}
                    error={errors.downPayment?.message}
                  />
                )}
              />
            </View>

            {/* Documentations and Recurrency */}
            <View className="gap-4 rounded-3xl border border-border dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/20 p-5">
              <Controller
                control={control}
                name="formalContract"
                render={({ field }) => (
                  <Switch
                    value={field.value === 'yes'}
                    onValueChange={(val) => field.onChange(val ? 'yes' : 'no')}
                    label="Assinar contrato formal de prestação"
                  />
                )}
              />

              <Controller
                control={control}
                name="recurringBilling"
                render={({ field }) => (
                  <Switch
                    value={field.value === 'yes'}
                    onValueChange={(val) => field.onChange(val ? 'yes' : 'no')}
                    label="Faturamento recorrente ativado"
                  />
                )}
              />
            </View>

            {/* Navigation Actions */}
            <View className="gap-3 pt-2">
              <Button
                size="md"
                label="Ver revisão"
                onPress={handleSubmit(handleSaveAdjustments)}
                isLoading={isSubmitting}
              />
              <Button size="md" variant="ghost" label="Voltar" onPress={goBack} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
