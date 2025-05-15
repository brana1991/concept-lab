import { borderTokens } from './../tokens/sizes';
import { breakpoints } from './../tokens/breakpoints';
import { getColor } from './../tokens/colors';
import { CSSObject } from '@mantine/core';

import { toPx } from '../helpers/common';
import { linkTokens } from '../tokens/components';
import textVariants from './text';

const baseLink: CSSObject = {
  display: 'flex',
  alignItems: 'center',
  gap: '3px',
  padding: '8px 4px',
  transition: linkTokens.transition('color').ease,

  color: 'var(--text-color)',
  '--icon-color': 'var(--text-color)',

  '@media (hover: none) and (pointer: coarse)': {
    minHeight: toPx(linkTokens.height.x1),
  },

  '@media(hover)': {
    ':hover': {
      '--icon-color': getColor('redOrange'),
      color: getColor('redOrange'),
      textDecoration: 'none',
    },
  },
};

const link4Variant: CSSObject = {
  '--text-color': getColor('eerieBlue'),
  ...textVariants['variant-9'],
  ...baseLink,
};

interface LinkVariants {
  'link-1': CSSObject;
  'link-2': CSSObject;
  'link-3': CSSObject;
  'link-4': CSSObject;
  'link-5': CSSObject;
  'link-6': CSSObject;
  'link-7': CSSObject;
  'link-8': CSSObject;
  'link-9': CSSObject;
  'link-btn': CSSObject;
}

const linkVariants: LinkVariants = {
  'link-1': {
    '--text-color': getColor('deepBlue'),
    ...textVariants['variant-8'],
    ...baseLink,
    textTransform: 'uppercase',
  },
  'link-2': {
    '--text-color': getColor('eerieBlack'),
    ...textVariants['variant-9'],
    ...baseLink,
    textTransform: 'uppercase',
  },
  'link-3': {
    '--text-color': getColor('redOrange'),
    ...textVariants['variant-5'],
    ...baseLink,
  },
  'link-4': link4Variant,
  'link-5': {
    ...link4Variant,

    '@media(hover)': {
      ':hover': {
        '--icon-color': getColor('eerieBlack'),
        color: getColor('eerieBlack'),
        textDecoration: 'none',
      },
    },
  },
  'link-6': {
    '--text-color': getColor('eerieBlack'),
    ...textVariants['variant-8'],
    ...baseLink,
  },
  'link-7': {
    '--text-color': getColor('eerieBlack'),
    ...textVariants['variant-7'],
    ...baseLink,
  },
  'link-8': {
    '--text-color': getColor('eerieBlue'),
    ...textVariants['variant-5'],
    ...baseLink,
    [`@media (min-width: ${breakpoints.md}px)`]: {
      padding: '2px 0',
      height: 'auto',
    },
  },
  'link-9': {
    '--text-color': getColor('redOrange'),
    ...textVariants['variant-9'],
    ...baseLink,
    padding: 0,
    display: 'inline',
  },
  'link-btn': {
    '--text-color': getColor('eerieBlack'),
    ...textVariants['variant-9'],
    ...baseLink,
    gap: '10px',
    backgroundColor: getColor('white'),
    borderRadius: borderTokens[8],
    padding: '12px 16px',
    transition: linkTokens.transition('background-color').ease,

    '@media(hover)': {
      ':hover': {
        backgroundColor: getColor('brightSun'),
        textDecoration: 'none',
      },
    },
  },
} as const;

export default linkVariants;
