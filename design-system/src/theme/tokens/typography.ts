export const typographyTokens = {
  fontSize: {
    11: 11,
    12: 12,
    13: 13,
    14: 14,
    15: 15,
    16: 16,
    20: 20,
    25: 25,
    30: 30,
  },
  lineHeight: {
    1: 1,
    1.1: 1.1,
    1.2: 1.25,
    1.3: 1.36,
    1.4: 1.4,
    1.5: 1.5,
    1.7: 1.7,
  },
  letterSpacing: {
    '-1': -1,
    '-0.5': -0.5,
    '-0.3': -0.3,
    0: 0,
    0.2: 0.2,
    0.3: 0.3,
  },
  fontWeight: {
    regular: 400,
    semibold: 600,
    bold: 700,
  },
} as const;

export const typography = {
  fontFamily: 'Open Sans, sans-serif',
};

export type FontSizeTokens = typeof typographyTokens.fontSize;
export type FontWeightTokens = typeof typographyTokens.fontWeight;
export type LetterSpacingTokens = typeof typographyTokens.letterSpacing;
export type LineHeightTokens = typeof typographyTokens.lineHeight;
