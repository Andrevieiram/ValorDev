import { Text, View, ScrollView } from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Card, Select, SegmentedControl } from '@/components/ui';
import { Globe, Sun } from 'lucide-react-native';
import { useSettingsStore } from '@/store';

const themeOptions = [
  { label: 'Claro', value: 'light' },
  { label: 'Escuro', value: 'dark' },
  { label: 'Sistema', value: 'system' },
];

const currencyOptions = [
  { label: 'BRL (R$)', value: 'BRL' },
  { label: 'USD ($)', value: 'USD' },
  { label: 'EUR (€)', value: 'EUR' },
];

const languageOptions = [
  { label: 'Português', value: 'pt' },
  { label: 'English', value: 'en' },
  { label: 'Español', value: 'es' },
];

export default function SettingsScreen() {
  const { theme, setTheme, currency, setCurrency, language, setLanguage } = useSettingsStore();

  return (
    <ScreenContainer maxWidth="simple">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="gap-6 pb-8">
          <View className="gap-2">
            <Text className="text-2xl text-foreground" style={{ fontFamily: 'Inter_700Bold' }}>
              Configurações
            </Text>
            <Text className="text-sm leading-6 text-muted-foreground">
              Personalize as preferências visuais, de localização e unidade monetária do app.
            </Text>
          </View>

          {/* Theme Customization Section */}
          <Card variant="outlined" className="gap-4">
            <View className="gap-1">
              <View className="flex-row items-center gap-2">
                <Sun size={18} className="text-primary" />
                <Text className="text-sm text-foreground" style={{ fontFamily: 'Inter_700Bold' }}>
                  Tema do Aplicativo
                </Text>
              </View>
              <Text className="text-xs text-muted-foreground">
                Escolha entre as aparências claro, escuro ou automático do dispositivo.
              </Text>
            </View>
            <SegmentedControl
              options={themeOptions}
              value={theme}
              onChange={(val) => setTheme(val as any)}
            />
          </Card>

          {/* Localization Customization Section */}
          <Card variant="outlined" className="gap-4">
            <View className="gap-1">
              <View className="flex-row items-center gap-2">
                <Globe size={18} className="text-primary" />
                <Text className="text-sm text-foreground" style={{ fontFamily: 'Inter_700Bold' }}>
                  Localização e Padrões
                </Text>
              </View>
              <Text className="text-xs text-muted-foreground">
                Defina o idioma padrão dos textos de auxílio e a moeda das propostas.
              </Text>
            </View>

            <View className="gap-4 pt-2">
              <Select
                label="Unidade Monetária"
                placeholder="Selecione a moeda..."
                value={currency}
                options={currencyOptions}
                onValueChange={(val) => setCurrency(val as any)}
              />

              <Select
                label="Idioma do App"
                placeholder="Selecione o idioma..."
                value={language}
                options={languageOptions}
                onValueChange={(val) => setLanguage(val as any)}
              />
            </View>
          </Card>

          {/* About details */}
          <View className="pt-4 items-center justify-center gap-1">
            <Text className="text-xs text-muted-foreground text-center">
              ValorDev Premium • Versão 1.0.0
            </Text>
            <Text className="text-[10px] text-slate-400 text-center">
              Desenvolvido com Expo & NativeWind
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
