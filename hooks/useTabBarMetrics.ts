import { useSafeAreaInsets } from "react-native-safe-area-context";

export function useTabBarMetrics() {
    const insets = useSafeAreaInsets();

    const TAB_BAR_INNER_HEIGHT = 60;

    return {
        TAB_BAR_INNER_HEIGHT: 60,
        occupiedHeight: 60 + insets.bottom,

        tabBarStyle: {
            paddingTop: 8,
            // Removido height fixo e paddingBottom calculado que quebravam o hit slop dos botões.
            // O próprio React Navigation cuida das safe areas automaticamente no mobile!
        },
    };
}
