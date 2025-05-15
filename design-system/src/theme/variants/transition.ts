import { CSSObject } from '@mantine/core';
import { TransitionStatus } from 'react-transition-group';

type TransitionType = {
  [K in TransitionStatus]?: CSSObject;
};

interface Variation {
  style: CSSObject;
  transition: TransitionType;
}

type PropsType = {
  duration: number;
};

interface DomPersistantTransitionVariants {
  fade: (props: PropsType) => Variation;
  'slide-down': (props: PropsType) => Variation;
}

export const domPersistantTransitionVariants: DomPersistantTransitionVariants = {
  fade: ({ duration }) => ({
    style: {
      transition: `opacity ${duration}ms ease-in-out`,
      opacity: 0,
    },
    transition: {
      entering: { opacity: 0, display: 'block' },
      entered: { opacity: 1 },
      exiting: { opacity: 0 },
      exited: { opacity: 0, display: 'none' },
    },
  }),
  'slide-down': ({ duration }) => ({
    style: {
      transition: `transform ${duration}ms ease-in-out, opacity ${duration}ms ease-in-out`,
      transform: 'translateY(-100%)',
      opacity: 0,
    },
    transition: {
      entering: { transform: 'translateY(0)', opacity: 1, display: 'block' },
      entered: { transform: 'translateY(0)', opacity: 1, display: 'block' },
    },
  }),
} as const;
