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
  create: (data: any): Promise<ProposalDto> => {
    // Pode receber tanto WizardFormData (aninhado) quanto o formato plano de ResultScreen
    const project = data.project || data;
    const client = data.client || data;
    const adjustments = data.adjustments || data;

    const payload = {
      name: data.name || 'Projeto sem nome',
      
      // Project
      projectType: project.projectType,
      complexity: project.complexity,
      deadline: project.deadline,
      scopeDocumented: !!project.scopeDocumented,
      maintenance: !!project.maintenance,
      meetingsFrequency: project.meetingsFrequency,
      externalDependencies: project.externalDependencies || 'none',
      reuseComponents: !!project.reuseComponents,
      estimatedHours: parseInt(String(project.estimatedHours), 10) || 0,
      toolsUsed: project.toolsUsed || 'standard',

      // Client
      clientName: client.clientName || 'Cliente Padrão',
      clientType: client.clientType || 'business',
      digitalExperience: client.digitalExperience,
      recurringClient: client.recurringClient,
      location: client.location || 'national',
      businessImpact: client.businessImpact,

      // Adjustments
      billingMethod: adjustments.billingMethod,
      paymentMethod: adjustments.paymentMethod,
      installmentOption: adjustments.installmentOption || 'oneTime',
      paymentTerm: adjustments.paymentTerm,
      downPayment: adjustments.downPayment,
      recurringBilling: adjustments.recurringBilling || 'no',
      formalContract: adjustments.formalContract === 'yes' || adjustments.formalContract === true,
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
