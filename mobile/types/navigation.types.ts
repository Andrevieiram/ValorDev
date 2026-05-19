import type { Href } from "expo-router";

export type TabRoute = "/(tabs)" | "/(tabs)/history" | "/(tabs)/profile";

export type WizardRoute =
    | "/wizard"
    | "/wizard/profile"
    | "/wizard/project"
    | "/wizard/client"
    | "/wizard/adjustments"
    | "/wizard/risk"
    | "/wizard/review";

export type AppRoute = TabRoute | WizardRoute | "/result" | "/settings";

export type RouteHref = Href;
