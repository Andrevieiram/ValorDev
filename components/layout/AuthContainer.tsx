import React from "react";
import { View, KeyboardAvoidingView, Platform, ScrollView, ImageBackground } from "react-native";
import { Card } from "@/components/ui/Card";
import { MotionFadeUp } from "@/components/ui";

export interface AuthContainerProps {
  children: React.ReactNode;
}

export function AuthContainer({ children }: AuthContainerProps) {
  const isWeb = Platform.OS === "web";

  return (
    <ImageBackground
      source={require("@/assets/fundo_page.png")}
      className="flex-1"
      style={isWeb ? { width: '100vw', minHeight: '100vh' } : {}}
      resizeMode={isWeb ? "cover" : "stretch"}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 24,
          }}
          className="flex-1"
          keyboardShouldPersistTaps="handled"
        >
          {isWeb ? (
            <MotionFadeUp delay={100} className="w-full max-w-[440px] my-8">
              <Card
                variant="glass"
                className="p-8 border border-white/10 shadow-2xl rounded-3xl bg-slate-900/70 dark:bg-slate-900/80"
              >
                {children}
              </Card>
            </MotionFadeUp>
          ) : (
            <MotionFadeUp delay={100} className="w-full">
                {children}
            </MotionFadeUp>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
