export const ROUTES = {
    home: "/(tabs)",
    history: "/(tabs)/history",
    profile: "/(tabs)/profile",
    setupProfile: "/setup-profile",
    settings: "/settings",
    wizard: {
        intro: "/wizard",
        project: "/wizard/project",
        client: "/wizard/client",
        adjustments: "/wizard/adjustments",
        risk: "/wizard/risk",
        review: "/wizard/review",
    },
    result: "/result",
} as const;
