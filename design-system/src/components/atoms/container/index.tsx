import { createPolymorphicComponent } from '@mantine/core';

import Box, { AnanasBoxProps } from '../box';
import { ModifyMantineProps } from '../../shared-types';
import { withDefaultProps, withForwardRef } from '../../shared-utils';
import useStyles, { UseContainerStyleProps } from './container.styles';

type ContainerProps = ModifyMantineProps<AnanasBoxProps, UseContainerStyleProps>;

const Container = (props: ContainerProps) => {
  const { className, variant, ...others } = props;
  const { classes, cx } = useStyles({ variant });

  return <Box className={cx(classes.root, className)} {...others} />;
};

Container.displayName = 'Container';

const C1 = withDefaultProps<ContainerProps>(Container);
const C2 = withForwardRef<Parameters<typeof C1>[0]>(C1);

export default createPolymorphicComponent<'section', Parameters<typeof C2>[0]>(C2);
