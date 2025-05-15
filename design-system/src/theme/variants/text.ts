import { CSSObject } from '@mantine/core';
export const pxToRem = (value: number, rootFontSize = 16) => `${value / rootFontSize}rem`;

import { typographyTokens } from '../tokens/typography';

interface TextVariants {
  'variant-1': CSSObject;
  'variant-2': CSSObject;
  'variant-3': CSSObject;
  'variant-4': CSSObject;
  'variant-5': CSSObject;
  'variant-6': CSSObject;
  'variant-7': CSSObject;
  'variant-8': CSSObject;
  'variant-9': CSSObject;
  'variant-10': CSSObject;
}

const textVariants: TextVariants = {
  'variant-1': {
    fontSize: pxToRem(typographyTokens.fontSize[30]),
    lineHeight: typographyTokens.lineHeight['1.1'],
    fontWeight: typographyTokens.fontWeight.bold,
    letterSpacing: typographyTokens.letterSpacing['-1'],
  },
  'variant-2': {
    fontSize: pxToRem(typographyTokens.fontSize[25]),
    lineHeight: typographyTokens.lineHeight[1],
    fontWeight: typographyTokens.fontWeight.bold,
    letterSpacing: typographyTokens.letterSpacing['-0.5'],
  },
  'variant-3': {
    fontSize: pxToRem(typographyTokens.fontSize[20]),
    lineHeight: typographyTokens.lineHeight['1.2'],
    fontWeight: typographyTokens.fontWeight.bold,
    letterSpacing: typographyTokens.letterSpacing['-0.3'],
  },
  'variant-4': {
    fontSize: pxToRem(typographyTokens.fontSize[16]),
    lineHeight: typographyTokens.lineHeight['1.1'],
    fontWeight: typographyTokens.fontWeight.bold,
    letterSpacing: typographyTokens.letterSpacing['-0.3'],
  },
  'variant-5': {
    fontSize: pxToRem(typographyTokens.fontSize[15]),
    lineHeight: typographyTokens.lineHeight['1.4'],
    fontWeight: typographyTokens.fontWeight.regular,
  },
  'variant-6': {
    fontSize: pxToRem(typographyTokens.fontSize[14]),
    lineHeight: typographyTokens.lineHeight['1.1'],
  },
  'variant-7': {
    fontSize: pxToRem(typographyTokens.fontSize[13]),
    lineHeight: typographyTokens.lineHeight['1.2'],
    letterSpacing: typographyTokens.letterSpacing['-0.5'],
    fontWeight: typographyTokens.fontWeight.regular,
  },
  'variant-8': {
    fontSize: pxToRem(typographyTokens.fontSize[13]),
    lineHeight: typographyTokens.lineHeight['1.7'],
    fontWeight: typographyTokens.fontWeight.bold,
  },
  'variant-9': {
    fontSize: pxToRem(typographyTokens.fontSize[12]),
    lineHeight: typographyTokens.lineHeight['1.1'],
    fontWeight: typographyTokens.fontWeight.bold,
  },
  'variant-10': {
    fontSize: pxToRem(typographyTokens.fontSize[11]),
    lineHeight: typographyTokens.lineHeight['1.3'],
    fontWeight: typographyTokens.fontWeight.bold,
    textTransform: 'uppercase',
  },
} as const;

export default textVariants;
