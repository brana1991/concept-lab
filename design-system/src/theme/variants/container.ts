import { breakpoints } from './../tokens/breakpoints';
import { containerTokens } from './../tokens/components';
import { getColor, colorAliases, ColorKeys } from './../tokens/colors';

const baseStyles = {
  width: '100%',
  maxWidth: containerTokens.maxWidth.x1,
  paddingLeft: containerTokens.padding.x1,
  paddingRight: containerTokens.padding.x1,
  marginLeft: 'auto',
  marginRight: 'auto',

  [`@media (min-width: ${breakpoints.lg}px)`]: {
    paddingLeft: 'unset',
    paddingRight: 'unset',
  },
};

const featuredBase = {
  boxSizing: 'content-box',

  [`@media (min-width: ${breakpoints.lg}px)`]: {
    paddingLeft: '32px',
    paddingRight: '32px',
    borderRadius: containerTokens.radius.x1,
  },
} as const;

const container = {
  regular: {
    root: {
      ...baseStyles,
    },
  },
  'featured-white': {
    root: {
      ...baseStyles,
      ...featuredBase,
      background: colorAliases.white,
    },
  },
  'featured-orange': {
    root: {
      ...baseStyles,
      ...featuredBase,
      background: getColor(colorAliases.primaryColor as ColorKeys),
    },
  },
};

export default container;
