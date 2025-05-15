export const spacingTokens = {
  '0': 0,
  x1: 4,
  x2: 8,
  x3: 16,
  x4: 24,
  x5: 32,
  x6: 40,
  x7: 64,
} as const;

export type SpacingTokens = typeof spacingTokens;
