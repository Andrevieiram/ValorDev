import { calculatePricingResult } from './index';
import type {
  ProfileData,
  ProjectData,
  ClientData,
  AdjustmentsData,
  RiskReport,
} from '@/types';

describe('calculatePricingResult', () => {
  const mockProfile: ProfileData = {
    desiredIncome: '5000',
    hoursPerWeek: '40',
    experienceLevel: 'senior',
    taxRegime: 'simples',
    mainStack: 'fullstack',
    workload: 'normal',
    monthlyCosts: '1000',
    financialReserve: '3000',
  };

  const mockProject: ProjectData = {
    projectType: 'webapp',
    complexity: 'high',
    deadline: '4 semanas',
    scopeDocumented: true,
    maintenance: false,
    meetingsFrequency: 'semanal',
    externalDependencies: '',
    reuseComponents: false,
    toolsUsed: 'React, Node.js',
    estimatedHours: '100',
  };

  const mockClient: ClientData = {
    clientType: 'business',
    digitalExperience: 'experienced',
    recurringClient: 'no',
    businessImpact: 'high',
    location: 'nacional',
  };

  const mockAdjustments: AdjustmentsData = {
    paymentMethod: 'pix',
    paymentTerm: 'thirtyDays',
    downPayment: 'tenPercent',
    formalContract: 'yes',
  };

  const mockRisk: RiskReport = {
    score: 30,
    level: 'low',
    factors: [],
    recommendation: 'Safe project',
  };

  it('deve calcular preço com fórmula RF-006', () => {
    const result = calculatePricingResult(
      mockProfile,
      mockProject,
      mockClient,
      mockAdjustments,
      mockRisk,
    );

    // Valor-hora base = (5000 + 1000 + 3000) / (40 * 4.33) = 9000 / 173.2 ≈ 51.96
    // Com fullstack (1.30x): 51.96 * 1.30 ≈ 67.55
    // Preço base = 67.55 * 100 ≈ 6755 (mínimo 3000)
    // O resultado final depende dos multiplicadores

    expect(result.minimum).toBeGreaterThan(3000);
    expect(result.recommended).toBeGreaterThan(result.minimum);
    expect(result.premium).toBeGreaterThan(result.recommended);
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(100);
  });

  it('deve aplicar multiplicadores de especialidade corretamente', () => {
    const devopsProfile = { ...mockProfile, mainStack: 'devops' };
    const result = calculatePricingResult(
      devopsProfile,
      mockProject,
      mockClient,
      mockAdjustments,
      mockRisk,
    );

    // DevOps tem multiplicador 1.40, maior que fullstack (1.30)
    // Então o preço deve ser maior
    const resultFullstack = calculatePricingResult(
      mockProfile,
      mockProject,
      mockClient,
      mockAdjustments,
      mockRisk,
    );

    expect(result.recommended).toBeGreaterThan(resultFullstack.recommended);
  });

  it('deve respeitar limite mínimo de R$ 3.000', () => {
    const lowProfile: ProfileData = {
      ...mockProfile,
      desiredIncome: '500',
      hoursPerWeek: '20',
    };

    const result = calculatePricingResult(
      lowProfile,
      mockProject,
      mockClient,
      mockAdjustments,
      mockRisk,
    );

    expect(result.minimum).toBeGreaterThanOrEqual(3000);
  });

  it('deve aumentar confiança com contrato formal', () => {
    const withContract = calculatePricingResult(
      mockProfile,
      mockProject,
      mockClient,
      { ...mockAdjustments, formalContract: 'yes' },
      mockRisk,
    );

    const withoutContract = calculatePricingResult(
      mockProfile,
      mockProject,
      mockClient,
      { ...mockAdjustments, formalContract: 'no' },
      mockRisk,
    );

    expect(withContract.confidence).toBeGreaterThan(withoutContract.confidence);
  });

  it('deve gerar alertas para alto risco', () => {
    const highRisk: RiskReport = {
      score: 75,
      level: 'high',
      factors: [],
      recommendation: 'Risky project',
    };

    const result = calculatePricingResult(
      mockProfile,
      mockProject,
      mockClient,
      mockAdjustments,
      highRisk,
    );

    expect(result.alerts.length).toBeGreaterThan(0);
    expect(result.alerts.some((a) => a.type === 'warning')).toBe(true);
  });

  it('deve incluir breakdown items', () => {
    const result = calculatePricingResult(
      mockProfile,
      mockProject,
      mockClient,
      mockAdjustments,
      mockRisk,
    );

    expect(result.breakdown.length).toBeGreaterThan(0);
    expect(result.breakdown.some((item) => item.label.includes('Valor Base'))).toBe(true);
  });
});
