import React from 'react';
import Animated, { FadeInDown, FadeInUp, ZoomIn, SlideInRight } from 'react-native-reanimated';
import { ViewProps } from 'react-native';

interface MotionProps extends ViewProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export function MotionFadeUp({ children, delay = 0, duration = 600, className, ...props }: MotionProps) {
  return (
    <Animated.View entering={FadeInUp.delay(delay).duration(duration).springify()} className={className} {...props}>
      {children}
    </Animated.View>
  );
}

export function MotionFadeDown({ children, delay = 0, duration = 600, className, ...props }: MotionProps) {
  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(duration).springify()} className={className} {...props}>
      {children}
    </Animated.View>
  );
}

export function MotionZoomIn({ children, delay = 0, duration = 600, className, ...props }: MotionProps) {
  return (
    <Animated.View entering={ZoomIn.delay(delay).duration(duration).springify()} className={className} {...props}>
      {children}
    </Animated.View>
  );
}

export function MotionSlideRight({ children, delay = 0, duration = 600, className, ...props }: MotionProps) {
  return (
    <Animated.View entering={SlideInRight.delay(delay).duration(duration).springify()} className={className} {...props}>
      {children}
    </Animated.View>
  );
}
