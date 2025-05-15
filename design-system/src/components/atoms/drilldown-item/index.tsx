import { NavLink as MantineNavLink, NavLinkProps as MantineNavLinkProps } from '@mantine/core';
import { createPolymorphicComponent } from '@mantine/utils';

import { ModifyMantineProps } from '../../shared-types';
import { withDefaultProps, withForwardRef } from '../../shared-utils';
import useStyles, { UseDrillDownItemStyleProps } from './drilldown-item.styles';

type MenuItemProps = ModifyMantineProps<
  MantineNavLinkProps,
  UseDrillDownItemStyleProps,
  'childrenOffset'
>;

const DrillDownItem = (props: MenuItemProps) => {
  const { variant, textAlign, ...mantineUtilityProps } = props;
  const { classes } = useStyles({ variant, textAlign }, { name: 'DrilldownItem' });

  return (
    <MantineNavLink
      {...mantineUtilityProps}
      classNames={{
        root: classes.root,
        children: classes.children,
        rightSection: classes.rightSection,
        label: classes.label,
      }}
    />
  );
};

const D1 = withDefaultProps<MenuItemProps>(DrillDownItem);
const D2 = withForwardRef<Parameters<typeof D1>[0]>(D1);

export default createPolymorphicComponent<'button' | 'a', Parameters<typeof D2>[0]>(D2);
