import { createStyles } from '@mantine/core';
import { DividerVariants } from '../../../theme';

type DividerStyleProps = {
  variant?: DividerVariants;
};

export default createStyles((theme, { variant = 'regular' }: DividerStyleProps) => ({
  root: theme.other.variants.divider[variant]?.root,
}));
