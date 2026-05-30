import { apiClient } from './client';
import type { ProposalDto, DashboardSummaryDto } from './types';
import type { WizardFormData } from '@/types/pricing.types';

export const proposalsApi = {
  // Lista todas as propostas do usuário logado
  list: (): Promise<ProposalDto[]> => {
    return apiClient.get<ProposalDto[]>('/proposals');
  },

  // Busca uma proposta por ID
  getById: (id: string): Promise<ProposalDto> => {
    return apiClient.get<ProposalDto>(`/proposals/${id}`);
  },

  // Cria uma nova proposta (O backend executa os cálculos)
  create: (data: WizardFormData): Promise<ProposalDto> => {
    // Transforma o formato de WizardFormData do frontend para um payload flat
    // ou o backend recebe como DTO aninhado. Assumindo DTO mais flat:
    const payload = {
      name: 'Projeto sem nome', // Pode ser adicionado no wizard depois
      ...data.project,
      ...data.client,
      ...data.adjustments,
    };
    return apiClient.post<ProposalDto>('/proposals', payload);
  },

  // Deleta uma proposta
  delete: (id: string): Promise<void> => {
    return apiClient.delete<void>(`/proposals/${id}`);
  },

  // Endpoint do dashboard
  getDashboardSummary: (): Promise<DashboardSummaryDto> => {
    return apiClient.get<DashboardSummaryDto>('/dashboard/summary');
  },

  // Calcula pricing e risco a partir dos dados do wizard
  calculate: (data: WizardFormData): Promise<any> => {
    const payload = {
      // Project
      projectType: data.project.projectType,
      complexity: data.project.complexity,
      deadline: data.project.deadline,
      scopeDocumented: data.project.scopeDocumented,
      maintenance: data.project.maintenance || false,
      meetingsFrequency: data.project.meetingsFrequency,
      externalDependencies: data.project.externalDependencies,
      reuseComponents: data.project.reuseComponents || false,
      estimatedHours: parseInt(String(data.project.estimatedHours)) || 0,

      // Client
      clientType: data.client.clientType || 'individual',
      digitalExperience: data.client.digitalExperience,
      recurringClient: data.client.recurringClient,
      location: data.client.location || 'national',
      businessImpact: data.client.businessImpact,

      // Adjustments
      billingMethod: data.adjustments.billingMethod,
      paymentMethod: data.adjustments.paymentMethod,
      paymentTerm: data.adjustments.paymentTerm,
      downPayment: data.adjustments.downPayment,
      formalContract: data.adjustments.formalContract === 'yes' ? true : false,
    };
    return apiClient.post<any>('/proposals/calculate', payload);
  },
};
