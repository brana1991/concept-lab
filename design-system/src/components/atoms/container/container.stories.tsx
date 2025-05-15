import { Meta, StoryFn } from '@storybook/react';
import Container from './index';

export default {
  title: 'Big Bang / Atoms / Container',
  component: Container,
  parameters: {
    layout: 'none',
    backgrounds: {
      default: 'body',
      values: [{ name: 'body', value: '#EFF7FF' }],
    },
  },
} as Meta;

const Template: StoryFn = () => {
  return (
    <>
      <Container>
        <h2 style={{ margin: '0 0 8px 0' }}>Container component</h2>
        <h4 style={{ margin: '0 0 8px 0' }}>
          Container is most basic layout element. It is used to contain content of the page in a
          predicted frame.
        </h4>
        <p>
          Almost always it should be used for defining sections in a document. That&apos;s why it
          returns <b>{'<section>'}</b> by default. All Containers are fluid with 16px padding on
          sides, and they stay fluid until lg breakpoint(1280px). Max-width of container is 1280px.
          <br />
          This component is meant to hold <b>vertical spacings</b> between sections. They should be
          applied through mb, mt props (x1,x2,x3 …).
        </p>
        <p style={{ margin: '8px 0' }}>Container has 3 variants :</p>
        <ul style={{ marginLeft: '8px', marginBottom: '8px' }}>
          <li>regular</li>
          <li>featured-orange</li>
          <li>featured-white</li>
        </ul>
        <p>
          Featured variants are essentially colored box-cards that are full-width on mobile and
          fixed dimensions on desktop screens.
        </p>
        <p style={{ marginTop: '16px' }}>Variants preview:</p>
      </Container>

      <Container mt="x6" mb="x6" pb="x7" pt="x7">
        This is regular container
      </Container>
      <Container variant="featured-orange" mt="x6" mb="x6" pb="x7" pt="x7">
        This is featured-orange container
      </Container>
      <Container variant="featured-white" mt="x6" mb="x6" pb="x7" pt="x7">
        This is featured-white container
      </Container>
    </>
  );
};

export const Default = Template.bind({});
