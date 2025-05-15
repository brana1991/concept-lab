import { CSSObject, MantineTheme } from '@mantine/core';
import { CSSProperties } from 'react';
import { FontWeight } from '../../../theme';

interface UtilityProps {
  weight?: FontWeight;
  align?: CSSProperties['textAlign'];
  transform?: CSSProperties['textTransform'];
  textDecoration?: CSSProperties['textDecoration'];
}

export type TextUtilityProps<T> = UtilityProps &
  Omit<T, 'underline' | 'strikethrough' | 'weight' | 'gradient' | 'italic'>;

export const textUtilityPropsToCss = (theme: MantineTheme, props: UtilityProps): CSSObject => {
  return {
    ...theme.other.helpers.applyOptionalStyle(
      'fontWeight',
      theme.other.fontWeight[props.weight || 'regular'],
    ),
    ...theme.other.helpers.applyOptionalStyle('textAlign', props.align),
    ...theme.other.helpers.applyOptionalStyle('textTransform', props.transform),
    ...theme.other.helpers.applyOptionalStyle('textDecoration', props.textDecoration),
  };
};
