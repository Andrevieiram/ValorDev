export const ROUTES = {
    home: "/(tabs)",
<<<<<<< HEAD:mobile/constants/routes.ts
    history: "/(tabs)/history",
    profile: "/(tabs)/profile",
=======
    history: "/history",
    profile: "/profile",
    dashboard: "/dashboard",
    setupProfile: "/setup-profile",
>>>>>>> 066b9274ae9ab4cd8513a16eb933b545f1194f3a:constants/routes.ts
    settings: "/settings",
    wizard: {
        intro: "/wizard",
        profile: "/wizard/profile",
        project: "/wizard/project",
        client: "/wizard/client",
        adjustments: "/wizard/adjustments",
        risk: "/wizard/risk",
        review: "/wizard/review",
    },
    result: "/result",
} as const;
