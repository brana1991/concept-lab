import { createStyles, CSSObject, getSortedBreakpoints, MantineTheme } from '@mantine/core';
import { Breakpoints, ButtonVariants } from '../../../theme';

interface BreakpointConfig {
  width: string;
  breakpoint: Breakpoints;
}

const applyResponsiveStyles = (theme: MantineTheme, breakpoints: BreakpointConfig[]): CSSObject => {
  if (!breakpoints?.length) return {};

  const screens = getSortedBreakpoints(theme, breakpoints).reverse();
  const styles = screens.reduce<Record<string, CSSObject>>((accumulator, item) => {
    accumulator[theme.fn.largerThan(item.breakpoint)] = {
      width: item.width,
    };

    return accumulator;
  }, {} as Record<string, CSSObject>);

  return styles;
};

export type UseButtonStyleProps = {
  id?: string;
  width?: string;
  variant?: ButtonVariants;
  breakpoints?: BreakpointConfig[];
};

export default createStyles(
  (theme, { variant = 'primary', breakpoints = [], width }: UseButtonStyleProps) => {
    return {
      root: {
        ...theme.other.variants.button[variant].root,
        ...theme.other.helpers.applyOptionalStyle('width', width),
        ...applyResponsiveStyles(theme, breakpoints),
      },
    };
  },
);
