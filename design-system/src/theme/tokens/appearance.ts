import { colorTokens } from './colors';
import { borderTokens, durationTokens, opacityTokens, shadowTokens, zIndexTokens } from './sizes';
export const toPx = (value: number) => `${value}px`;

/* These are Alias tokens. They are used on these sets because of their shared usage throughout component styles.  Example: shadow.top can be used on button and popover so we want to reference the same token. */
export const appearanceTokens = {
  opacity: {
    x2: opacityTokens['0.25'],
    x3: opacityTokens['0.5'],
    x9: opacityTokens['0.93'],
  },
  border: {
    x1: toPx(borderTokens[1]),
    x2: toPx(borderTokens[2]),
    x4: toPx(borderTokens[4]),
    x6: toPx(borderTokens[6]),
    x8: toPx(borderTokens[8]),
    x10: toPx(borderTokens[10]),
    x12: toPx(borderTokens[12]),
    x100: toPx(borderTokens[100]),
  },
  zIndex: {
    // these are my thoughts on naming, values should be checked for our purposes
    indicators: zIndexTokens[5],
    dropdown: zIndexTokens[10],
    sticky: zIndexTokens[20],
    fixed: zIndexTokens[30],
    popover: zIndexTokens[60],
    tooltip: zIndexTokens[70],
    modalBackdrop: zIndexTokens[40],
    modal: zIndexTokens[50],
    auto: 'auto',
  },
  shadow: {
    top: `0px -${toPx(shadowTokens['12'])} ${toPx(shadowTokens['24'])} ${colorTokens.black[0]}`,
    bottom: `0px ${toPx(shadowTokens['12'])} ${toPx(shadowTokens['24'])} ${colorTokens.black[0]}`,
  },
  duration: { x3: `${durationTokens['300']}ms`, x5: `${durationTokens['500']}ms` },
  timingFunction: {
    linear: 'linear',
    ease: 'ease',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  animations: {
    fade: {
      in: { opacity: 1 },
      out: { opacity: 0 },
      transitionProperty: 'opacity',
    },
    'slide-down': {
      in: { opacity: 1, transform: 'translateY(0)' },
      out: { opacity: 0, transform: 'translateY(-100%)' },
      common: { transformOrigin: 'top' },
      transitionProperty: 'transform, opacity',
    },
  },
  keyframeAnimations: {},
};

export type OpacityTokens = typeof appearanceTokens.opacity;
export type ZindexTokens = typeof appearanceTokens.zIndex;
export type BorderTokens = typeof appearanceTokens.border;
export type ShadowTokens = typeof appearanceTokens.shadow;
export type DurationTokens = typeof appearanceTokens.duration;
export type TimingFunctionTokens = typeof appearanceTokens.timingFunction;
export type AnimationTokens = typeof appearanceTokens.animations;
