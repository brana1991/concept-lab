import { List } from '@mantine/core';
import { Meta, StoryFn } from '@storybook/react';
import Box from '../box';
import Divider from './';
import Text from '../text';
import Code from '../code';

export default {
  title: 'Big Bang / Atoms / Divider',
  component: Divider,
  parameters: {
    layout: 'padded',
  },
} as Meta;

const codeRegularHorizontal = `
  <Divider variant="regular" />
`;
const codeRegularVertical = `
  <Divider variant="regular" orientation="vertical" />
`;

const codeSmallHorizontal = `
  <Divider variant="small" />
`;
const codeSmallVertical = `
  <Divider variant="small" orientation="vertical" />
`;

const Template: StoryFn = () => {
  return (
    <Box>
      <Text variant="variant-1" mb="x3">
        Ananas divider component
      </Text>

      <Text variant="variant-5" m="0">
        Divider component is used to create content divider spacer. It have vertical and horizontal
        orienations.
      </Text>

      <h2>Usage</h2>
      <List withPadding>
        <List.Item>Add one of the two variants: regular or small</List.Item>
        <List.Item>Add orientation: vertical or horizontal</List.Item>
      </List>

      <h2>Examples</h2>
      <Box>
        <h3>Regular</h3>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '220px max-content',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              paddingRight: 20,
            }}
          >
            <Divider variant="regular" />
          </Box>
          <Code>{codeRegularHorizontal}</Code>
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '220px max-content',
            alignItems: 'center',
            marginTop: 12,
          }}
        >
          <Divider orientation="vertical" />
          <Code>{codeRegularVertical}</Code>
        </Box>
      </Box>
      <Box>
        <h3>Small</h3>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '220px max-content',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              paddingRight: 20,
            }}
          >
            <Divider variant="small" />
          </Box>
          <Code>{codeSmallHorizontal}</Code>
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '220px max-content',
            alignItems: 'center',
            marginTop: 12,
          }}
        >
          <Divider variant="small" orientation="vertical" />
          <Code>{codeSmallVertical}</Code>
        </Box>
      </Box>
    </Box>
  );
};

export const Default = Template.bind({});
