import { createStyles } from '@mantine/core';
import { ColorKeys, IconVariants } from '../../../theme';

export type UseIconImageProps = {
  src: string;
  color?: ColorKeys;
  hoverColor?: ColorKeys;
  variant?: IconVariants;
};

export default createStyles(
  (theme, { src, color, hoverColor, variant = 'primary' }: UseIconImageProps) => {
    return {
      root: {
        ...theme.other.variants.icon[variant]({ src, color, hoverColor }).root,
      },
    };
  },
);
