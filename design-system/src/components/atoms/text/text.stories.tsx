import { Meta, StoryFn } from '@storybook/react';
import Box from '../box';
import SimpleGrid from '../simple-grid';
import Text from '../text';
import { ReactNode } from 'react';

export default {
  title: 'Big Bang / Atoms / Text',
  component: Text,
  parameters: {
    layout: 'padded',
  },
} as Meta<typeof Text>;

const Title = ({ children }: { children: ReactNode }) => (
  <Text variant="variant-1" mb="x3">
    {children}
  </Text>
);
const Description = () => (
  <div style={{ marginBottom: '70px' }}>
    <Text variant="variant-5" m="0">
      Ananas Typography is made of 10 different variations.
    </Text>
    <Text variant="variant-5" m="0">
      Each variation is a different visual representation of a Text component and encapsulates a
      specific group of styles.
    </Text>
    <Text variant="variant-5" m="0">
      Typography variations generally include properties such as font size, font weight, line
      height, and letter spacing, but it should be noted that it is not limited to just these
      properties.
    </Text>
    <Text variant="variant-5" m="0">
      Every existing variation can be extended by passing different utility props such as{' '}
      <strong>underline, strikethrough, line clamp etc... </strong>
    </Text>

    <Text variant="variant-5" mt="x3">
      It`s important to notice that Text component renders a <strong>paragraph element</strong> by
      default.
    </Text>
    <Text variant="variant-5" m="0">
      A developer is responsible for ensuring proper use of semantic HTML elements and should make
      certain that the appropriate HTML element is used in the correct context.
    </Text>
    <Text variant="variant-5" m="0">
      Follow the{' '}
      <a
        target="_blank"
        href={'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements'}
        rel="noreferrer"
      >
        link{' '}
      </a>
      for more details on semantics.
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

const Example = ({ title, children }: { title: string; children: ReactNode }) => {
  return (
    <Box mb="x3">
      <h3 style={{ color: 'red', margin: 0 }}>{title}</h3>
      {children}
    </Box>
  );
};

const Template: StoryFn<typeof Text> = () => {
  return (
    <>
      <Title>Ananas Typography Style Guide</Title>
      <Description />

      <SimpleGrid>
        <Example title="variant-1">
          <Text variant="variant-1">
            Open Sans Bold 30px | Line Height 1.1 | Letter Spacing -1px
          </Text>
        </Example>
        <Example title="variant-2">
          <Text variant="variant-2">
            Open Sans Bold 25px | Line Height 1 | Letter Spacing -0.5 px
          </Text>
        </Example>
        <Example title="variant-3">
          <Text variant="variant-3">
            Open Sans Bold 20px | Line Height 1.2 | Letter Spacing -0.3 px
          </Text>
        </Example>
        <Example title="variant-4">
          <Text variant="variant-4">
            Open Sans Bold 16px | Line Height 1.1 | Letter Spacing 0.3 px
          </Text>
        </Example>
        <Example title="variant-5">
          <Text variant="variant-5">Open Sans Regular 15px | Line Height 1.4</Text>
        </Example>
        <Example title="variant-6">
          <Text variant="variant-6">Open Sans Regular 14px | Line Height 1.1</Text>
        </Example>
        <Example title="variant-7">
          <Text variant="variant-7">
            Open Sans Regular 13px | Line Height 1.2 | Letter Spacing 0.2 px
          </Text>
        </Example>
        <Example title="variant-8">
          <Text variant="variant-8">Open Sans Bold 13px | Line Height 1.7</Text>
        </Example>
        <Example title="variant-9">
          <Text variant="variant-9">Open Sans Bold 12px | Line Height 1.1</Text>
        </Example>
        <Example title="variant-10">
          <Text variant="variant-10">Open Sans Bold 11px | Line Height 1.3</Text>
        </Example>
      </SimpleGrid>
    </>
  );
};

export const Variations = Template.bind({});
