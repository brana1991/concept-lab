import { Meta, StoryFn } from '@storybook/react';

import Code from '../code';
import Flex from '../flex';
import Text from '../text';
import Loader from './index';

export default {
  title: 'Big Bang / Atoms / Loader',
  component: Loader,
  parameters: {
    layout: 'padded',
  },
} as Meta;

const codeRegularLoader = `<Loader />`;

const Template: StoryFn = () => {
  return (
    <div>
      <Text variant="variant-1" mb="x3">
        Ananas loader Style Guide
      </Text>

      <Text variant="variant-5" m="0">
        Loader represents loader component that will be loaded on specific places where data
        fetching is present or where we need to wait for some action to be completed. Loader has
        only one variation.
      </Text>
      <Text variant="variant-3" mt="x6" mb="x3">
        Usage
      </Text>
      <Flex align="center">
        <Loader />
        <Code>{codeRegularLoader}</Code>
      </Flex>
    </div>
  );
};

export const Default = Template.bind({});
