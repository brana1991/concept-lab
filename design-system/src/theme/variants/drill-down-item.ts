import { menuItemTokens } from './../tokens/components';
import { colorAliases, ColorKeys, getColor } from './../tokens/colors';
import textVariants from './text';

const filledWhiteBox = {
  root: {
    padding: '11px 24px',
    ...textVariants['variant-8'],
    textAlign: 'left',
    height: menuItemTokens.height.x2,
    justifyContent: 'flex-start',
    color: getColor('black'),
    background: 'transparent',
    transition: menuItemTokens.transitions.ease,

    '&[data-active], &[data-expanded], &:active': {
      backgroundColor: getColor('white'),
      color: getColor(colorAliases.primaryColor as ColorKeys),

      picture: {
        background: getColor(colorAliases.primaryColor as ColorKeys),
      },

      svg: {
        path: {
          color: getColor(colorAliases.primaryColor as ColorKeys),
        },
      },
    },

    '@media(hover)': {
      ':hover': {
        color: getColor('black'),
        backgroundColor: 'transparent',

        '&[data-active], &[data-expanded], &:active': {
          backgroundColor: getColor('white'),
          color: getColor(colorAliases.primaryColor as ColorKeys),
        },
      },
    },
  },
  rightSection: {},
  label: { fontSize: 'unset', fontFamily: 'unset', lineHeight: 'unset' },
  children: {
    backgroundColor: getColor('white'),
  },
};

const drillDownVariant = {
  'filled-white-box': filledWhiteBox,
};

export default drillDownVariant;
