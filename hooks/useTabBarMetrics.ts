import { useSafeAreaInsets } from "react-native-safe-area-context";

export function useTabBarMetrics() {
    const insets = useSafeAreaInsets();

    const TAB_BAR_INNER_HEIGHT = 60;

    return {
        TAB_BAR_INNER_HEIGHT,
        occupiedHeight: TAB_BAR_INNER_HEIGHT + insets.bottom,

        tabBarStyle: {
            paddingTop: 8,

            paddingBottom: Math.max(insets.bottom, 10),

            height: TAB_BAR_INNER_HEIGHT + insets.bottom,
        },
    };
}
