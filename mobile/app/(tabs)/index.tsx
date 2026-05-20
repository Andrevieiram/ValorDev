import { AnimatedSection } from '@/components/layout/AnimatedSection';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import {
  HomeHeader,
  HomeTipCard,
  NewCalculationCard,
  RecentCalculationsSection,
  useHomeScreen,
} from '@/features/home';

export default function HomeScreen() {
  const { userName, recentItems, startNewCalculation, goToHistory } = useHomeScreen();

  return (
    <ScreenContainer>
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
    </ScreenContainer>
  );
}
