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
};
