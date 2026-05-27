import { Slot, Tabs, usePathname, useRouter } from "expo-router";
import { Clock, Home, User, PieChart } from "lucide-react-native";
import { Platform, Pressable, Text, View } from "react-native";

import { useTheme } from "@/theme/ThemeContext";

const WEB_TABS = [
    { name: "index", title: "Home", href: "/", path: "/", icon: Home },
    { name: "dashboard", title: "Dashboard", href: "/dashboard", path: "/dashboard", icon: PieChart },
    { name: "history", title: "Histórico", href: "/history", path: "/history", icon: Clock },
    { name: "profile", title: "Perfil", href: "/profile", path: "/profile", icon: User },
] as const;

export default function TabLayout() {
    const themeContext = useTheme();
    const { colors, theme } = themeContext || {};
    const pathname = usePathname();
    const router = useRouter();

    // Valores padrão se o contexto não estiver inicializado
    const isDark = theme === "dark";
    const primaryColor = colors?.primary || "#2563eb";
    const tabBarBg = isDark ? "#0f172a" : "#ffffff";
    const tabBarBorder = isDark ? "#1e293b" : "#e5e7eb";
    const sceneBg = isDark ? "#04060a" : "#f8fafc";

    // --- WEB: layout próprio com navegação no topo/rodapé customizada ---
    if (Platform.OS === "web") {
        return (
            <View style={{ flex: 1, backgroundColor: sceneBg }}>
                <Slot />
                {/* Barra de navegação inferior para a Web */}
                <View
                    style={{
                        height: 70,
                        backgroundColor: tabBarBg,
                        borderTopWidth: 1,
                        borderTopColor: tabBarBorder,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-around",
                        paddingBottom: 10,
                        paddingTop: 6,
                    }}
                >
                    {WEB_TABS.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.path || (item.path === "/" && pathname === "");
                        const color = isActive ? primaryColor : (isDark ? "#64748b" : "#94a3b8");

                        return (
                            <Pressable
                                key={item.name}
                                onPress={() => router.replace(item.href as any)}
                                style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 2 }}
                            >
                                <Icon color={color} size={22} />
                                <Text
                                    style={{
                                        color,
                                        fontFamily: isActive ? "Inter_600SemiBold" : "Inter_500Medium",
                                        fontSize: 11,
                                    }}
                                >
                                    {item.title}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>
            </View>
        );
    }

    // --- MOBILE: Tab bar nativa 100% padrão, sem override de tamanho ---
    return (
        <Tabs
            screenOptions={{
                headerShown: false,

                sceneStyle: {
                    backgroundColor: sceneBg,
                },

                tabBarActiveTintColor: primaryColor,
                tabBarInactiveTintColor: isDark ? "#64748b" : "#94a3b8",

                tabBarStyle: {
                    backgroundColor: tabBarBg,
                    borderTopWidth: 1,
                    borderTopColor: tabBarBorder,
                    elevation: 8,
                    shadowColor: "#000",
                    shadowOpacity: isDark ? 0.3 : 0.04,
                    shadowRadius: 8,
                    shadowOffset: { width: 0, height: -2 },
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
