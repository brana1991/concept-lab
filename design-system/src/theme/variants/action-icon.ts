import { CSSObject } from '@mantine/core';

import { getTransitionForProperty } from '../helpers/common';
import { appearanceTokens } from '../tokens/appearance';
import { ColorKeys, getColor } from '../tokens/colors';
import { iconTokens } from '../tokens/components';

interface DynamicProps {
  color?: ColorKeys;
  hoverColor?: ColorKeys;
}

interface Variations {
  default: (porps: DynamicProps) => CSSObject;
  transparent: (porps: DynamicProps) => CSSObject;
  outline: (porps: DynamicProps) => CSSObject;
}

const baseSyles: CSSObject = {
  padding: 10,
  width: 'auto',
  height: 'auto',
  ':disabled': {
    border: 'none',
  },
};

function getColorStyles({
  color = 'black',
  hoverColor = 'white',
}: {
  color?: ColorKeys;
  hoverColor?: ColorKeys;
}) {
  let styles: CSSObject = {};
  if (color) {
    const colorValue = getColor(color);

    styles = {
      ...styles,
      'path[fill], circle[fill]': {
        transition: iconTokens.transitions('fill').ease,
        fill: colorValue,
      },
      'path[stroke], circle[stroke]': {
        transition: iconTokens.transitions('stroke').ease,
        stroke: colorValue,
      },
      '& > picture': {
        transition: iconTokens.transitions('background-color').ease,
        backgroundColor: colorValue,
      },
    };
  }

  if (hoverColor) {
    const hoverColorValue = getColor(hoverColor);

    styles = {
      ...styles,
      ':hover path[fill], :hover circle[fill]': {
        fill: hoverColorValue,
      },
      ':hover path[stroke], :hover circle[stroke]': {
        stroke: hoverColorValue,
      },
      ':hover > picture': {
        backgroundColor: hoverColorValue,
      },
    };
  }

  return styles;
}

const actionIcon: Variations = {
  default: ({ color, hoverColor }) => ({
    ...baseSyles,
    ...getColorStyles({ color, hoverColor }),
    background: getColor('white'),
    transition: getTransitionForProperty('background'),
    borderRadius: appearanceTokens.border.x8,
    ':hover': {
      background: getColor('brightSun'),
    },
  }),
  transparent: ({ color, hoverColor }) => ({
    ...baseSyles,
    ...getColorStyles({ color, hoverColor }),
    background: 'transprent',
    ':hover': {
      background: 'transparent',
    },
  }),
  outline: ({ color, hoverColor }) => ({
    ...baseSyles,
    ...getColorStyles({ color, hoverColor }),
    background: getColor('white'),
    borderRadius: appearanceTokens.border.x8,
    border: `1px solid ${getColor('eerieBlack')}`,
    ':hover': {
      background: getColor('white'),
    },
  }),
};

export default actionIcon;
