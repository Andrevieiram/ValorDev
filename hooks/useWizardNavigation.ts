import { useRouter } from "expo-router";

import { ROUTES, WIZARD_STEPS } from "@/constants";

type WizardStepKey = (typeof WIZARD_STEPS)[number]["key"];
const wizardStepKeys = WIZARD_STEPS.map((step) => step.key) as WizardStepKey[];

export function useWizardNavigation() {
    const router = useRouter();

    const goToNextStep = (currentStepKey: WizardStepKey | "intro") => {
        if (currentStepKey === "intro") {
            return router.push(ROUTES.wizard.project);
        }

        const currentIndex = wizardStepKeys.indexOf(currentStepKey);
        const nextStep = WIZARD_STEPS[currentIndex + 1];

        if (nextStep) {
            return router.push(nextStep.route);
        }

        return router.push(ROUTES.result);
    };

    return {
        goToIntro: () => router.push(ROUTES.wizard.intro),
        goToProfile: () => router.push(ROUTES.setupProfile),
        goToProject: () => router.push(ROUTES.wizard.project),
        goToClient: () => router.push(ROUTES.wizard.client),
        goToAdjustments: () => router.push(ROUTES.wizard.adjustments),
        goToRisk: () => router.push(ROUTES.wizard.risk),
        goToReview: () => router.push(ROUTES.wizard.review),
        goToResult: () => router.push(ROUTES.result),
        goToNextStep,
        goHome: () => router.replace(ROUTES.home),
        goBack: () => router.back(),
    };
}
