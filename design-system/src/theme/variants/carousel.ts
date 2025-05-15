import { spacingTokens } from './../tokens/spacing';
import { carouselTokens } from './../tokens/components';
import { borderTokens } from './../tokens/sizes';

const dotsIndicators = {
  indicatorsRoot: {
    marginTop: spacingTokens.x3,
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0 10px',
    listStyle: 'none',
  },

  button: {
    cursor: 'pointer',
    padding: '14px 8px',
    margin: '-14px -8px',
    background: 'unset',

    span: {
      display: 'inline-block',
      height: carouselTokens.indicators.width.x1,
      width: carouselTokens.indicators.height.x1,
      background: carouselTokens.indicators.color.dotsInactiveColor,
      borderRadius: `${borderTokens[50]}%`,
      transition: 'all 1s ease',
    },

    "&[data-active='true']": {
      padding: '14px 8px',

      span: {
        width: 20,
        height: 5,
        background: carouselTokens.indicators.color.dotsActiveColor,
        borderRadius: borderTokens[100],
      },
    },
  },
} as const;

const navigationControlsShared = {
  position: 'absolute',
  top: '50%',
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  transform: 'translateY(-50%)',
} as const;

const arrowButtonShared = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: carouselTokens.navigation.button.width.x1,
  height: carouselTokens.navigation.button.height.x1,
  borderRadius: `${borderTokens[50]}%`,
  cursor: 'pointer',
} as const;

const arrowBase = {
  display: 'flex',
  width: '14px',
  height: '3px',
  borderBottomLeftRadius: '10px',
  borderTopLeftRadius: '10px',
  position: 'relative',
  background: 'var(--arrow-color)',

  '&:after': {
    content: "''",
    position: 'absolute',
    right: '0',
    top: '-3px',
    width: '9px',
    height: '9px',
    borderTop: 'solid 3px var(--arrow-color)',
    borderRight: 'solid 3px var(--arrow-color)',
    transform: 'rotate(45deg)',
    borderTopRightRadius: '6px',
    borderBottomLeftRadius: '22px',
  },
} as const;

const arrowControls = {
  navigationRoot: {
    ...navigationControlsShared,
  } as const,

  prevButton: {
    ...arrowButtonShared,
    transform: 'translateX(-50%)',

    span: {
      transform: 'rotate(180deg)',
    },
  } as const,

  nextButton: {
    ...arrowButtonShared,
    transform: 'translateX(50%)',
  },

  arrow: {
    ...arrowBase,
  },
} as const;

const carouselVariants = {
  indicators: {
    'dots-indicators': dotsIndicators,
  },
  navigation: {
    'arrow-controls': arrowControls,
  },
};

export default carouselVariants;
