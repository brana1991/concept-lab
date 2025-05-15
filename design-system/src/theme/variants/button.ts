import { colorAliases, ColorKeys, getColor } from './../tokens/colors';
import { borderTokens } from './../tokens/sizes';
import { CSSObject } from '@mantine/core';

import { getTransitionForProperty, toPx } from '../helpers/common';
import { buttonTokens, loaderTokens } from '../tokens/components';
import textVariants from './text';

const baseButton = {
  api: {
    '--_content-color': ' var(--content-color, blue)',
    '--_background-color': ' var--_background-color, blue)',
    '--_hover-background-color': ' var--_hover-background-color, blue)',
  },

  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: buttonTokens.height.x1 as number,
    minWidth: '150px',
    cursor: 'pointer',
    userSelect: 'none',
    textAlign: 'center',
    padding: '11px 16px',
    borderRadius: toPx(borderTokens[100]),
    transition: buttonTokens.transitions.ease,
    ...textVariants['variant-8'],

    color: 'var(--content-color)',
    backgroundColor: 'var(--background-color)',

    '@media(hover)': {
      ':hover': {
        color: 'var(--hover-color)',
        backgroundColor: 'var(--hover-background-color)',
        opacity: 0.9,

        svg: {
          'path[fill], circle[fill]': {
            fill: 'var(--hover-color)',
          },
          'path[stroke] circle[stroke]': {
            stroke: 'var(--hover-color)',
          },
        },
      },
    },

    '&[data-disabled]': {
      pointerEvents: 'none',
      color: 'var(--disabled-color)',
      backgroundColor: 'var(--disabled-background-color)',

      svg: {
        'path[fill], svg circle[fill]': {
          fill: 'var(--disabled-color)',
        },
        'path[stroke] svg circle[stroke]': {
          stroke: 'var(--disabled-color)',
        },
      },
      picture: {
        backgroundColor: 'var(--disabled-color)',
      },
    },

    '&[data-loading]': {
      '::before': { backgroundColor: 'transparent' },

      '& .mantine-Button-leftIcon': {
        svg: {
          height: toPx(loaderTokens.x1),
          width: toPx(loaderTokens.x1),
          stroke: 'var(--loader-color)',
        },
      },
    },

    svg: {
      'path[fill], circle[fill]': {
        fill: 'var(--content-color)',
        transition: 'fill 0.3s ease',
      },
      'path[stroke], circle[stroke]': {
        stroke: 'var(--content-color)',
        transition: getTransitionForProperty('stroke'),
      },
    },
  } as CSSObject,
};

const primaryButton = {
  root: {
    '--content-color': colorAliases.white,
    '--background-color': getColor(colorAliases.primaryColor as ColorKeys),
    '--hover-color': colorAliases.black,
    '--hover-background-color': getColor('brightSun'),
    '--disabled-color': colorAliases.white,
    '--disabled-background-color': getColor(colorAliases.primaryColor as ColorKeys, 0),
    '--loader-color': colorAliases.white,
    ...baseButton.root,
  } as CSSObject,
};

const secondaryButton = {
  root: {
    '--content-color': colorAliases.black,
    '--background-color': getColor('paleBlue'),
    '--hover-color': colorAliases.white,
    '--hover-background-color': getColor('eerieBlue'),
    '--disabled-color': getColor('eerieBlue'),
    '--disabled-background-color': getColor('paleBlue'),
    '--loader-color': colorAliases.black,
    ...baseButton.root,
  } as CSSObject,
};

const tertiaryButton = {
  root: {
    '--content-color': getColor(colorAliases.primaryColor as ColorKeys),
    '--background-color': getColor(colorAliases.primaryColor as ColorKeys, 0),
    '--hover-color': colorAliases.white,
    '--hover-background-color': getColor(colorAliases.primaryColor as ColorKeys),
    '--disabled-color': getColor('eerieBlue'),
    '--disabled-background-color': getColor('paleBlue'),
    '--loader-color': getColor(colorAliases.primaryColor as ColorKeys),
    ...baseButton.root,
  } as CSSObject,
};

const buttonVariants = {
  primary: primaryButton,
  secondary: secondaryButton,
  tertiary: tertiaryButton,
};

export default buttonVariants;
