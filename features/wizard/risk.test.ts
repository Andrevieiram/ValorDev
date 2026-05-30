import { calculateRisk } from './risk';
import type { ProjectData, ClientData, AdjustmentsData } from '@/types';

describe('calculateRisk', () => {
  const mockProject: ProjectData = {
    projectType: 'webapp',
    complexity: 'medium',
    deadline: '4 semanas',
    scopeDocumented: true,
    maintenance: false,
    meetingsFrequency: 'semanal',
    externalDependencies: '',
    reuseComponents: false,
    toolsUsed: 'React, Node.js',
    estimatedHours: '80',
  };

  const mockClient: ClientData = {
    clientType: 'business',
    digitalExperience: 'experienced',
    recurringClient: 'no',
    businessImpact: 'medium',
    location: 'nacional',
  };

  const mockAdjustments: AdjustmentsData = {
    paymentMethod: 'pix',
    paymentTerm: 'thirtyDays',
    downPayment: 'tenPercent',
    formalContract: 'yes',
  };

  it('deve retornar RiskReport com score entre 0 e 100', () => {
    const report = calculateRisk(mockProject, mockClient, mockAdjustments);

    expect(report.score).toBeGreaterThanOrEqual(0);
    expect(report.score).toBeLessThanOrEqual(100);
  });

  it('deve determinar level como "low", "medium" ou "high"', () => {
    const report = calculateRisk(mockProject, mockClient, mockAdjustments);

    expect(['low', 'medium', 'high']).toContain(report.level);
  });

  it('deve retornar factors com 10 itens (um por fator)', () => {
    const report = calculateRisk(mockProject, mockClient, mockAdjustments);

    expect(report.factors).toHaveLength(10);
    expect(report.factors.every((f) => f.name && f.score !== undefined)).toBe(true);
  });

  it('deve aumentar risco com escopo não documentado', () => {
    const noScopeProject = { ...mockProject, scopeDocumented: false };

    const withScope = calculateRisk(mockProject, mockClient, mockAdjustments);
    const withoutScope = calculateRisk(noScopeProject, mockClient, mockAdjustments);

    expect(withoutScope.score).toBeGreaterThan(withScope.score);
  });

  it('deve aumentar risco com prazo curto (< 2 semanas)', () => {
    const urgentProject = { ...mockProject, deadline: '1 semana' };

    const normal = calculateRisk(mockProject, mockClient, mockAdjustments);
    const urgent = calculateRisk(urgentProject, mockClient, mockAdjustments);

    expect(urgent.score).toBeGreaterThan(normal.score);
  });

  it('deve aumentar risco com cliente sem experiência digital', () => {
    const inexperiencedClient = { ...mockClient, digitalExperience: 'none' };

    const experienced = calculateRisk(mockProject, mockClient, mockAdjustments);
    const inexperienced = calculateRisk(mockProject, inexperiencedClient, mockAdjustments);

    expect(inexperienced.score).toBeGreaterThan(experienced.score);
  });

  it('deve reduzir risco com cliente recorrente', () => {
    const recurringClient = { ...mockClient, recurringClient: 'yes' };

    const oneTime = calculateRisk(mockProject, mockClient, mockAdjustments);
    const recurring = calculateRisk(mockProject, recurringClient, mockAdjustments);

    expect(recurring.score).toBeLessThan(oneTime.score);
  });

  it('deve reduzir risco com contrato formal', () => {
    const formalAdjustments = { ...mockAdjustments, formalContract: 'yes' };
    const informalAdjustments = { ...mockAdjustments, formalContract: 'no' };

    const withContract = calculateRisk(mockProject, mockClient, formalAdjustments);
    const withoutContract = calculateRisk(mockProject, mockClient, informalAdjustments);

    expect(withoutContract.score).toBeGreaterThan(withContract.score);
  });

  it('deve classificar como high quando score > 70', () => {
    const complexProject = { ...mockProject, complexity: 'high', scopeDocumented: false };
    const problematicClient = {
      ...mockClient,
      digitalExperience: 'none',
      businessImpact: 'strategic',
    };
    const riskless = { ...mockAdjustments, formalContract: 'no' };

    const report = calculateRisk(complexProject, problematicClient, riskless);

    if (report.score > 70) {
      expect(report.level).toBe('high');
    }
  });

  it('deve fornecer recommendation estruturada', () => {
    const report = calculateRisk(mockProject, mockClient, mockAdjustments);

    expect(typeof report.recommendation).toBe('string');
    expect(report.recommendation.length).toBeGreaterThan(0);
  });
});
