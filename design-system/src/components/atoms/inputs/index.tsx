import {
  TextInput as MantineTextInput,
  TextInputProps as MantineTextInputProps,
} from '@mantine/core';
import { useRef } from 'react';
import { ModifyMantineProps } from '../../shared-types';
import { withDefaultProps, withForwardRef } from '../../shared-utils';

import { isUncontrolledInput } from './helpers';
import useStyles, { TextInputStyleParams } from './text-input.styles';
import { createPolymorphicComponent } from '@mantine/utils';

type ComponentProps = TextInputStyleParams & {
  value?: NonNullable<string>;
  defaultValue?: NonNullable<string>;
};

// todo: too many props I do not understand
export type TextInputProps = ModifyMantineProps<
  MantineTextInputProps,
  ComponentProps,
  'unstyled' | 'description' | 'descriptionProps' | 'icon' | 'iconWidth'
>;

const TextInput = (props: TextInputProps) => {
  const {
    _ref,
    value = '',
    defaultValue = null,
    className,
    classNames,
    variant = 'filled',
    rightSectionSpacing,
    ...restProps
  } = props;
  const localRef = useRef<HTMLInputElement>(null);

  const { classes, cx } = useStyles(
    {
      variant,
      disabled: restProps.disabled,
      hasError: Boolean(restProps.error),
      rightSectionWidth: restProps.rightSectionWidth as number,
      rightSectionSpacing: rightSectionSpacing,
    },
    { name: 'TextInput', classNames },
  );

  const valueProps = isUncontrolledInput(defaultValue) ? { defaultValue } : { value };

  return (
    <MantineTextInput
      inputWrapperOrder={['label', 'input', 'error']}
      className={cx(classes.root, className)}
      classNames={{
        wrapper: cx(classes.wrapper, classNames?.wrapper),
        input: cx(classes.input, classNames?.input),
        label: cx(classes.label, classNames?.label),
        error: cx(classes.error, classNames?.error),
        required: cx(classes.required, classNames?.required),
        rightSection: cx(classes.rightSection, classNames?.rightSection),
      }}
      {...restProps}
      {...valueProps}
      unstyled
      ref={(el) => {
        _ref?.(el);
        localRef.current = el;
      }}
    />
  );
};

const T1 = withDefaultProps<TextInputProps>(TextInput);
const T2 = withForwardRef<Parameters<typeof T1>[0]>(T1);

export default createPolymorphicComponent<'button', Parameters<typeof T2>[0]>(T2);
