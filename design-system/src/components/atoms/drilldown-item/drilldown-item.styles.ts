import { createStyles } from '@mantine/core';
import { CSSProperties } from 'react';
import { DrillDownItemVariants } from '../../../theme';

export type UseDrillDownItemStyleProps = {
  variant: DrillDownItemVariants;
  childrenOffset?: number;
  textAlign?: CSSProperties['textAlign'];
};

export default createStyles(
  (theme, { variant, textAlign = 'left' }: UseDrillDownItemStyleProps) => {
    return {
      root: {
        ...theme.other.variants.drillDownItem[variant].root,
        textAlign,
      },
      children: {
        ...theme.other.variants.drillDownItem[variant].children,
      },
      rightSection: {
        ...theme.other.variants.drillDownItem[variant].rightSection,
      },
      label: {
        ...theme.other.variants.drillDownItem[variant].label,
      },
    };
  },
);
