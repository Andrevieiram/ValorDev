import React from 'react';
import { View, Platform } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

/**
 * AmbientBackground
 * 
 * Componente que adiciona os 'Glow Nodes' ao fundo da tela, replicando o visual do AURA/NOVA.
 * Estes nós desfocados (blur) e pulsantes criam profundidade.
 * Recomendado uso apenas em grandes telas ou web para máxima performance,
 * mas renderizado levemente via CSS/NativeWind no mobile.
 */
export function AmbientBackground() {
  // O blur pesado via CSS é excelente na web. No mobile nativo usaremos apenas opacidade reduzida 
  // para evitar queda de frame drop no Android.
  const blurClass = Platform.OS === 'web' ? 'blur-[90px]' : 'blur-3xl';

  return (
    <View className="absolute inset-0 overflow-hidden pointer-events-none z-[-1]" aria-hidden={true}>
      <Animated.View 
        entering={FadeIn.duration(2000)}
        className={`absolute -top-40 left-1/4 w-[500px] h-[500px] bg-primary/10 dark:bg-primary/20 rounded-full animate-pulse ${blurClass}`} 
      />
      
      <Animated.View 
        entering={FadeIn.delay(500).duration(2000)}
        className={`absolute top-1/3 -right-1/4 w-[400px] h-[400px] bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full ${blurClass}`}
        style={{ animationDelay: '2s' } as any}
      />
    </View>
  );
}
