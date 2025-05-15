import { CSSObject } from '@mantine/core';

import { appearanceTokens } from './appearance';
import { hexToRGB } from '../helpers/common';
import { borderTokens, dimensionTokens, durationTokens, zIndexTokens } from './sizes';
import { getColor } from './colors';
import { spacingTokens } from './spacing';

export const menuItemTokens = {
  height: {
    x1: dimensionTokens[40],
    x2: dimensionTokens[48],
  },
  transitions: {
    ease: `color ${appearanceTokens.duration.x3} ${appearanceTokens.timingFunction.ease}, background-color ${appearanceTokens.duration.x3} ${appearanceTokens.timingFunction.ease}, opacity ${appearanceTokens.duration.x3} ${appearanceTokens.timingFunction.ease}`,
  },
};

export const buttonTokens = {
  height: {
    x1: dimensionTokens[44],
  },
  transitions: {
    ease: `color ${appearanceTokens.duration.x3} ${appearanceTokens.timingFunction.ease}, background-color ${appearanceTokens.duration.x3} ${appearanceTokens.timingFunction.ease}, opacity ${appearanceTokens.duration.x3} ${appearanceTokens.timingFunction.ease}`,
  },
};

export const inputTokens = {
  color: {
    text: {
      regular: getColor('deepBlue'),
      instruction: getColor('eerieBlue'),
      error: getColor('red'),
      success: getColor('pistachio'),
    },
    background: {
      regular: getColor('white'),
    },
    border: {
      regular: getColor('foggyBlue'),
      focus: getColor('carolinaBlue'),
      error: getColor('red'),
    },
  },
  shadow: {
    focus: `2px 2px 23px ${hexToRGB(getColor('carolinaBlue'), 0.07)} `,
  },
  height: {
    sm: dimensionTokens['52'],
  },
  spacing: {
    xs: 10,
    sm: 12,
    md: spacingTokens.x3,
    'medium-1': 20,
    lg: spacingTokens.x4,
    xl: spacingTokens.x5,
  },
  zIndex: {
    md: zIndexTokens['5'],
  },
  transition: (property: keyof CSSObject) =>
    `${property} ${appearanceTokens.duration.x3} ${appearanceTokens.timingFunction.ease}`,
};

export const iconTokens = {
  height: {
    x1: dimensionTokens[24],
  },
  width: {
    x1: dimensionTokens[24],
  },
  transitions: (property: string) => {
    return {
      ease: `${property} ${appearanceTokens.duration.x3} ${appearanceTokens.timingFunction.ease}`,
    };
  },
};

export const transitionTokens = {
  animations: {
    ...appearanceTokens.animations,
  },
};

export const popoverTokens = {
  animations: {
    fade: appearanceTokens.animations.fade,
  },
};

export const hoverMenuTokens = {
  animations: {
    fade: appearanceTokens.animations.fade,
  },
};

export const menuTokens = {
  animations: {
    fade: appearanceTokens.animations.fade,
    slideDown: appearanceTokens.animations['slide-down'],
  },
};

export const carouselTokens = {
  indicators: {
    width: { x1: dimensionTokens[5] },
    height: { x1: dimensionTokens[5] },
    color: {
      dotsInactiveColor: getColor('eerieBlue'),
      dotsActiveColor: getColor('redOrange'),
    },
  },
  navigation: {
    button: {
      width: { x1: dimensionTokens[42] },
      height: { x1: dimensionTokens[42] },
    },
  },
  thumbnails: {},
};

export const modalTokens = {
  animations: {
    fade: appearanceTokens.animations['fade'],
  },
  transitionDuration: { x5: durationTokens[500], x3: durationTokens[300] },
};

export const autocompleteTokens = {
  width: {
    dropdown: dimensionTokens[873],
    rightInputSection: { mobile: dimensionTokens[100], desktop: dimensionTokens[50] },
  },
  padding: {
    dropdown: {
      mobile: 24,
      desktop: 32,
    },
  },
  position: {
    dropdown: {
      top: {
        mobile: inputTokens.height.sm,
        desktop: inputTokens.height.sm + 10,
      },
    },
  },
  colors: {
    dropdownBackground: getColor('white'),
  },
  radius: {
    dropdown: borderTokens[8],
    input: { mobile: `${borderTokens[8]}px ${borderTokens[8]}px 0 0`, desktop: borderTokens[8] },
  },
  shadow: {
    dropdown: '0px 12px 24px rgba(0, 0, 0, 0.1)',
  },
  transitions: {
    ease: `border ${appearanceTokens.duration.x5} ${appearanceTokens.timingFunction.ease}`,
  },
  zIndex: {
    search: 50,
  },
};

export const loaderTokens = {
  x1: dimensionTokens[13],
};

export const linkTokens = {
  height: {
    x1: dimensionTokens[44],
  },
  transition: (property: string) => ({
    ease: `${property} ${appearanceTokens.duration.x3} ${appearanceTokens.timingFunction.ease}`,
  }),
};

export const containerTokens = {
  maxWidth: {
    x1: dimensionTokens[1280],
  },
  padding: {
    x1: dimensionTokens[16],
  },
  radius: {
    x1: borderTokens[8],
  },
};

const productCardTokens = {
  imageResolutions: {
    small: dimensionTokens[158],
    base: dimensionTokens[200],
  } as const,
  zIndex: {
    x1: zIndexTokens[5],
  },
};

const promoCardTokens = {
  imageResolutions: {
    base: dimensionTokens[200],
  } as const,
  zIndex: {
    x1: zIndexTokens[5],
    x2: zIndexTokens[10],
  },
  aspectRatio: {
    portrait: '200 / 286',
  },
  overlay: {
    regular: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 65.51%, rgba(0, 0, 0, 0.4) 100%);',
    outOfStock: 'rgba(255, 255, 255, 0.86)',
  },
};

const categoryCardTokens = {
  imageResolutions: {
    small: dimensionTokens[100],
    medium: dimensionTokens[158],
    large: dimensionTokens[200],
  },
  aspectRatio: {
    'landscape-regular': '5 / 4',
    'landscape-small': '5 / 3',
    portrait: '200 / 286',
  },
  overlay: {
    background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 65.51%, rgba(0, 0, 0, 0.4) 100%);',
  },
};

const contextualCardTokens = {
  imageResolutions: {
    medium: dimensionTokens[300],
    large: dimensionTokens[350],
  },
  aspectRatio: {
    desktop: '308 / 226',
    mobile: '343 / 170',
  },
  overlay: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.45) 100%);',
};

export const cardTokens = {
  product: productCardTokens,
  category: categoryCardTokens,
  contextual: contextualCardTokens,
  promo: promoCardTokens,
};

export const radioTokens = {
  color: {
    circle: {
      unchecked: getColor('eerieBlue'),
      checked: getColor('redOrange'),
    },
    rectangle: {
      unchecked: getColor('eerieBlack'),
      checked: getColor('redOrange'),
    },
    background: {
      regular: getColor('white'),
    },
    border: {
      checked: getColor('redOrange'),
      unchecked: getColor('eerieBlack'),
      disabled: getColor('eerieBlue'),
    },
  },
  height: {
    xs: dimensionTokens['16'],
    sm: dimensionTokens['20'],
    md: dimensionTokens['36'],
    lg: dimensionTokens['44'],
  },
  width: {
    xs: dimensionTokens['16'],
    sm: dimensionTokens['20'],
    md: dimensionTokens['36'],
    lg: dimensionTokens['44'],
    xl: dimensionTokens['100'],
  },
  borderRadius: {
    xs: borderTokens['4'],
    sm: borderTokens['8'],
  },
} as const;

export const phoneInputTokens = {
  color: {
    item: {
      regular: getColor('eerieBlack'),
    },
    label: {
      primary: getColor('eerieBlue'),
    },
    background: {
      regular: getColor('white'),
      hovered: getColor('paleBlue'),
    },
  },
  height: {
    lg: dimensionTokens['70'],
  },
  transform: {
    translateY: 'translateY(10px)',
  },
} as const;

export const checkboxTokens = {
  color: {
    default: {
      checked: getColor('foggyBlue'),
    },
    circle: {
      unchecked: getColor('eerieBlue'),
      checked: getColor('redOrange'),
    },
    rectangle: {
      unchecked: getColor('ghostBlue'),
      checked: getColor('redOrange'),
    },
    background: {
      regular: getColor('white'),
      ghostBlue: getColor('ghostBlue'),
    },
    border: {
      defaultChecked: getColor('eerieBlue'),
      checked: getColor('redOrange'),
      unchecked: getColor('eerieBlue'),
      disabled: getColor('eerieBlue'),
      iconChecked: getColor('eerieBlue'),
    },
  },
  height: {
    xs: dimensionTokens['16'],
    sm: dimensionTokens['20'],
    md: dimensionTokens['36'],
    lg: dimensionTokens['44'],
  },
  width: {
    xs: dimensionTokens['16'],
    sm: dimensionTokens['20'],
    md: dimensionTokens['36'],
    lg: dimensionTokens['44'],
    xl: dimensionTokens['100'],
  },
  borderRadius: {
    xs: borderTokens['4'],
    sm: borderTokens['8'],
    xxl: borderTokens['100'],
  },
} as const;

export const selectTokens = {
  color: {
    item: {
      regular: getColor('eerieBlack'),
    },
    label: {
      regular: getColor('eerieBlack'),
    },
    background: {
      hovered: getColor('paleBlue'),
    },
    description: {
      regular: getColor('eerieBlue'),
    },
    input: {
      regular: getColor('eerieBlack'),
    },
    border: {
      input: { focus: getColor('carolinaBlue') },
    },
    successMessage: getColor('acidGreen'),
  },
  borderRadius: {
    sm: borderTokens['8'],
    md: borderTokens['12'],
  },
  height: {
    md: dimensionTokens['52'],
    lg: dimensionTokens['70'],
  },
  boxShadow: {
    input: '2px 2px 23px rgba(61, 154, 225, 0.07)',
    dropdown: '0px 4px 20px rgba(0, 0, 0, 0.08)',
  },
} as const;

export const streetInputTokens = {
  boxShadow: {
    dropdown: '0px 16px 40px rgba(169, 169, 169, 0.2)',
  },
};

export const pillTokens = {
  color: {
    default: {
      checked: getColor('foggyBlue'),
      unchecked: getColor('ghostBlue'),
      text: getColor('deepBlue'),
    },
  },
  height: {
    xs: dimensionTokens['16'],
    sm: dimensionTokens['44'],
  },
  width: {
    xl: dimensionTokens['200'],
  },
  borderRadius: {
    full: borderTokens['100'],
  },
  gap: {
    xs: dimensionTokens['16'],
  },
} as const;

export const switchTokens = {
  width: {
    md: dimensionTokens['18'],
    xl: dimensionTokens['50'],
  },
  height: {
    md: dimensionTokens['18'],
    lg: dimensionTokens['24'],
  },
  borderRadius: {
    full: dimensionTokens['100'],
  },
  boxShadow: {
    thumb: '0px 5px 10px rgba(0, 0, 0, 0.25)',
  },
  transitions: {
    ease: `color ${appearanceTokens.duration.x3} ${appearanceTokens.timingFunction.ease}`,
  },
} as const;

export const phoneNumberTokens = {
  color: {
    item: {
      regular: getColor('eerieBlack'),
    },
    background: {
      hovered: getColor('paleBlue'),
      neutral: getColor('white'),
    },
    input: {
      regular: getColor('deepBlue'),
      gray: getColor('eerieBlue'),
      white: getColor('white'),
    },
    border: {
      regular: getColor('foggyBlue'),
      input: { focus: getColor('carolinaBlue') },
    },
    successMessage: getColor('pistachio'),
    disabled: '#CECECE',
    error: '#F50000',
  },
  width: {
    sm: dimensionTokens['20'],
    md: dimensionTokens['24'],
    lg: dimensionTokens['30'],
    full: '100%',
  },
  height: {
    sm: dimensionTokens['20'],
    md: dimensionTokens['24'],
    lg: dimensionTokens['40'],
    xl: dimensionTokens['50'],
    xxl: dimensionTokens['52'],
    full: '100%',
  },
  borderRadius: {
    md: borderTokens['12'],
  },
} as const;

export const breadcrumbsTokens = {
  color: {
    breadcrumb: getColor('eerieBlue'),
    breadcrumbItem: getColor('eerieBlack'),
  },
} as const;

export const sidebarTokens = {
  color: {
    default: getColor('eerieBlack'),
    selected: getColor('foggyBlue'),
    focus: getColor('redOrange'),
    white: getColor('white'),
  },
  width: {
    md: dimensionTokens['42'],
    full: '100%',
  },
  height: {
    md: dimensionTokens['42'],
    full: '100%',
  },
} as const;

export type TransitionAnimations = typeof transitionTokens.animations;
export type PopoverAnimations = typeof popoverTokens.animations;
export type HoverMenuAnimations = typeof hoverMenuTokens.animations;
export type MenuTokens = typeof menuTokens;
export type ModalTokens = typeof modalTokens;
export type CardTokens = typeof cardTokens;
