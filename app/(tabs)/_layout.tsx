import { Tabs } from "expo-router";
import { Clock, Home, User } from "lucide-react-native";

import { TAB_BAR_INNER_HEIGHT } from "@/constants/layout";
import { useTabBarMetrics } from "@/hooks";
import { useTheme } from "@/theme";

export default function TabLayout() {
    const { colors } = useTheme();
    const { tabBarStyle } = useTabBarMetrics();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,

                sceneStyle: {
                    backgroundColor: "#f8fafc",
                },

                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textMuted,

                tabBarStyle: {
                    ...tabBarStyle,

                    backgroundColor: "#ffffff",

                    borderTopWidth: 1,
                    borderTopColor: "#e5e7eb",

                    elevation: 8,

                    shadowColor: "#000",
                    shadowOpacity: 0.04,
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
