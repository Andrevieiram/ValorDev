import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TAB_BAR_INNER_HEIGHT } from "@/constants/layout";

export function useTabBarMetrics() {
    const insets = useSafeAreaInsets();

    return {
        TAB_BAR_INNER_HEIGHT,
        occupiedHeight: TAB_BAR_INNER_HEIGHT + insets.bottom,

        // Removido tabBarStyle fixo daqui pois ele quebrava a área de toque nativa do React Navigation
    };
}
