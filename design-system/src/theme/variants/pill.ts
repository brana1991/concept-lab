import { pillTokens } from './../tokens/components';
import { CSSObject } from '@mantine/core';

import textVariants from './text';

export interface PillClassNames {
  root?: CSSObject;
  label?: CSSObject;
  input?: CSSObject;
  iconWrapper?: CSSObject;
  checkIcon?: CSSObject;
}

interface PillVariants {
  default: PillClassNames;
}

const pillVariants: PillVariants = {
  default: {
    root: {
      display: 'flex',
    },
    label: {
      ...textVariants['variant-9'],
      height: pillTokens.height.sm,
      maxWidth: pillTokens.width.xl,
      borderRadius: pillTokens.borderRadius.full,
      color: pillTokens.color.default.text,
      padding: `0 ${pillTokens.height.xs}px`,
      display: 'flex',
      alignItems: 'center',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      "&[data-variant='outline']": {
        backgroundColor: pillTokens.color.default.unchecked,
        border: 'none',
        '&:hover': {
          backgroundColor: pillTokens.color.default.unchecked,
        },
      },
      "&[data-checked='true'][data-variant='outline']": {
        backgroundColor: pillTokens.color.default.checked,
        padding: `0 ${pillTokens.height.xs}px`,
        border: 'none',
        '&:hover': {
          backgroundColor: pillTokens.color.default.checked,
        },
      },
    },
    iconWrapper: {
      display: 'none',
    },
  },
};
export default pillVariants;
