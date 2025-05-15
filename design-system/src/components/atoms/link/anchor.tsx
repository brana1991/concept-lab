import {
  Anchor as MantineLink,
  AnchorProps as MantineAnchorProps,
  createPolymorphicComponent,
} from '@mantine/core';
import { LinkVariants } from '../../../theme';

import { ModifyMantineProps } from '../../shared-types';
import { withDefaultProps, withForwardRef } from '../../shared-utils';
import { TextUtilityProps } from '../text/utils';
import useStyles from './anchor.styles';

export type AnchorProps = TextUtilityProps<
  ModifyMantineProps<MantineAnchorProps, { variant: LinkVariants; to?: string }>
>;

const Anchor = (props: AnchorProps) => {
  const {
    variant,
    weight,
    align,
    transform,
    textDecoration,
    _ref,
    children,
    className,
    ...mantineUtilityProps
  } = props;

  const { classes, cx } = useStyles(
    { variant, weight, align, transform, textDecoration },
    { name: 'Anchor' },
  );

  return (
    <MantineLink ref={_ref} className={cx(classes.root, className)} {...mantineUtilityProps}>
      {children}
    </MantineLink>
  );
};

const A1 = withDefaultProps<AnchorProps>(Anchor);
const A2 = withForwardRef<Parameters<typeof A1>[0]>(A1);

export default createPolymorphicComponent<'a', Parameters<typeof A2>[0]>(A2);
