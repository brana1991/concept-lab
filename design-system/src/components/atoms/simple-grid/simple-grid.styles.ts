import { createStyles } from '@mantine/core';
import { useMemo } from 'react';
import { Breakpoints, getSortedBreakpoints } from '../../../theme';

interface SimpleGridBreakpointConfig {
  breakpoint: Breakpoints;
  cols?: number;
  gap?: React.CSSProperties['gap'];
}

export type UseSimpleGridStyleProps = {
  cols?: number;
  gap?: React.CSSProperties['gap'];
  breakpoints?: SimpleGridBreakpointConfig[];
};

export default createStyles(
  (theme, { cols = 1, gap = 16, breakpoints = [] }: UseSimpleGridStyleProps) => {
    const responsiveStyles = useMemo(() => {
      const sortedBreakpoints = getSortedBreakpoints<SimpleGridBreakpointConfig>(
        theme,
        breakpoints,
      );

      return sortedBreakpoints.reduce((acc: { [key: string]: React.CSSProperties }, item) => {
        acc[`@media (min-width: ${item.breakpoint}px)`] = {
          gridTemplateColumns: `repeat(${item.cols}, minmax(0px, 1fr))`,
          gap: item.gap,
        };

        return acc;
      }, {});
    }, [breakpoints, theme]);

    return {
      root: {
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, minmax(0px, 1fr))`,
        gap: gap,
        ...responsiveStyles,
      },
    };
  },
);
