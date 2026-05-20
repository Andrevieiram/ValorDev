export const WIZARD_STEPS = [
    { id: 1, key: "project", title: "Projeto", route: "/wizard/project" },
    { id: 2, key: "client", title: "Cliente e riscos", route: "/wizard/client" },
    { id: 3, key: "adjustments", title: "Ajustes", route: "/wizard/adjustments" },
    { id: 4, key: "risk", title: "Mapa de risco", route: "/wizard/risk" },
    { id: 5, key: "review", title: "Revisão", route: "/wizard/review" },
] as const;

export const WIZARD_TOTAL_STEPS = WIZARD_STEPS.length;

export const STORAGE_KEYS = {
    onboardingSeen: "@pricing-pro/onboarding-seen",
    wizardDraft: "@pricing-pro/wizard-draft",
    history: "@pricing-pro/history",
    settings: "@pricing-pro/settings",
} as const;
