import { AnimationTokens, appearanceTokens } from '../tokens/appearance';

export const resolveTransition = (transition: keyof AnimationTokens) =>
  appearanceTokens.animations[transition];
