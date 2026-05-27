import type {
  ProfileData,
  ProjectData,
  ClientData,
  AdjustmentsData,
  PricingResult,
  Probability,
  HistoryStatus,
} from '@/types/pricing.types';

export interface AuthResponse {
  userId: string;
  name: string;
  email: string;
  token: string;
}

export interface UserProfileDto extends ProfileData {
  userId: string;
}

export interface ProposalDto {
  id: string;
  userId: string;
  clientId?: string;
  name: string;

  // Inputs
  projectType: string;
  complexity: string;
  deadline: string;
  scopeDocumented: boolean;
  maintenance: boolean;
  meetingsFrequency: string;
  externalDependencies: string;
  reuseComponents: boolean;
  estimatedHours: number;
  billingMethod: string;
  paymentMethod: string;
  paymentTerm: string;
  downPayment: string;
  formalContract: boolean;

  // Results
  minimumPrice: number;
  recommendedPrice: number;
  premiumPrice: number;
  confidence: number;
  riskScore: number;
  riskLevel: string;
  probability: Probability;
  status: HistoryStatus;

  createdAt: string;
}

export interface DashboardSummaryDto {
  monthlyGoal: number;
  pipeline: {
    totalValue: number;
    breakdown: {
      fechada: { count: number; value: number };
      alta: { count: number; value: number };
      media: { count: number; value: number };
      baixa: { count: number; value: number };
      perdida: { count: number; value: number };
    };
  };
}
