import { Box, BoxProps } from '@mantine/core';
import { createPolymorphicComponent } from '@mantine/utils';

import { ModifyMantineProps } from '../../shared-types';
import { withDefaultProps, withForwardRef } from '../../shared-utils';
import useStyles, { UseFlexStyleProps } from './flex.styles';

export type AnanasFlexProps = ModifyMantineProps<BoxProps, UseFlexStyleProps>;

const Flex = (props: AnanasFlexProps) => {
  const {
    className,
    gap,
    justify,
    align,
    flow,
    _ref,
    flex,
    breakpoints,
    background,
    border,
    borderRadius,
    ...others
  } = props;
  const { classes, cx } = useStyles(
    { gap, justify, align, flow, flex, breakpoints, background, border, borderRadius },
    { name: 'Flex' },
  );

  return <Box ref={_ref} className={cx(classes.root, className)} {...others} />;
};

const F1 = withDefaultProps<AnanasFlexProps>(Flex);
const F2 = withForwardRef<Parameters<typeof F1>[0]>(F1);

export default createPolymorphicComponent<'div', Parameters<typeof F2>[0]>(F2);
