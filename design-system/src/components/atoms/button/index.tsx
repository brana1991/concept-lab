import { Button as MantineButton, ButtonProps as MantineButtonProps } from '@mantine/core';
import { createPolymorphicComponent } from '@mantine/utils';

import { ModifyMantineProps } from '../../shared-types';
import { withDefaultProps, withForwardRef } from '../../shared-utils';
import useStyles, { UseButtonStyleProps } from './button.styles';

export type ButtonProps = ModifyMantineProps<
  MantineButtonProps,
  UseButtonStyleProps,
  'compact' | 'gradient' | 'radius' | 'color' | 'loaderPosition' | 'loaderProps'
>;

const Button = (props: ButtonProps) => {
  const { className, _ref, variant, width, breakpoints, ...mantineUtilityProps } = props;

  const { classes, cx } = useStyles({ variant, width, breakpoints }, { name: 'Button' });

  return (
    <div>
      <MantineButton ref={_ref} className={cx(classes.root, className)} {...mantineUtilityProps} />
    </div>
  );
};

Button.displayName = 'Button';

const B1 = withDefaultProps<ButtonProps>(Button);
const B2 = withForwardRef<Parameters<typeof B1>[0]>(B1);

export default createPolymorphicComponent<'button', Parameters<typeof B2>[0]>(B2);
