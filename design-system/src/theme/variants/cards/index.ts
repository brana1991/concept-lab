import { ProductCardVariants, productVariants } from './product-card';

interface CardVariants {
  product: ProductCardVariants;
}

const cardsVariants: CardVariants = {
  product: productVariants,
};

export default cardsVariants;
