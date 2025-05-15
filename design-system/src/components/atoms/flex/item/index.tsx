import { Box, BoxProps, createPolymorphicComponent } from '@mantine/core';

import { ModifyMantineProps } from '../../../shared-types';
import { withDefaultProps, withForwardRef } from '../../../shared-utils';
import useStyles, { UseFlexItemStyleProps } from './item.styles';

type AnanasFlexItemProps = ModifyMantineProps<BoxProps, UseFlexItemStyleProps>;

const FlexItem = (props: AnanasFlexItemProps) => {
  const {
    className,
    width,
    flex,
    order,
    breakpoints,
    background,
    border,
    borderRadius,
    ...others
  } = props;
  const { classes, cx } = useStyles(
    { width, breakpoints, flex, order, background, border, borderRadius },
    { name: 'AnanasFlexItem' },
  );

  return <Box className={cx(classes.root, className)} {...others} />;
};

const F1 = withDefaultProps<AnanasFlexItemProps>(FlexItem);
const F2 = withForwardRef<Parameters<typeof F1>[0]>(F1);

export default createPolymorphicComponent<'div', Parameters<typeof F2>[0]>(F2);
