// Dimension tokens are meant to hold all standardized dimension like values( Height,Width,Padding ….) Often we are using these tokens to build more complex ones.
export const dimensionTokens = {
  5: 5,
  8: 8,
  10: 10,
  13: 13,
  16: 16,
  18: 18,
  20: 20,
  24: 24,
  30: 30,
  36: 36,
  40: 40,
  42: 42,
  44: 44,
  48: 48,
  50: 50,
  52: 52,
  55: 55,
  70: 70,
  86: 86,
  100: 100,
  158: 158,
  200: 200,
  300: 300,
  350: 350,
  873: 873,
  1280: 1280,
} as const;

export const borderTokens = {
  1: 1,
  2: 2,
  4: 4,
  6: 6,
  8: 8,
  10: 10,
  12: 12,
  50: 50,
  100: 100,
} as const;

export const zIndexTokens = {
  5: 5,
  10: 10,
  20: 20,
  30: 30,
  40: 40,
  50: 50,
  60: 60,
  70: 70,
  80: 80,
} as const;

export const shadowTokens = {
  12: 12,
  24: 24,
} as const;

export const opacityTokens = {
  0.25: 0.25,
  0.5: 0.5,
  0.8: 0.8,
  0.93: 0.93,
};

export const durationTokens = {
  300: 300,
  500: 500,
} as const;
