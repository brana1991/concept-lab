import { createStyles } from '@mantine/core';
import { useMemo } from 'react';
import { Border, Breakpoints, ColorKeys } from '../../../theme';

export type LiteralUnion<T extends U, U = string> = T | (U & { ignore?: never });

interface BreakpointConfig {
  gap?: React.CSSProperties['gap'];
  align?: React.CSSProperties['alignContent'];
  justify?: React.CSSProperties['justifyContent'];
  flow?: React.CSSProperties['flexFlow'];
  background?: LiteralUnion<ColorKeys>;
  border?: React.CSSProperties['border'];
  borderRadius?: Border;
  breakpoint: Breakpoints;
}

export type UseFlexStyleProps = {
  gap?: React.CSSProperties['gap'];
  align?: React.CSSProperties['alignContent'];
  justify?: React.CSSProperties['justifyContent'];
  flow?: React.CSSProperties['flexFlow'];
  flex?: React.CSSProperties['flex'];
  background?: LiteralUnion<ColorKeys>;
  border?: React.CSSProperties['border'];
  borderRadius?: Border;
  breakpoints?: BreakpointConfig[];
};

export default createStyles(
  (
    theme,
    {
      gap = 16,
      justify,
      align,
      breakpoints = [],
      flow,
      flex,
      background,
      border,
      borderRadius,
    }: UseFlexStyleProps,
  ) => {
    const responsiveStyles = useMemo(() => {
      const sortedBreakpoints = theme.other.helpers.getSortedBreakpoints<BreakpointConfig>(
        theme,
        breakpoints,
      );

      return sortedBreakpoints.reduce((acc, item) => {
        acc[`@media (min-width: ${item.breakpoint}px)`] = {
          flexFlow: item.flow,
          gap: item.gap,
          alignItems: item.align,
          justifyContent: item.justify,
          border: item.border,
          background: theme.other.helpers.getBackgroundValue(item.background),
          borderRadius: theme.other.border[item.borderRadius],
        };

        return acc;
      }, {});
    }, [breakpoints, theme]);

    return {
      root: {
        display: 'flex',
        flexFlow: flow,
        gap: gap,
        alignItems: align,
        justifyContent: justify,
        background: theme.other.helpers.getBackgroundValue(background),
        border: border,
        borderRadius: theme.other.border[borderRadius],
        flex: flex,
        ...responsiveStyles,
      },
    };
  },
);
