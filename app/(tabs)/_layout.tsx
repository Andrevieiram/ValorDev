import { Slot, Tabs, usePathname, useRouter } from "expo-router";
import { Clock, Home, User, PieChart } from "lucide-react-native";
import { Platform, Pressable, Text, View } from "react-native";

import { TAB_BAR_INNER_HEIGHT } from "@/constants/layout";
import { useTabBarMetrics } from "@/hooks";
import { useTheme } from "@/theme";

const WEB_TABS = [
    { name: "index", title: "Home", href: "/", path: "/", icon: Home },
    { name: "dashboard", title: "Dashboard", href: "/dashboard", path: "/dashboard", icon: PieChart },
    { name: "history", title: "Histórico", href: "/history", path: "/history", icon: Clock },
    { name: "profile", title: "Perfil", href: "/profile", path: "/profile", icon: User },
] as const;

export default function TabLayout() {
    const { colors, theme } = useTheme();
    const { tabBarStyle } = useTabBarMetrics();
    const pathname = usePathname();
    const router = useRouter();

    // A mesma tab bar nativa (rodapé) será usada em todas as plataformas (incluindo Web responsivo e Monitor)
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

                tabBarLabelPosition: 'below-icon', // Força o texto embaixo do ícone mesmo em telas grandes na web

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
                    ...(Platform.OS === 'web' && {
                        height: 70, // O container principal com altura generosa
                        paddingBottom: 10,
                        paddingTop: 6,
                    })
                },

                tabBarLabelStyle: {
                    fontFamily: "Inter_500Medium",
                    fontSize: 12,
                    ...(Platform.OS === 'web' && {
                        marginTop: 2,
                    })
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
                name="dashboard"
                options={{
                    title: "Dashboard",
                    tabBarIcon: ({ color, size }) => <PieChart color={color} size={size} />,
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
