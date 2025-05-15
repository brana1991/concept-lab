import { Box, BoxProps, createPolymorphicComponent } from '@mantine/core';

import { ModifyMantineProps } from '../../shared-types';
import { withDefaultProps, withForwardRef } from '../../shared-utils';
import useStyles, { UseIconImageProps } from './icon-image.styles';

export type IconImageProps = ModifyMantineProps<BoxProps, UseIconImageProps>;

const IconImage = ({
  className,
  src,
  color,
  hoverColor,
  variant,
  ...otherProps
}: IconImageProps) => {
  const { classes, cx } = useStyles({ src, color, hoverColor, variant }, { name: 'IconImage' });

  return <Box component="picture" className={cx(classes.root, className)} {...otherProps} />;
};

const I1 = withDefaultProps<IconImageProps>(IconImage);
const I2 = withForwardRef<Parameters<typeof I1>[0]>(I1);

export default createPolymorphicComponent<'picture', Parameters<typeof I2>[0]>(I2);
