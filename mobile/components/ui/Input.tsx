import { forwardRef } from 'react';
import {
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';

import { cn } from '@/utils';

export interface InputProps extends TextInputProps {
  label?: string;
  helper?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  containerClassName?: string;
  inputClassName?: string;
}

export const Input = forwardRef<TextInput, InputProps>(function Input(
  {
    label,
    helper,
    error,
    leftIcon,
    containerClassName,
    inputClassName,
    className,
    ...props
  },
  ref,
) {
  return (
    <View className={cn('gap-2', containerClassName)}>
      {label ? (
        <Text className="text-sm font-medium text-foreground">{label}</Text>
      ) : null}

      <View className="relative">
        {leftIcon ? (
          <View className="absolute left-4 top-0 bottom-0 z-10 justify-center">
            {leftIcon}
          </View>
        ) : null}

        <TextInput
          ref={ref}
          placeholderTextColor="#71717a"
          className={cn(
            'w-full rounded-xl border border-input bg-muted px-4 py-3 text-base text-foreground',
            leftIcon && 'pl-12',
            error && 'border-destructive',
            inputClassName,
            className,
          )}
          {...props}
        />
      </View>

      {error ? (
        <Text className="text-sm text-destructive">{error}</Text>
      ) : helper ? (
        <Text className="text-sm text-muted-foreground">{helper}</Text>
      ) : null}
    </View>
  );
});
