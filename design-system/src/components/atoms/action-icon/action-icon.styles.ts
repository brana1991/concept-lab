import { createStyles } from '@mantine/core';
import { ActionIconVariants, ColorKeys } from '../../../theme';
import { MouseEventHandler } from 'react';

export type ActionIconProps = {
  color?: ColorKeys;
  hoverColor?: ColorKeys;
  variant?: ActionIconVariants;
  width?: number;
  height?: number;
  onClick?: MouseEventHandler<HTMLElement>;
};

export default createStyles(
  (theme, { variant = 'default', color, hoverColor }: ActionIconProps) => {
    return {
      root: theme.other.variants.actionIcon[variant]({
        color: color ?? 'eerieBlack',
        hoverColor: hoverColor ?? color ?? 'eerieBlack',
      }),
    };
  },
);
