/**
 * Componentes de tipografia com fontFamily global.
 *
 * No React Native, <Text> não herda fontFamily do pai.
 * Estes componentes são o equivalente do CSS global:
 *
 *   body { font-family: 'Inter', sans-serif; }
 *   h1, h2, h3 { font-family: 'Inter', sans-serif; font-weight: 800; }
 *   code, pre { font-family: 'JetBrains Mono', monospace; }
 *
 * Use <AppText> em vez de <Text> para ter a fonte correta automaticamente.
 * Use <Heading> para títulos com tamanho e peso pré-definidos.
 * Use <MonoText> para texto monospace (valores, código, etc.)
 */
import React from 'react';
import { Text as RNText, type TextProps, type TextStyle } from 'react-native';
import { cn } from '@/utils';

// ────────────────────────────────────────────────────
// Mapa de fontFamily por peso — necessário no RN porque
// cada peso é uma fonte separada (Inter_400Regular, etc.)
// ────────────────────────────────────────────────────
const INTER_WEIGHT_MAP: Record<string, string> = {
  '100': 'Inter_100Thin',
  '200': 'Inter_200ExtraLight',
  '300': 'Inter_300Light',
  '400': 'Inter_400Regular',
  '500': 'Inter_500Medium',
  '600': 'Inter_600SemiBold',
  '700': 'Inter_700Bold',
  '800': 'Inter_800ExtraBold',
  '900': 'Inter_900Black',
  thin: 'Inter_100Thin',
  extralight: 'Inter_200ExtraLight',
  light: 'Inter_300Light',
  normal: 'Inter_400Regular',
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extrabold: 'Inter_800ExtraBold',
  black: 'Inter_900Black',
};

const JETBRAINS_WEIGHT_MAP: Record<string, string> = {
  '400': 'JetBrainsMono_400Regular',
  '500': 'JetBrainsMono_500Medium',
  '600': 'JetBrainsMono_600SemiBold',
  '700': 'JetBrainsMono_700Bold',
  normal: 'JetBrainsMono_400Regular',
  regular: 'JetBrainsMono_400Regular',
  medium: 'JetBrainsMono_500Medium',
  semibold: 'JetBrainsMono_600SemiBold',
  bold: 'JetBrainsMono_700Bold',
};

// ────────────────────────────────────────────────────
// AppText — drop-in replacement para <Text>
// Aplica Inter_400Regular por padrão.
// ────────────────────────────────────────────────────
export interface AppTextProps extends TextProps {
  /** Peso da fonte: '400', 'bold', 'semibold', etc. */
  weight?: string;
  className?: string;
}

export function AppText({ weight = '400', style, className, ...props }: AppTextProps) {
  const fontFamily = INTER_WEIGHT_MAP[weight] ?? 'Inter_400Regular';

  return (
    <RNText
      className={cn('text-foreground', className)}
      style={[{ fontFamily }, style as TextStyle]}
      {...props}
    />
  );
}

// ────────────────────────────────────────────────────
// Heading — títulos com tamanho pré-definido
// ────────────────────────────────────────────────────
type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5';

const HEADING_STYLES: Record<HeadingLevel, { className: string; defaultWeight: string }> = {
  h1: { className: 'text-3xl tracking-tight', defaultWeight: '800' },
  h2: { className: 'text-2xl tracking-tight', defaultWeight: '700' },
  h3: { className: 'text-xl', defaultWeight: '600' },
  h4: { className: 'text-lg', defaultWeight: '600' },
  h5: { className: 'text-base', defaultWeight: '600' },
};

export interface HeadingProps extends TextProps {
  level?: HeadingLevel;
  weight?: string;
  className?: string;
}

export function Heading({ level = 'h2', weight, style, className, ...props }: HeadingProps) {
  const config = HEADING_STYLES[level];
  const fontWeight = weight ?? config.defaultWeight;
  const fontFamily = INTER_WEIGHT_MAP[fontWeight] ?? 'Inter_700Bold';

  return (
    <RNText
      className={cn('text-foreground', config.className, className)}
      style={[{ fontFamily }, style as TextStyle]}
      {...props}
    />
  );
}

// ────────────────────────────────────────────────────
// MonoText — texto monospace (JetBrains Mono)
// ────────────────────────────────────────────────────
export interface MonoTextProps extends TextProps {
  weight?: string;
  className?: string;
}

export function MonoText({ weight = '400', style, className, ...props }: MonoTextProps) {
  const fontFamily = JETBRAINS_WEIGHT_MAP[weight] ?? 'JetBrainsMono_400Regular';

  return (
    <RNText
      className={cn('text-foreground', className)}
      style={[{ fontFamily }, style as TextStyle]}
      {...props}
    />
  );
}

// ────────────────────────────────────────────────────
// Label — texto pequeno uppercase (labels de formulário)
// ────────────────────────────────────────────────────
export interface LabelProps extends TextProps {
  className?: string;
}

export function Label({ style, className, ...props }: LabelProps) {
  return (
    <RNText
      className={cn('text-xs tracking-widest text-muted-foreground uppercase', className)}
      style={[{ fontFamily: 'Inter_600SemiBold' }, style as TextStyle]}
      {...props}
    />
  );
}

// ────────────────────────────────────────────────────
// Caption — texto muted pequeno (helpers, timestamps)
// ────────────────────────────────────────────────────
export interface CaptionProps extends TextProps {
  className?: string;
}

export function Caption({ style, className, ...props }: CaptionProps) {
  return (
    <RNText
      className={cn('text-sm text-muted-foreground leading-relaxed', className)}
      style={[{ fontFamily: 'Inter_300Light' }, style as TextStyle]}
      {...props}
    />
  );
}
