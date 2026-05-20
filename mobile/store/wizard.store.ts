import { create } from "zustand";

import { STORAGE_KEYS } from "@/constants";
import type {
    AdjustmentsData,
    ClientData,
    PricingResult,
    ProfileData,
    ProjectData,
    RiskReport,
} from "@/types";
import { loadJson, persistJson, removePersisted } from "./persistence";

const emptyProfile: ProfileData = {
    desiredIncome: "",
    hoursPerWeek: "",
    experienceLevel: "",
    mainStack: "",
    monthlyCosts: "",
    financialReserve: "",
};

const emptyProject: ProjectData = {
    projectType: "",
    complexity: "",
    deadline: "",
    scopeDocumented: false,
    isUrgent: "",
    meetings: "",
    maintenance: "",
};

const emptyClient: ClientData = {
    clientType: "",
    digitalExperience: "",
    recurringClient: "",
    location: "",
    businessImpact: "",
};

const emptyAdjustments: AdjustmentsData = {
    billingMethod: "fixed",
    installmentOption: "oneTime",
    paymentTerm: "thirtyDays",
    downPayment: "none",
    recurringBilling: "no",
    formalContract: "yes",
};

interface WizardState {
    profile: ProfileData;
    project: ProjectData;
    client: ClientData;
    adjustments: AdjustmentsData;
    result: PricingResult | null;
    riskReport: RiskReport | null;
    isHydrated: boolean;

    setProfile: (data: Partial<ProfileData>) => void;
    setProject: (data: Partial<ProjectData>) => void;
    setClient: (data: Partial<ClientData>) => void;
    setAdjustments: (data: Partial<AdjustmentsData>) => void;
    setRiskReport: (report: RiskReport | null) => void;
    setResult: (result: PricingResult | null) => void;
    resetWizard: () => void;
    hydrateFromStorage: () => Promise<void>;
    persistDraft: () => Promise<void>;
    clearDraft: () => Promise<void>;
}

type WizardDraft = Pick<
    WizardState,
    "profile" | "project" | "client" | "adjustments" | "riskReport"
>;

export const useWizardStore = create<WizardState>((set, get) => ({
    profile: emptyProfile,
    project: emptyProject,
    client: emptyClient,
    adjustments: emptyAdjustments,
    result: null,
    riskReport: null,
    isHydrated: false,

    setProfile: (data) => set((state) => ({ profile: { ...state.profile, ...data } })),

    setProject: (data) => set((state) => ({ project: { ...state.project, ...data } })),

    setClient: (data) => set((state) => ({ client: { ...state.client, ...data } })),

    setAdjustments: (data) => set((state) => ({ adjustments: { ...state.adjustments, ...data } })),

    setRiskReport: (report) => set({ riskReport: report }),

    setResult: (result) => set({ result }),

    resetWizard: () =>
        set({
            profile: emptyProfile,
            project: emptyProject,
            client: emptyClient,
            adjustments: emptyAdjustments,
            riskReport: null,
            result: null,
        }),

    hydrateFromStorage: async () => {
        const draft = await loadJson<WizardDraft>(STORAGE_KEYS.wizardDraft);
        if (draft) {
            set({
                profile: draft.profile ?? emptyProfile,
                project: draft.project ?? emptyProject,
                client: draft.client ?? emptyClient,
                adjustments: draft.adjustments ?? emptyAdjustments,
                riskReport: draft.riskReport ?? null,
                isHydrated: true,
            });
            return;
        }
        set({ isHydrated: true });
    },

    persistDraft: async () => {
        const { profile, project, client, adjustments, riskReport } = get();
        await persistJson<WizardDraft>(STORAGE_KEYS.wizardDraft, {
            profile,
            project,
            client,
            adjustments,
            riskReport,
        });
    },

    clearDraft: async () => {
        await removePersisted(STORAGE_KEYS.wizardDraft);
    },
}));
