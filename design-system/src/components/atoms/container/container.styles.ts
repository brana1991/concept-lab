import { createStyles } from '@mantine/core';
import { ContainerVariants } from '../../../theme';

export type UseContainerStyleProps = {
  variant?: ContainerVariants;
};

export default createStyles((theme, { variant = 'regular' }: UseContainerStyleProps) => {
  return {
    root: {
      ...theme.other.variants.container[variant].root,
    },
  };
});
