import accordion from './accordion';
import actionIcon from './action-icon';
import button from './button';
import cards from './cards';
import carousel from './carousel';
import container from './container';
import divider from './divider';
import drillDownItem from './drill-down-item';
import link from './link';
import modal from './modal';
import pill from './pill';
import text from './text';
import icon from './icon';
import { TextInputVariantParams, textInputVariants } from './text-input';
import { domPersistantTransitionVariants } from './transition';

export const variants = {
  accordion,
  text,
  divider,
  textInput: textInputVariants,
  button,
  container,
  modal,
  link,
  cards,
  pill,
  drillDownItem,
  carousel,
  actionIcon,
  icon,

  domPersistantTransition: domPersistantTransitionVariants,
} as const;

export type Variants = typeof variants;
export type { TextInputVariantParams };
