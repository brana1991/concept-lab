import { Meta, StoryFn } from '@storybook/react';
import Box from '../box';
import Code from '../code';
import SimpleGrid from '../simple-grid';

export default {
  title: 'Big Bang / Atoms / Simple Grid',
  component: SimpleGrid,
  parameters: {
    layout: 'padded',
  },
} as Meta;

const responsiveCodeSnippet = `
<SimpleGrid
cols={1}
breakpoints={[
  { breakpoint: "xs", cols: 2 },
  { breakpoint: "sm", cols: 3 },
  { breakpoint: "md", cols: 4 },
  { breakpoint: "lg", cols: 5 },
]}
>
<Box sx={{ backgroundColor: "rgb(231, 245, 255)", padding: "16px", textAlign: "center" }}>
  1
</Box>
<Box sx={{ backgroundColor: "rgb(231, 245, 255)", padding: "16px", textAlign: "center" }}>
  2
</Box>
<Box sx={{ backgroundColor: "rgb(231, 245, 255)", padding: "16px", textAlign: "center" }}>
  3
</Box>
<Box sx={{ backgroundColor: "rgb(231, 245, 255)", padding: "16px", textAlign: "center" }}>
  4
</Box>
<Box sx={{ backgroundColor: "rgb(231, 245, 255)", padding: "16px", textAlign: "center" }}>
  5
</Box>
`;

const Intro = () => (
  <>
    <h2 style={{ margin: '0 0 8px 0' }}>Simple Grid</h2>
    <p>
      Simple-grid is a css-grid based component where each child is treated as a column.{' '}
      <b>Each column takes an equal amount of space.</b>
    </p>
    <p style={{ marginTop: '8px' }}>It is an ideal accelerator for creating :</p>
    <ul>
      <li style={{ marginLeft: '16px' }}>
        Simple grid layouts like equally sized lists(products,categories,)
      </li>
      <li style={{ marginLeft: '16px' }}>
        Top level(Sections,Pages) columns that distribute space evenly.
      </li>
    </ul>
    <p style={{ marginTop: '8px' }}>
      For creating more complex grid layouts create custom grid component by abstracting Box
      component.
    </p>
    <h2 style={{ margin: '15px 0 0' }}>Usage</h2>
  </>
);

const BasicUsage = () => (
  <>
    <h3 style={{ marginTop: 10 }}>4 column layout:</h3>
    <SimpleGrid cols={4}>
      <Box sx={{ backgroundColor: 'rgb(231, 245, 255)', padding: '16px', textAlign: 'center' }}>
        1
      </Box>
      <Box sx={{ backgroundColor: 'rgb(231, 245, 255)', padding: '16px', textAlign: 'center' }}>
        2
      </Box>
      <Box sx={{ backgroundColor: 'rgb(231, 245, 255)', padding: '16px', textAlign: 'center' }}>
        3
      </Box>
      <Box sx={{ backgroundColor: 'rgb(231, 245, 255)', padding: '16px', textAlign: 'center' }}>
        4
      </Box>
    </SimpleGrid>
  </>
);

const ResponsiveLayout = () => (
  <>
    <h3>Responsive:</h3>
    <p>In this example:</p>
    <ul style={{ marginBottom: '16px' }}>
      <li style={{ marginLeft: '16px' }}>screen width {'<'} 640px = 1 column </li>
      <li style={{ marginLeft: '16px' }}>screen width {'>'} 640px(xs) = 2 columns </li>
      <li style={{ marginLeft: '16px' }}>screen width {'>'} 768px(sm) = 3 columns </li>
      <li style={{ marginLeft: '16px' }}>screen width {'>'} 1024px(md) = 4 columns </li>
      <li style={{ marginLeft: '16px' }}>screen width {'>'} 1280px(lg) = 5 columns </li>
    </ul>
    <SimpleGrid
      cols={1}
      breakpoints={[
        { breakpoint: 'xs', cols: 2 },
        { breakpoint: 'sm', cols: 3 },
        { breakpoint: 'md', cols: 4 },
        { breakpoint: 'lg', cols: 5 },
      ]}
    >
      <Box sx={{ backgroundColor: 'rgb(231, 245, 255)', padding: '16px', textAlign: 'center' }}>
        1
      </Box>
      <Box sx={{ backgroundColor: 'rgb(231, 245, 255)', padding: '16px', textAlign: 'center' }}>
        2
      </Box>
      <Box sx={{ backgroundColor: 'rgb(231, 245, 255)', padding: '16px', textAlign: 'center' }}>
        3
      </Box>
      <Box sx={{ backgroundColor: 'rgb(231, 245, 255)', padding: '16px', textAlign: 'center' }}>
        4
      </Box>
      <Box sx={{ backgroundColor: 'rgb(231, 245, 255)', padding: '16px', textAlign: 'center' }}>
        5
      </Box>
    </SimpleGrid>
    <h4>Code snippet:</h4>
    <SimpleGrid cols={2}>
      <Code>{responsiveCodeSnippet}</Code>
    </SimpleGrid>
  </>
);

const Template: StoryFn = () => {
  return (
    <>
      <Intro />
      <BasicUsage />
      <ResponsiveLayout />
    </>
  );
};

export const Default = Template.bind({});
