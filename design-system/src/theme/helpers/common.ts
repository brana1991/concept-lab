import { CSSObject, MantineTheme } from '@mantine/core';
import { CSSProperties } from 'react';
import { ColorKeys, getColor, colorTokens } from '../tokens/colors';
import { appearanceTokens } from '../tokens/appearance';
import { durationTokens } from '../tokens/sizes';
import { BreakpointTokens } from '../tokens/breakpoints';

export const toPx = (value: number) => `${value}px`;

export const pxToRem = (value: number, rootFontSize = 16) => `${value / rootFontSize}rem`;

export function hexToRGB(colorParam: ColorKeys | string, alpha: number) {
  const color = getColor(colorParam as ColorKeys) ?? colorParam;

  const r = parseInt(color.slice(1, 3), 16),
    g = parseInt(color.slice(3, 5), 16),
    b = parseInt(color.slice(5, 7), 16);

  if (alpha) {
    return `rgba(${r},${g},${b},${alpha})`;
  }

  return `rgb(${r},${g},${b})`;
}

export const applyOptionalStyle = (key: keyof CSSObject, value: string | number): CSSObject =>
  value ? { [key]: value } : {};

export const getTransitionForProperty = (property: keyof CSSObject) =>
  `${property} ${durationTokens[300]}ms  ${appearanceTokens.timingFunction.ease}`;

type BreakpointConfig<T> = Omit<T, 'breakpoint'> & {
  breakpoint: keyof BreakpointTokens;
};

type BreakpointConfigReturnValue<T> = Omit<T, 'breakpoint'> & {
  breakpoint: number;
};

type SortOrder = 'asc' | 'desc';

export function getSortedBreakpoints<T>(
  theme: MantineTheme,
  config: Array<BreakpointConfig<T>>,
  sortOrder: SortOrder = 'asc',
): Array<BreakpointConfigReturnValue<T>> {
  const breakpoints = [...config].map((item) => ({
    ...item,
    breakpoint: theme.breakpoints[item.breakpoint],
  }));

  if (sortOrder == 'asc') return breakpoints.sort((a, b) => a.breakpoint - b.breakpoint);

  return breakpoints.sort((a, b) => b.breakpoint - a.breakpoint);
}

export function getBackgroundValue(value: CSSProperties['background']) {
  if ((value as string) in colorTokens) {
    return getColor(value as ColorKeys);
  }

  return value;
}
