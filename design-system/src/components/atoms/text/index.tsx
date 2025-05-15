import { Text as MantineText, TextProps as MantineTextProps } from '@mantine/core';
import { createPolymorphicComponent } from '@mantine/utils';
import { TextVariants } from '../../../theme';

import { ModifyMantineProps } from '../../shared-types';
import { withDefaultProps, withForwardRef } from '../../shared-utils';
import useStyles from './text.styles';
import { TextUtilityProps } from './utils';

type TextProps = TextUtilityProps<ModifyMantineProps<MantineTextProps, { variant: TextVariants }>>;

const Text = ({ className, _ref, ...props }: TextProps) => {
  const {
    variant,
    weight,
    align,
    transform,
    textDecoration,
    unstyled,
    styles,
    classNames,
    ...mantineUtilityProps
  } = props;

  const { classes, cx } = useStyles(
    { variant, weight, align, textDecoration, transform },
    { name: 'AnanasText', classNames, styles, unstyled },
  );

  return (
    <MantineText
      component="p"
      ref={_ref}
      className={cx(classes.root, className)}
      {...mantineUtilityProps}
    />
  );
};

const T1 = withDefaultProps<TextProps>(Text);
const T2 = withForwardRef<Parameters<typeof T1>[0]>(T1);

export default createPolymorphicComponent<'p', Parameters<typeof T2>[0]>(T2);
