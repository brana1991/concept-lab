import { createStyles } from '@mantine/core';
import { useMemo } from 'react';
import { Border, Breakpoints, ColorKeys } from '../../../../theme';

import { LiteralUnion } from '../flex.styles';

interface BreakpointConfig {
  breakpoint: Breakpoints;
  width?: React.CSSProperties['width'];
  order?: React.CSSProperties['order'];
  flex?: React.CSSProperties['flex'];
  border?: React.CSSProperties['border'];
  borderRadius?: Border;
  background?: LiteralUnion<ColorKeys>;
}
export type UseFlexItemStyleProps = {
  width?: React.CSSProperties['width'];
  breakpoints?: BreakpointConfig[];
  flex?: React.CSSProperties['flex'];
  order?: React.CSSProperties['order'];
  background?: LiteralUnion<ColorKeys>;
  border?: React.CSSProperties['border'];
  borderRadius?: Border;
};

export default createStyles(
  (
    theme,
    {
      width,
      flex,
      order,
      background,
      border,
      borderRadius,
      breakpoints = [],
    }: UseFlexItemStyleProps,
  ) => {
    const responsiveStyles = useMemo(() => {
      const sortedBreakpoints = theme.other.helpers.getSortedBreakpoints<BreakpointConfig>(
        theme,
        breakpoints,
      );

      return sortedBreakpoints.reduce((acc, item) => {
        acc[`@media (min-width: ${item.breakpoint}px)`] = {
          width: item.width,
          flexBasis: item.width,
          order: item.order,
          flex: item.flex,
          border: item.border,
          background: theme.other.helpers.getBackgroundValue(item.background),
          borderRadius: theme.other.border[item.borderRadius],
        };

        return acc;
      }, {});
    }, [breakpoints, theme]);

    return {
      root: {
        width: width,
        minWidth: 0,
        flexBasis: width,
        flex: flex,
        order: order,
        background: theme.other.helpers.getBackgroundValue(background),
        border: border,
        borderRadius: theme.other.border[borderRadius],
        ...responsiveStyles,
      },
    };
  },
);
