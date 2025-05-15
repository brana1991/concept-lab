import { getColor } from './../tokens/colors';
import { appearanceTokens } from './../tokens/appearance';

const modalVariants = {
  'fluid-bottom-placed': {
    root: {
      zIndex: appearanceTokens.zIndex.modal,
    },
    inner: {
      padding: 0,
    },
    modal: {
      width: '100%',
      padding: '0 !important',
      borderRadius: 0,
      backgroundColor: getColor('white'),
      alignSelf: 'end',
      boxShadow: appearanceTokens.shadow.bottom,
    },
  },
} as const;

export default modalVariants;
