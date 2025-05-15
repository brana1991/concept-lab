import { getColor } from './../tokens/colors';
import { typographyTokens } from './../tokens/typography';
import { inputTokens } from './../tokens/components';
import { spacingTokens } from './../tokens/spacing';
import { appearanceTokens } from './../tokens/appearance';

import { CSSObject } from '@mantine/core';

import textVariants from './text';

interface InputBase {
  root: CSSObject;
  input: CSSObject;
  label: CSSObject;
  required: CSSObject;
  error: CSSObject;
}

export interface InputStyleParams {
  hasError: boolean;
  disabled: boolean;
  unstyled?: boolean;
}

type BaseInputVariants = (props: InputStyleParams) => InputBase;

const baseError: CSSObject = {
  ...textVariants['variant-9'],
  fontWeight: typographyTokens.fontWeight.regular,
  color: inputTokens.color.text.error,
  marginTop: spacingTokens.x1,
  position: 'absolute',
};

const baseRequired: CSSObject = {
  color: inputTokens.color.text.error,
};

const baseLabel: CSSObject = {
  display: 'flex',
  gap: '4px',
  ...textVariants['variant-7'],
  color: inputTokens.color.text.regular,
  marginBottom: spacingTokens.x1,
};

export const baseInputStyles: BaseInputVariants = ({ hasError, disabled, unstyled }) => ({
  root: {
    width: '100%',
    position: 'relative',
    ...(disabled ? { opacity: appearanceTokens.opacity.x3 } : {}),
  },
  input: {
    ...textVariants['variant-5'],
    height: inputTokens.height.sm,
    outline: 'none',
    color: `${inputTokens.color.text.regular} ${unstyled ? '' : '!important'}`,
    backgroundColor: inputTokens.color.background.regular,
    paddingLeft: `16px ${unstyled ? '' : '!important'}`,
    border: `1px solid ${hasError ? inputTokens.color.border.error : getColor('foggyBlue')}`,
    borderRadius: appearanceTokens.border.x8,
    ...(unstyled ? { width: '100%' } : {}),

    '&::placeholder': {
      color: `${inputTokens.color.text.instruction} ${unstyled ? '' : '!important'}`,
    },

    '&:focus': {
      borderColor: inputTokens.color.border.focus,
      boxShadow: inputTokens.shadow.focus,
    },

    ...(unstyled ? { '&:disabled': { cursor: 'not-allowed' } } : {}),

    '&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus, &:-webkit-autofill:active':
      {
        boxShadow: '0 0 0 100px white inset !important',
      },
  },

  label: baseLabel,
  required: baseRequired,
  error: {
    ...baseError,
    ...(!unstyled ? { marginTop: 0 } : {}),
  },
});
