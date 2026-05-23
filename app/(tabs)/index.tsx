import { AnimatedSection } from '@/components/layout/AnimatedSection';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Text, View } from 'react-native';
import {
  HomeHeader,
  HomeTipCard,
  NewCalculationCard,
  RecentCalculationsSection,
  useHomeScreen,
} from '@/features/home';

export default function HomeScreen() {
  const {
    userName,
    recentItems,
    startNewCalculation,
    goToHistory,
    profileModalVisible,
    confirmGoToProfile,
    closeProfileModal,
  } = useHomeScreen();

  return (
    <ScreenContainer maxWidth="container">
      <AnimatedSection delay={0}>
        <HomeHeader userName={userName} />
      </AnimatedSection>

      <AnimatedSection delay={80}>
        <NewCalculationCard onPress={startNewCalculation} />
      </AnimatedSection>

      <AnimatedSection delay={160}>
        <RecentCalculationsSection
          items={recentItems}
          onSeeAll={goToHistory}
          onItemPress={goToHistory}
        />
      </AnimatedSection>

      <AnimatedSection delay={240}>
        <HomeTipCard />
      </AnimatedSection>

      <Modal
        visible={profileModalVisible}
        onClose={closeProfileModal}
        title="Configuração Necessária"
      >
        <Text
          style={{
            color: '#94a3b8',
            fontFamily: 'Inter_400Regular',
            fontSize: 14,
            lineHeight: 22,
          }}
        >
          Para gerar orçamentos precisos, precisamos conhecer seus custos e rotina de trabalho. Demora apenas 1 minuto!
        </Text>

        <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
          <Button
            variant="ghost"
            size="md"
            label="Agora não"
            onPress={closeProfileModal}
            className="flex-1"
          />
          <Button
            variant="primary"
            size="md"
            label="Configurar agora"
            onPress={confirmGoToProfile}
            className="flex-1"
          />
        </View>
      </Modal>
    </ScreenContainer>
  );
}
