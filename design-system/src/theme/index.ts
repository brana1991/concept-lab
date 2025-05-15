import { Tuple } from '@mantine/core';
import { MantineThemeColors, MantineThemeOverride } from '@mantine/core';

import * as helpers from './helpers/';
import {
  appearanceTokens,
  BorderTokens,
  breakpoints,
  BreakpointTokens,
  CardTokens,
  cardTokens,
  colorAliases,
  ColorKeys,
  colorTokens,
  DurationTokens,
  FontSizeTokens,
  FontWeightTokens,
  getColor,
  LetterSpacingTokens,
  LineHeightTokens,
  MenuTokens,
  menuTokens,
  ModalTokens,
  modalTokens,
  OpacityTokens,
  ShadowTokens,
  SpacingTokens,
  spacingTokens,
  TimingFunctionTokens,
  TransitionAnimations,
  typography,
  typographyTokens,
  ZindexTokens,
} from './tokens/index';
import { TextInputVariantParams, Variants, variants } from './variants';

const theme: MantineThemeOverride = {
  ...typography,
  ...colorAliases,
  colors: colorTokens as unknown as MantineThemeColors,
  breakpoints,

  other: {
    variants,
    spacing: spacingTokens,
    ...typographyTokens,
    ...appearanceTokens,
    cardTokens,
    menuTokens,
    modalTokens,

    helpers: {
      getColor,
      ...helpers,
    },
  },
};

type Helpers = {
  getColor: typeof getColor;
  resolveTransition: typeof helpers.resolveTransition;
} & typeof helpers;

declare module '@mantine/core' {
  export interface MantineThemeColorsOverride {
    colors: Record<ColorKeys, Tuple<string, 10>>;
  }

  export interface MantineThemeOther {
    fontSize: FontSizeTokens;
    fontWeight: FontWeightTokens;
    letterSpacing: LetterSpacingTokens;
    lineHeight: LineHeightTokens;
    variants: Variants;
    spacing: SpacingTokens;
    opacity: OpacityTokens;
    zIndex: ZindexTokens;
    border: BorderTokens;
    shadow: ShadowTokens;
    duration: DurationTokens;
    timingFunction: TimingFunctionTokens;
    helpers: Helpers;
    cardTokens: CardTokens;
    menuTokens: MenuTokens;
    modalTokens: ModalTokens;
  }
}

export type TextVariants = keyof Variants['text'];
export type TextInputVariants = keyof Variants['textInput'];
export type FontWeight = keyof FontWeightTokens;
export type Border = keyof BorderTokens;
export type Spacing = keyof SpacingTokens;
export type ButtonVariants = keyof Variants['button'];
export type DrillDownItemVariants = keyof Variants['drillDownItem'];
export type Breakpoints = keyof BreakpointTokens;
export type ModalVariants = keyof Variants['modal'];
export type LinkVariants = keyof Variants['link'];
export type AccordionVariants = keyof Variants['accordion'];
export type CarouselIndicatorsVariants = keyof Variants['carousel']['indicators'];
export type CarouselNavigationVariants = keyof Variants['carousel']['navigation'];
export type DividerVariants = keyof Variants['divider'];
export type ContainerVariants = keyof Variants['container'];
export type Transitions = keyof TransitionAnimations;
export type ProductCardVariants = keyof Variants['cards']['product'];
export type ActionIconVariants = keyof Variants['actionIcon'];
export type IconVariants = keyof Variants['icon'];

export type { CardTokens, ColorKeys, TextInputVariantParams };
export * from './helpers';

export default theme;
