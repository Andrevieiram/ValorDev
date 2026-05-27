export const ROUTES = {
    home: "/(tabs)",
    history: "/history",
    profile: "/profile",
    dashboard: "/dashboard",
    setupProfile: "/setup-profile",
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
