import { createStyles } from '@mantine/core';
import { forwardRef } from 'react';

import { DefaultComponentProps, SpacingProps } from './shared-types';

const createSpacingStyles = createStyles(
  (theme, { mb, mt, pb, pt, ml, mr, pl, pr, p, m }: SpacingProps) => ({
    rootSpacing: {
      marginTop: theme.other.spacing[mt],
      paddingTop: theme.other.spacing[pt],
      marginBottom: theme.other.spacing[mb],
      paddingBottom: theme.other.spacing[pb],

      marginLeft: ml,
      marginRight: mr,
      paddingLeft: pl,
      paddingRight: pr,
      margin: m,
      padding: p,
    },
  }),
);

export function withForwardRef<T>(Component) {
  return forwardRef((props: T & { _ref?: any }, ref) => {
    return <Component {...props} _ref={ref} />;
  });
}

type DefaultProps = DefaultComponentProps & { className?: string };
export function withDefaultProps<T>(Component) {
  return function ({ className, ...props }: T & DefaultProps) {
    const { mt, mb, ml, mr, pb, pt, pl, pr, ...restProps } = props;
    const { classes, cx } = createSpacingStyles({ mt, mb, ml, mr, pb, pt, pl, pr });

    return <Component {...restProps} className={cx(classes.rootSpacing, className)} />;
  };
}
