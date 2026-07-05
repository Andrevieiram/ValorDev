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

export interface ProposalItemDto {
  id: string;
  name: string;
  value: number;
  status: HistoryStatus;
  probability: Probability;
}

export interface DashboardCategoryDto {
  count: number;
  value: number;
  items: ProposalItemDto[];
}

export interface DashboardSummaryDto {
  monthlyGoal: number;
  pipeline: {
    totalValue: number;
    breakdown: {
      fechada: DashboardCategoryDto;
      alta: DashboardCategoryDto;
      media: DashboardCategoryDto;
      baixa: DashboardCategoryDto;
      perdida: DashboardCategoryDto;
    };
  };
}

export interface CalculatePricingResponse {
  minimumPrice: number;
  recommendedPrice: number;
  premiumPrice: number;
  confidence: number;
  riskScore: number;
  riskLevel: string;
  riskRecommendation: string;
  breakdown: { label: string; value: number }[];
  riskFactors: { name: string; score: number }[];
}
