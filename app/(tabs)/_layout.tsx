import { Tabs } from "expo-router";
import { Clock, Home, User } from "lucide-react-native";

import { TAB_BAR_INNER_HEIGHT } from "@/constants/layout";
import { useTabBarMetrics } from "@/hooks";
import { useTheme } from "@/theme";

export default function TabLayout() {
    const { colors, theme } = useTheme();
    const { tabBarStyle } = useTabBarMetrics();

    const isDark = theme === "dark";

    const tabBarBg = isDark ? "#0f172a" : "#ffffff";
    const tabBarBorder = isDark ? "#1e293b" : "#e5e7eb";
    const sceneBg = isDark ? "#04060a" : "#f8fafc";

    return (
        <Tabs
            screenOptions={{
                headerShown: false,

                sceneStyle: {
                    backgroundColor: sceneBg,
                },

                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: isDark ? "#64748b" : "#94a3b8",

                tabBarStyle: {
                    ...tabBarStyle,

                    backgroundColor: tabBarBg,

                    borderTopWidth: 1,
                    borderTopColor: tabBarBorder,

                    elevation: 8,

                    shadowColor: "#000",
                    shadowOpacity: isDark ? 0.3 : 0.04,
                    shadowRadius: 8,
                    shadowOffset: {
                        width: 0,
                        height: -2,
                    },
                },

                tabBarItemStyle: {
                    height: TAB_BAR_INNER_HEIGHT,
                },

                tabBarLabelStyle: {
                    fontFamily: "Inter_500Medium",
                    fontSize: 12,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: "Histórico",
                    tabBarIcon: ({ color, size }) => <Clock color={color} size={size} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Perfil",
                    tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
                }}
            />
        </Tabs>
    );
}
