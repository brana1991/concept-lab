import { Box as MantineBox, BoxProps } from '@mantine/core';
import { createPolymorphicComponent } from '@mantine/utils';
import { ModifyMantineProps } from '../../shared-types';
import { withDefaultProps, withForwardRef } from '../../shared-utils';

export type AnanasBoxProps = ModifyMantineProps<BoxProps, unknown>;

const Box = (props: AnanasBoxProps) => {
  const { _ref, ...otherProps } = props;

  return <MantineBox ref={_ref} {...otherProps} />;
};

Box.displayName = 'Box';

const B1 = withDefaultProps<AnanasBoxProps>(Box);
const B2 = withForwardRef<Parameters<typeof B1>[0]>(B1);

export default createPolymorphicComponent<'div', Parameters<typeof B2>[0]>(B2);
