import {
  ActionIcon as MantineActionIcon,
  ActionIconProps as MantineActionIconProps,
} from '@mantine/core';
import { createPolymorphicComponent } from '@mantine/utils';

import { ModifyMantineProps } from '../../shared-types';
import { withDefaultProps, withForwardRef } from '../../shared-utils';
import useStyles, { ActionIconProps } from './action-icon.styles';

type AnanasActionIconProps = ModifyMantineProps<MantineActionIconProps, ActionIconProps, 'radius'>;

let ActionIcon = (props: AnanasActionIconProps) => {
  const { className, _ref, variant, color, hoverColor, ...otherProps } = props;

  const { classes, cx } = useStyles({ variant, color, hoverColor }, { name: 'ActionIcon' });

  return <MantineActionIcon ref={_ref} className={cx(classes.root, className)} {...otherProps} />;
};



const B1 = withDefaultProps<AnanasActionIconProps>(ActionIcon);
const B2 = withForwardRef<Parameters<typeof B1>[0]>(B1);

ActionIcon = createPolymorphicComponent<'button', Parameters<typeof B2>[0]>(B2);

export default ActionIcon
