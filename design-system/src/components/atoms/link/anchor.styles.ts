import { createStyles } from '@mantine/core';
import { LinkVariants } from '../../../theme';

import { TextUtilityProps, textUtilityPropsToCss } from '../text/utils';

type Params = TextUtilityProps<{ variant: LinkVariants }>;
export default createStyles((theme, { variant, ...rest }: Params) => {
  return {
    root: {
      ...theme.other.variants.link[variant],
      ...textUtilityPropsToCss(theme, rest),
    },
  };
});
