import { MantineStyleSystemProps } from '@mantine/core';

import { Spacing } from '../theme';

type ExcludedComponentProps = 'size' | 'variant' | 'radius' | keyof MantineStyleSystemProps;

export interface SpacingProps {
  mb?: Spacing;
  mt?: Spacing;
  pb?: Spacing;
  pt?: Spacing;
  ml?: string;
  mr?: string;
  pl?: string;
  pr?: string;
  m?: string;
  p?: string;
}

export type DefaultComponentProps = SpacingProps;

export type ModifyMantineProps<
  T,
  Override = Record<string, never>,
  Exclude extends keyof T = undefined,
> = Omit<T, keyof Override | ExcludedComponentProps | Exclude> & Override & { _ref?: any };
