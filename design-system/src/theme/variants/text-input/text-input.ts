import { CSSObject } from '@mantine/core';

import { inputTokens } from '../../tokens/components';
import { baseInputStyles } from '../base-input';

interface InputClassNames {
  root?: CSSObject;
  wrapper?: CSSObject;
  input?: CSSObject;
  label?: CSSObject;
  error?: CSSObject;
  required?: CSSObject;
  rightSection?: CSSObject;
}

export interface TextInputVariantParams {
  disabled?: boolean;
  hasError?: boolean;
  rightSectionWidth?: number;
  rightSectionSpacing?: number;
}

interface TextInputVariants {
  filled: (props: TextInputVariantParams) => InputClassNames;
}

// todo :: right section
// todo :: documentation

const getRightSectionPositioning = (
  rightSectionWidth: number,
  rightSectionSpacing: number,
): Pick<InputClassNames, 'input' | 'rightSection' | 'wrapper'> => {
  const defaultHorizontalPadding = 16;

  return {
    wrapper: {
      position: 'relative',
    },
    input: {
      paddingRight: rightSectionWidth
        ? `${rightSectionWidth + rightSectionSpacing + defaultHorizontalPadding}px`
        : defaultHorizontalPadding,
    },
    rightSection: {
      top: 0,
      bottom: 0,
      position: 'absolute',
      right: rightSectionSpacing,
      width: rightSectionWidth,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  };
};

const textInputVariants: TextInputVariants = {
  filled: ({ disabled, hasError, rightSectionWidth = 0, rightSectionSpacing = 14 }) => {
    const rightSectionStyles = getRightSectionPositioning(rightSectionWidth, rightSectionSpacing);

    const baseInput = baseInputStyles({ hasError, disabled, unstyled: true });

    return {
      root: baseInput.root,
      wrapper: {
        ...rightSectionStyles.wrapper,
      },
      input: {
        ...rightSectionStyles.input,
        ...baseInput.input,
      },
      label: baseInput.label,
      required: baseInput.required,
      error: baseInput.error,

      rightSection: {
        ...rightSectionStyles.rightSection,
        '--icon-color': inputTokens.color.text.regular,
      },
    };
  },
};

export default textInputVariants;
