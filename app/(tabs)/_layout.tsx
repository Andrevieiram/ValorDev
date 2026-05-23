import { Slot, Tabs, usePathname, useRouter } from "expo-router";
import { Clock, Home, User } from "lucide-react-native";
import { Platform, Pressable, Text, View } from "react-native";

import { TAB_BAR_INNER_HEIGHT } from "@/constants/layout";
import { useTabBarMetrics } from "@/hooks";
import { useTheme } from "@/theme";

const WEB_TABS = [
    { name: "index", title: "Home", href: "/(tabs)", path: "/", icon: Home },
    { name: "history", title: "Histórico", href: "/(tabs)/history", path: "/history", icon: Clock },
    { name: "profile", title: "Perfil", href: "/(tabs)/profile", path: "/profile", icon: User },
] as const;

export default function TabLayout() {
    const { colors } = useTheme();
    const { tabBarStyle } = useTabBarMetrics();
    const pathname = usePathname();
    const router = useRouter();

    if (Platform.OS === "web") {
        return (
            <View style={{ flex: 1, backgroundColor: colors.background }}>
                <View
                    style={
                        {
                            position: "sticky",
                            top: 0,
                            zIndex: 20,
                            width: "100%",
                            backgroundColor: colors.background,
                            borderBottomWidth: 1,
                            borderBottomColor: colors.border,
                        } as any
                    }
                >
                    <View
                        style={{
                            width: "100%",
                            maxWidth: 1100,
                            marginHorizontal: "auto",
                            paddingHorizontal: 24,
                            paddingVertical: 10,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 16,
                        }}
                    >
                        <Text
                            style={{
                                color: colors.foreground,
                                fontFamily: "Inter_700Bold",
                                fontSize: 16,
                            }}
                        >
                            ValorDev
                        </Text>

                        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                            {WEB_TABS.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.path;
                                const color = isActive ? colors.primary : colors.textMuted;

                                return (
                                    <Pressable
                                        key={item.name}
                                        onPress={() => router.replace(item.href as any)}
                                        style={{
                                            flexDirection: "row",
                                            alignItems: "center",
                                            gap: 8,
                                            borderRadius: 12,
                                            paddingHorizontal: 14,
                                            paddingVertical: 10,
                                            backgroundColor: isActive
                                                ? colors.muted
                                                : "transparent",
                                        }}
                                    >
                                        <Icon color={color} size={18} />
                                        <Text
                                            style={{
                                                color,
                                                fontFamily: isActive
                                                    ? "Inter_600SemiBold"
                                                    : "Inter_500Medium",
                                                fontSize: 13,
                                            }}
                                        >
                                            {item.title}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>
                </View>

                <Slot />
            </View>
        );
    }

    return (
        <Tabs
            screenOptions={{
                headerShown: false,

                sceneStyle: {
                    backgroundColor: colors.background,
                },

                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textMuted,

                tabBarStyle: {
                    ...tabBarStyle,

                    backgroundColor: colors.background,

                    borderTopWidth: 1,
                    borderTopColor: colors.border,

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
