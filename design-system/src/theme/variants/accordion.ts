import { CSSObject } from '@mantine/core';

const baseAccordion = {
  item: {} as CSSObject,
  chevron: {} as CSSObject,
  content: {} as CSSObject,
};

const regularAccordion = {
  item: {
    ...baseAccordion.item,
  } as CSSObject,
  content: {
    ...baseAccordion.content,
  } as CSSObject,
  chevron: {
    ...baseAccordion.chevron,
  } as CSSObject,
};

const deg90Accordion = {
  item: {
    ...baseAccordion.item,
  } as CSSObject,
  content: {
    ...baseAccordion.content,
  } as CSSObject,
  chevron: {
    ...baseAccordion.chevron,

    '&[data-rotate]': {
      transform: 'rotate(90deg)',
    },
  } as CSSObject,
};

const stretchedAccordion = {
  item: {
    ...baseAccordion.item,
    button: {
      paddingLeft: 0,
      paddingRight: 0,

      ':hover': {
        background: 'transparent',
      },
    },
  } as CSSObject,
  content: {
    ...baseAccordion.content,
    padding: '0 0 16px 0',
  } as CSSObject,
  chevron: {
    ...baseAccordion.chevron,
  } as CSSObject,
};

const buttonVariants = {
  regular: regularAccordion,
  '90deg-rotation': deg90Accordion,
  stretched: stretchedAccordion,
};

export default buttonVariants;
