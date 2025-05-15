import { Meta, StoryFn } from '@storybook/react';

import Button from './';
import Flex from '../flex';
import SimpleGrid from '../simple-grid';
import Text from '../text';

export default {
  title: 'Big Bang / Atoms / Button',
  component: Button,
  parameters: {
    layout: 'padded',
  },
} as Meta;

const ArrowRight = () => (
  <svg width="13" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M0 5.50012C0 4.94812 0.447301 4.50113 0.999001 4.50113C1.4768 4.50113 7.064 4.50113 8.554 4.50113L5.588 1.50412L6.993 0.0991211L11.707 4.78214C11.903 4.97714 12 5.23913 12 5.50113C12 5.76213 11.902 6.02314 11.707 6.21814L6.993 10.9011L5.588 9.49612L8.554 6.49911C7.064 6.49911 1.4768 6.49911 0.999001 6.49911C0.447301 6.49911 0 6.05212 0 5.50012Z"
      fill="#FE5000"
    />
  </svg>
);

const CartIcon = () => (
  <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1.97659 2.06498C1.42459 2.06033 0.980589 2.52748 0.976589 3.09805C0.972589 3.66862 1.42459 4.12648 1.97659 4.13113C2.71459 4.13732 3.2656 4.66791 3.7576 5.61617C4.2386 6.54274 4.30558 7.2694 4.32058 7.35948L5.5076 15.2689C5.8716 17.1525 7.59959 18.5942 9.41459 18.5942H16.5386C18.3536 18.5942 20.0896 17.1392 20.4456 15.3012C20.4456 15.3012 21.9766 5.54819 21.9766 5.1642C21.9766 4.59363 21.5286 4.13113 20.9766 4.13113C20.6656 4.13113 6.52159 4.12637 5.22659 4.13113C4.45159 2.83265 3.35959 2.07655 1.97659 2.06498ZM12.9766 8.26342C13.5286 8.26342 13.9766 8.72593 13.9766 9.2965V10.3296H14.9766C15.5286 10.3296 15.9766 10.7921 15.9766 11.3626C15.9766 11.9332 15.5286 12.3957 14.9766 12.3957H13.9766V13.4288C13.9766 13.9994 13.5286 14.4619 12.9766 14.4619C12.4246 14.4619 11.9766 13.9994 11.9766 13.4288V12.3957H10.9766C10.4246 12.3957 9.97659 11.9332 9.97659 11.3626C9.97659 10.7921 10.4246 10.3296 10.9766 10.3296H11.9766V9.2965C11.9766 8.72593 12.4246 8.26342 12.9766 8.26342ZM8.47659 19.6272C7.64859 19.6272 6.97659 20.3211 6.97659 21.1769C6.97659 22.0327 7.64859 22.7265 8.47659 22.7265C9.30459 22.7265 9.97659 22.0327 9.97659 21.1769C9.97659 20.3211 9.30459 19.6272 8.47659 19.6272ZM17.4766 19.6272C16.6486 19.6272 15.9766 20.3211 15.9766 21.1769C15.9766 22.0327 16.6486 22.7265 17.4766 22.7265C18.3046 22.7265 18.9766 22.0327 18.9766 21.1769C18.9766 20.3211 18.3046 19.6272 17.4766 19.6272Z"
      fill="#FE5000"
    />
  </svg>
);

const InitialButtons = () => (
  <>
    <Button variant="primary">Primary</Button>
    <Button variant="secondary">Secondary</Button>
    <Button variant="tertiary">Tertiary</Button>
  </>
);

const WithIconButtons = () => (
  <>
    <Button variant="primary" rightIcon={<ArrowRight />}>
      Primary
    </Button>

    <Button variant="secondary" rightIcon={<ArrowRight />}>
      Secondary
    </Button>

    <Button variant="tertiary" rightIcon={<CartIcon />}>
      Tertiary
    </Button>
  </>
);

const LoadingButtons = () => (
  <>
    <Button variant="primary" loading>
      Primary
    </Button>
    <Button variant="secondary" loading>
      Secondary
    </Button>
    <Button variant="tertiary" loading>
      Tertiary
    </Button>
  </>
);

const DisabledButtons = () => (
  <>
    <Button variant="primary" disabled rightIcon={<ArrowRight />}>
      Primary
    </Button>
    <Button variant="secondary" disabled rightIcon={<ArrowRight />}>
      Secondary
    </Button>
    <Button variant="tertiary" disabled rightIcon={<CartIcon />}>
      Tertiary
    </Button>
  </>
);

const Description = () => (
  <div style={{ marginBottom: '50px' }}>
    <Text variant="variant-5" m="0">
      Ananas Design System supports 3 button variations:{' '}
      <strong>primary, secondary, and tertiary.</strong>
    </Text>

    <Text variant="variant-5" m="0">
      Each variation is a different visual representation of a Button component and encapsulates a
      specific group of styles: colors, background-colors, hover, loading and disabled states.
    </Text>

    <Text variant="variant-5" mt="x3">
      If a developer discovers a typography style in Figma that does not match existing variations,
      it is likely to be an error and should be investigated further.
    </Text>
    <Text variant="variant-5" m="0">
      A developer should verify whether designers made a mistake or a new variation needs to be
      added to Ananas Design System
    </Text>
  </div>
);

const Responsiveness = () => (
  <div>
    <Text variant="variant-3" mb="x3">
      Responsive styles
    </Text>
    <Flex>
      <Button
        variant="primary"
        width="100%"
        breakpoints={[
          {
            breakpoint: 'xs',
            width: '45%',
          },
          {
            breakpoint: 'md',
            width: '150px',
          },
        ]}
      >
        Primary
      </Button>
      <Button
        variant="secondary"
        width="100%"
        breakpoints={[
          {
            breakpoint: 'xs',
            width: '45%',
          },
          {
            breakpoint: 'md',
            width: '150px',
          },
        ]}
      >
        Secondary
      </Button>
    </Flex>
  </div>
);

const Variations = () => (
  <SimpleGrid mb="x7">
    <Text variant="variant-3" mb="x3">
      Variations
    </Text>
    <div
      style={{
        gap: '20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: 'repeat(4, 44px)',
        alignItems: 'center',
        justifyItems: 'start',
        width: '50%',
      }}
    >
      <span>Initial</span>
      <InitialButtons />

      <span>Loading</span>
      <LoadingButtons />

      <span>Disabled</span>
      <DisabledButtons />

      <span>With icon</span>
      <WithIconButtons />
    </div>
  </SimpleGrid>
);

const TemplateList: StoryFn = () => {
  return (
    <>
      <Text variant="variant-1" mb="x3">
        Ananas Buttons Style Guide
      </Text>
      <Description />

      <Variations />
      <Responsiveness />
    </>
  );
};

export const Default = TemplateList.bind({});
