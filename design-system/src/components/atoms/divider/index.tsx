import { Divider as MantineDivider, DividerProps } from '@mantine/core';
import { DividerVariants } from '../../../theme';

import { ModifyMantineProps } from '../../shared-types';
import { withDefaultProps, withForwardRef } from '../../shared-utils';
import useStyle from './divider.styles';
import { createPolymorphicComponent } from '@mantine/utils';

type DividerComponentProps = {
  variant?: DividerVariants;
  type?: 'solid';
  size?: number;
};

type AnanasDividerProps = ModifyMantineProps<
  DividerProps,
  DividerComponentProps,
  'size' | 'variant'
>;

function Divider(props: AnanasDividerProps) {
  const { _ref, variant, className, type, ...otherProps } = props;
  const { cx, classes } = useStyle({ variant }, { name: 'Divider' });

  return (
    <MantineDivider
      ref={_ref}
      className={cx(className, classes?.root)}
      variant={type}
      {...otherProps}
    />
  );
}

const B1 = withDefaultProps<AnanasDividerProps>(Divider);
const B2 = withForwardRef<Parameters<typeof B1>[0]>(B1);

export default createPolymorphicComponent<'hr', Parameters<typeof B2>[0]>(B2);
