import { spacingTokens } from './../../tokens/spacing';
import { getColor } from './../../tokens/colors';
import { cardTokens } from './../../tokens/components';
import { breakpoints } from './../../tokens/breakpoints';
import { appearanceTokens } from './../../tokens/appearance';
import { CSSObject } from '@mantine/core';

interface ProductCardClassNames {
  root: CSSObject;
  image?: CSSObject;
  wishlistIcon?: CSSObject;
  newBadge?: CSSObject;
  discountBadge?: CSSObject;
  outOfStockBadge?: CSSObject;
  info?: CSSObject;
  infoTitle?: CSSObject;
  infoPrice?: CSSObject;
  sellablePrice?: CSSObject;
  basePricePrice?: CSSObject;
  outOfStockImage?: CSSObject;
}

export interface ProductCardVariants {
  plain: (isOutOfStock: boolean) => ProductCardClassNames;
  light: (isOutOfStock: boolean) => ProductCardClassNames;
}

const horizontalSpacing = '4px';
const verticalSpacing = spacingTokens.x1;

const baseBadge: CSSObject = {
  position: 'absolute',
  zIndex: cardTokens.product.zIndex.x1,
};

const baseCardRoot: CSSObject = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacingTokens.x2,
  cursor: 'pointer',
};

type baseCardImageProps = (isOutOfStock: boolean) => CSSObject;

const baseCardImage: baseCardImageProps = (isOutOfStock) => {
  return {
    width: '100%',
    paddingTop: '105%',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: appearanceTokens.border.x8,

    ...(isOutOfStock
      ? {
          '::before': {
            content: "''",
            position: 'absolute',
            top: 0,
            background: getColor('foggyBlue'),
            width: '100%',
            height: '100%',
          },
        }
      : {}),
  };
};

const baseDiscountBadge: CSSObject = {
  ...baseBadge,
  top: verticalSpacing,
  left: horizontalSpacing,
};

const baseNewBadge: CSSObject = {
  ...baseBadge,
  bottom: verticalSpacing,
  right: horizontalSpacing,
};

const baseOutOfStockBadge: CSSObject = {
  ...baseBadge,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
};

const baseWishlistIcon: CSSObject = {
  ...baseBadge,
  top: verticalSpacing,
  right: horizontalSpacing,
};

const baseInfo: CSSObject = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacingTokens.x2,
  alignItems: 'flex-start',
};

const baseInfoTitle: CSSObject = {
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  whiteSpace: 'normal',
};

const baseInfoPrice: CSSObject = {
  display: 'flex',
  gap: '0',
  flexDirection: 'column-reverse',
  color: getColor('eerieBlack'),

  [`@media (min-width: ${breakpoints.md}px)`]: {
    gap: '4px',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
};

const baseOutOfStockImage: CSSObject = {
  opacity: appearanceTokens.opacity.x2,
};

export const productVariants: ProductCardVariants = {
  plain: (isOutOfStock) => ({
    root: baseCardRoot,
    image: baseCardImage(isOutOfStock),
    discountBadge: baseDiscountBadge,
    newBadge: baseNewBadge,
    outOfStockBadge: baseOutOfStockBadge,
    wishlistIcon: baseWishlistIcon,
    info: baseInfo,
    infoTitle: {
      ...baseInfoTitle,
      textTransform: 'uppercase',
    },
    infoPrice: baseInfoPrice,
    sellablePrice: { color: getColor('eerieBlack') },
    basePricePrice: {
      color: getColor('redOrange'),
    },
    outOfStockImage: baseOutOfStockImage,
  }),
  light: (isOutOfStock) => ({
    root: baseCardRoot,
    image: baseCardImage(isOutOfStock),
    discountBadge: baseDiscountBadge,
    newBadge: baseNewBadge,
    outOfStockBadge: baseOutOfStockBadge,
    wishlistIcon: baseWishlistIcon,
    info: baseInfo,
    infoTitle: {
      ...baseInfoTitle,
      textTransform: 'uppercase',
      color: getColor('white'),
    },
    infoPrice: {
      ...baseInfoPrice,
      color: getColor('white'),
    },
    sellablePrice: { color: getColor('white') },
    basePricePrice: {
      color: getColor('skinPink'),
    },
    outOfStockImage: baseOutOfStockImage,
  }),
};
