import { createPolymorphicComponent } from '@mantine/core';

import { ModifyMantineProps } from '../../shared-types';
import { withDefaultProps, withForwardRef } from '../../shared-utils';
import Box, { AnanasBoxProps } from '../box';
import useStyles, { UseSimpleGridStyleProps } from './simple-grid.styles';

export type AnanasSimpleGridProps = ModifyMantineProps<AnanasBoxProps, UseSimpleGridStyleProps>;

const SimpleGrid = (props: AnanasSimpleGridProps) => {
  const { className, cols, gap, breakpoints, ...others } = props;
  const { classes, cx } = useStyles({ cols, gap, breakpoints }, { name: 'SimpleGrid' });

  return <Box className={cx(classes.root, className)} {...others} />;
};

const G1 = withDefaultProps<AnanasSimpleGridProps>(SimpleGrid);
const G2 = withForwardRef<Parameters<typeof G1>[0]>(G1);

export default createPolymorphicComponent<'div', Parameters<typeof G2>[0]>(G2);
