/**
 * Feature wizard — lógica de domínio e telas serão adicionadas na próxima fase.
 * Estrutura preparada para: schemas (zod), calculatePricing, hooks de formulário.
 */
export const WIZARD_FEATURE = 'wizard' as const;

export { WizardIntroScreen } from './screens/WizardIntroScreen';
export { WizardProfileScreen } from './screens/WizardProfileScreen';
export { WizardProjectScreen } from './screens/WizardProjectScreen';
export { WizardClientScreen } from './screens/WizardClientScreen';
export { WizardAdjustmentsScreen } from './screens/WizardAdjustmentsScreen';
export { WizardRiskScreen } from './screens/WizardRiskScreen';
