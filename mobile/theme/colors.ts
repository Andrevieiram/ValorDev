export const colors = {
  background: '#ffffff',
  foreground: '#18181b',
  card: '#ffffff',
  primary: '#2563eb',
  primaryForeground: '#ffffff',
  secondary: '#f4f4f5',
  secondaryForeground: '#18181b',
  muted: '#f4f4f5',
  mutedForeground: '#71717a',
  destructive: '#ef4444',
  success: '#10b981',
  successLight: '#d1fae5',
  warning: '#f59e0b',
  warningLight: '#fef3c7',
  info: '#3b82f6',
  infoLight: '#dbeafe',
  border: '#e4e4e7',
  input: '#e4e4e7',
  ring: '#2563eb',
} as const;

export type ColorToken = keyof typeof colors;
