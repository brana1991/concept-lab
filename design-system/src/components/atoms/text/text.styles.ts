import { createStyles } from '@mantine/core';
import { TextVariants } from '../../../theme';

import { TextUtilityProps, textUtilityPropsToCss } from './utils';

type TextStyleParams = TextUtilityProps<{ variant: TextVariants }>;

export default createStyles((theme, { variant, ...utilityProps }: TextStyleParams) => {
  return {
    root: {
      ...theme.other.variants.text[variant],
      ...textUtilityPropsToCss(theme, utilityProps),
    },
  };
});
