import { Platform, Pressable, View, type PressableProps, type ViewProps } from "react-native";
import { cn } from "@/utils";
import { useTheme } from "@/theme";

type CardVariant = "default" | "outlined" | "elevated" | "glass";

export interface CardProps extends ViewProps {
    variant?: CardVariant;
    onPress?: PressableProps["onPress"];
    className?: string;
    children: React.ReactNode;
}

const variantStyles: Record<CardVariant, string> = {
    default: "bg-card border border-border",
    outlined: "bg-transparent border border-border",
    elevated: "bg-card border border-border shadow-lg shadow-black/5",
    glass: "bg-blue-50/80 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-500/10 shadow-sm dark:shadow-xl dark:shadow-black/20",
};

// Cores nativas para mobile (sem CSS variables)
const nativeStyles = {
    light: {
        default: { backgroundColor: "#ffffff", borderColor: "#e2e8f0" },
        outlined: { backgroundColor: "transparent", borderColor: "#e2e8f0" },
        elevated: { backgroundColor: "#ffffff", borderColor: "#e2e8f0" },
        glass: { backgroundColor: "rgba(239,246,255,0.8)", borderColor: "#bfdbfe" },
    },
    dark: {
        default: { backgroundColor: "#0f172a", borderColor: "#1e293b" },
        outlined: { backgroundColor: "transparent", borderColor: "#1e293b" },
        elevated: { backgroundColor: "#0f172a", borderColor: "#1e293b" },
        glass: { backgroundColor: "rgba(23,37,84,0.3)", borderColor: "rgba(99,102,241,0.1)" },
    },
};

export function Card({ variant = "default", onPress, className, children, style, ...props }: CardProps) {
    const { theme } = useTheme();
    const isWeb = Platform.OS === "web";

    const base = cn(
        "rounded-2xl p-5",
        variantStyles[variant],
        className,
    );

    // Aplica cores via style prop em todas as plataformas para garantir suporte ao dark mode
    const nativeColorStyle = nativeStyles[theme][variant];

    const combinedStyle = [nativeColorStyle, style];

    if (onPress) {
        return (
            <Pressable
                onPress={onPress}
                className={cn(base, "active:scale-[0.985] active:opacity-90")}
                style={({ pressed }) => [
                    nativeColorStyle,
                    variant === "glass"
                        ? {
                              transform: [{ translateY: pressed ? 0 : -1 }],
                              shadowColor: "#3b82f6",
                              shadowOpacity: pressed ? 0.08 : 0.12,
                              shadowRadius: pressed ? 4 : 10,
                              shadowOffset: { width: 0, height: pressed ? 2 : 4 },
                              elevation: pressed ? 1 : 3,
                          }
                        : undefined,
                    style as any,
                ]}
                {...props}
            >
                {children}
            </Pressable>
        );
    }

    return (
        <View className={base} style={combinedStyle} {...props}>
            {children}
        </View>
    );
}
