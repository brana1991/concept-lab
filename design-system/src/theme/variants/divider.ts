import { CSSObject } from '@mantine/core';

const baseDividerRoot: CSSObject = {};

interface Variation {
  root: CSSObject;
}

interface DividerVariants {
  regular: Variation;
  small: Variation;
}

const dividerVariants: DividerVariants = {
  regular: {
    root: {
      ...baseDividerRoot,
    },
  },
  small: {
    root: {
      ...baseDividerRoot,
      height: 20,
      margin: 'auto 0',
    },
  },
} as const;

export default dividerVariants;
