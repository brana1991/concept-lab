import { CopyButton, Group, List, SimpleGrid, Tooltip } from '@mantine/core';
import { Meta, StoryFn } from '@storybook/react';
import Text from '../text';
import ActionIcon from './index';
import Code from '../code';
import IconImage from '../icon-image';
import Flex from '../flex';
import { homeOutline, heart } from 'ionicons/icons';

export default {
  title: 'Big Bang / Atoms / Action Icon',
  component: ActionIcon,
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'paper',
      values: [{ name: 'paper', value: '#EFF7FF' }],
    },
  },
} as Meta;

const codeInlineSVGIcon = `
<ActionIcon  hoverColor="red">
<Wishlist />
</ActionIcon>
`;

const codeIconImageSVGIcon = `
<ActionIcon title="Cart Icon" hoverColor="carolinaBlue">
<IconImage src="/big-bang/icons/cart-plus-fill.svg" />
</ActionIcon>
`;

const Template: StoryFn = () => {
  return (
    <div>
      <Text variant="variant-1" mb="x3">
        Ananas Icons and Button Icons Style Guide
      </Text>

      <Text variant="variant-5" m="0">
        All available icon in the project you can find inside Available icons story page. If there
        are new icons that are added later on and are missing inside this page, developer must add
        them to the list.
      </Text>
      <Text variant="variant-5" mt="x2">
        There are two things to keep in mind regarding on how to use icons in the project:
      </Text>
      <List withPadding>
        <List.Item>
          using inline SVG can increase HTML DOM structure and go over AWS deployment limit of 1MB
        </List.Item>
        <List.Item>
          using SVG as an image can create a lot of Network calls in order to get all images
        </List.Item>
      </List>

      <Text variant="variant-5" mt="x2">
        The solution is to balance between these two approaches. Current implementation will load
        inline SVG for components that are shown on every page, for example: <strong>Header</strong>{' '}
        and <strong>Footer</strong> component icons.
      </Text>

      <Text variant="variant-3" mt="x6" mb="x3">
        Variants
      </Text>
      <Group sx={{ background: '#EFF7FF', padding: 24, width: 'fit-content' }}>
        <Tooltip label="default" withArrow>
          <ActionIcon hoverColor="acidGreen" variant="default">
            <img src={heart} color="red" />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="outline" withArrow>
          <ActionIcon hoverColor="red" color='carolinaBlue' variant="outline">
            {heart}
            <img src={heart} color="red" />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="transparent" withArrow>
          <ActionIcon hoverColor="red" variant="transparent">
            <img src={heart} color="red" />
          </ActionIcon>
        </Tooltip>
      </Group>

      <Text variant="variant-3" mt="x6" mb="x3">
        Usage
      </Text>
      <Text variant="variant-5">
        Action icons represent icon as a button that will trigger some action. ActionIcon component
        require single child to be passed which is inline SVG component or IconImage component with{' '}
        <strong>src</strong> path attribute to icon. <strong>title</strong> property represents
        aria-label property. Check{' '}
        <a target="blank" href="https://mantine.dev/core/action-icon/#accessibility">
          Mantine doc
        </a>{' '}
        for more info about accessibility.
      </Text>
      <Text variant="variant-6" mt="x4">
        Inline svg style example:
      </Text>
      <Group sx={{ marginTop: 8 }}>
        <ActionIcon hoverColor="red">{/* <WishlistIcon /> */}</ActionIcon>
        <Code>{codeInlineSVGIcon}</Code>
      </Group>
      <Text variant="variant-6" mt="x4">
        Icon image svg style example:
      </Text>
      <Group sx={{ marginTop: 8 }}>
        <ActionIcon hoverColor="carolinaBlue">
          <IconImage src="/big-bang/icons/cart-plus-fill.svg" />
        </ActionIcon>
        <Code>{codeIconImageSVGIcon}</Code>
      </Group>

      <Text variant="variant-6" mt="x4">
        It`s important to note that color and hover color can be set for each icon individually, by
        passing <strong>color and hoverColor</strong> props. This is very useful when icon is a
        standalone component and it`s color is not related to the color of the parent.
      </Text>
      <Text variant="variant-6" mt="x2">
        On the other hand, if icon is part of the parent component, icon color can be set on the
        parent level by setting a CSS Variable <strong>--icon-color</strong>.
      </Text>
      <Text variant="variant-6" mt="x2">
        Good point of reference are <strong>Button, Badge and Link</strong> components.
      </Text>
    </div>
  );
};

const icons = [{ src: homeOutline }];

const IconWithCopy = ({ src }: { src: string }) => {
  return (
    <CopyButton value={src}>
      {({ copied, copy }) => (
        <Tooltip
          color={copied ? 'greenHill' : 'eerieBlack'}
          label={<Text variant="variant-5">{copied ? 'Path copied' : `Click to copy path`}</Text>}
          withArrow
        >
          <ActionIcon onClick={copy} hoverColor="redOrange">
            <img src={src} />
          </ActionIcon>
        </Tooltip>
      )}
    </CopyButton>
  );
};

const Icons = () => (
  <>
    <Text variant="variant-2" pb="x7">
      List of all icons:
    </Text>
    <Flex justify="center" align="center" mt="x7">
      <SimpleGrid cols={6}>
        {icons.map((item, index) => (
          <IconWithCopy key={index} src={item.src} />
        ))}
      </SimpleGrid>
    </Flex>
  </>
);

export const Default = Template.bind({});
export const AvailableIcons = Icons.bind({});
