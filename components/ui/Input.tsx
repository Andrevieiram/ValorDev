import { forwardRef } from 'react';
import {
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';

import { Label, Caption } from './Typography';

import { cn } from '@/utils';
import { useTheme } from '@/theme';

export interface InputProps extends TextInputProps {
  label?: string;
  helper?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  labelClassName?: string;
  helperClassName?: string;
  containerClassName?: string;
  inputClassName?: string;
}

export const Input = forwardRef<TextInput, InputProps>(function Input(
  {
    label,
    helper,
    error,
    leftIcon,
    labelClassName,
    helperClassName,
    containerClassName,
    inputClassName,
    className,
    ...props
  },
  ref,
) {
  const { colors } = useTheme();

  return (
    <View className={cn('gap-2', containerClassName)}>
      {label ? <Label className={labelClassName}>{label}</Label> : null}

      <View className="relative">
        {leftIcon ? (
          <View className="absolute left-4 top-0 bottom-0 z-10 justify-center">
            {leftIcon}
          </View>
        ) : null}

        <TextInput
          ref={ref}
          placeholderTextColor="#94a3b8"
          className={cn(
            'w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 px-4 py-3.5 text-sm text-slate-900 dark:text-slate-100 hover:border-slate-300 dark:hover:border-slate-600 focus:border-primary dark:focus:border-primary',
            leftIcon && 'pl-12',
            error && 'border-destructive dark:border-destructive',
            inputClassName,
            className,
          )}
          style={{ fontFamily: 'Inter_400Regular' }}
          {...props}
        />
      </View>

      {error ? (
        <Caption className="text-destructive font-medium">{error}</Caption>
      ) : helper ? (
        <Caption className={helperClassName}>{helper}</Caption>
      ) : null}
    </View>
  );
});
