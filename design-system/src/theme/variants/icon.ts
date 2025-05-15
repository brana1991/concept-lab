import { getColor, ColorKeys } from './../tokens/colors';
import { CSSObject } from '@mantine/core';

import { iconTokens } from '../tokens/components';

interface PrimaryVariationProps {
  color: ColorKeys;
  hoverColor: ColorKeys;
  src: string;
}

const getHoverStyles = (color: ColorKeys): CSSObject => {
  return color ? { ':hover': { backgroundColor: `var(--icon-color, ${getColor(color)})` } } : {};
};

const iconVariants = {
  primary: (props: PrimaryVariationProps) => {
    const color = props.color ? getColor(props.color) : getColor('eerieBlack');

    return {
      root: {
        display: 'block',
        width: iconTokens.width.x1,
        height: iconTokens.height.x1,
        transition: iconTokens.transitions('background-color').ease,
        backgroundColor: `var(--icon-color, ${color})`,
        mask: `url('${props.src}') no-repeat center`,
        ...getHoverStyles(props.hoverColor),
      },
    };
  },
};

export default iconVariants;
