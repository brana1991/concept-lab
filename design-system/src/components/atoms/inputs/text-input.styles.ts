import { createStyles } from '@mantine/core';
import { TextInputVariantParams, TextInputVariants } from '../../../theme';

export interface TextInputStyleParams extends Pick<TextInputVariantParams, 'rightSectionSpacing'> {
  variant?: TextInputVariants;
}

type StyleProps = TextInputStyleParams & TextInputVariantParams;

export default createStyles((theme, props: StyleProps) => {
  const variantStyle = theme.other.variants.textInput[props.variant!]({
    disabled: props.disabled,
    hasError: props.hasError,
    rightSectionWidth: props.rightSectionWidth,
    rightSectionSpacing: props.rightSectionSpacing,
  });

  return {
    root: variantStyle.root,
    wrapper: variantStyle.wrapper,
    input: variantStyle.input,
    label: variantStyle.label,
    error: variantStyle.error,
    required: variantStyle.required,
    rightSection: variantStyle.rightSection,
  };
});
