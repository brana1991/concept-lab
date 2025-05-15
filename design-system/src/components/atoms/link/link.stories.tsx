import { Meta, StoryFn } from '@storybook/react';
import { useRef } from 'react';
import Link from '.';
import Text from '../text';
import Flex from '../flex';
import Code from '../code';
import SimpleGrid from '../simple-grid';
import Anchor from './anchor';
import IconImage from '../icon-image';

export default {
  title: 'Big Bang / Atoms / Link',
  component: Link,
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'paper',
      values: [{ name: 'paper', value: '#EFF7FF' }],
    },
  },
} as Meta;

const VariationsDescription = () => (
  <div style={{ marginBottom: '70px' }}>
    <Text variant="variant-5" m="0">
      Ananas Link have 9 different variations.
    </Text>
    <Text variant="variant-5" m="0">
      Link use different text variations and mostly vary in <strong>color</strong> and{' '}
      <strong>background-color</strong> for initial and hover states.
    </Text>
    <Text variant="variant-5" m="0">
      Link can have an icon. Icon position (left/right) is determined based on HTML order. Icon
      color always follows the text color.
    </Text>
    <Text variant="variant-5" m="0">
      Link has a fixed height of <strong>44px</strong> to satisfy the touch area requirements on
      mobile.
    </Text>
  </div>
);

const anchorUsage = `<Anchor variant="link-1" href="https://www.external.com">Anchor 1</Anchor>`;
const linkUsage = `<Link variant="link-1" href="/internal-link">Link 1</Link>`;

const UsageDescription = () => (
  <div style={{ marginBottom: '70px' }}>
    <Text variant="variant-5" mb="x4">
      There are 2 components that can be used.
    </Text>
    <Flex flow="column">
      <Code>{anchorUsage}</Code>
      <Code>{linkUsage}</Code>
    </Flex>
    <Text variant="variant-5" m="0">
      <strong>Anchor</strong> should be used for external links, while <strong>Link</strong> is a
      NextJS wrapper and should be used for internal navigation
    </Text>
  </div>
);

const externalUnstyledUsage = `<a href="/https://www.external.com""><Card/></a>`;
const internalUnstyledUsage = `<Link variation="link-unstyled" href="/internal-link"><a><Card/></a></Link>`;

const LinkUnstyledDescription = () => (
  <div style={{ marginBottom: '70px' }}>
    <Text variant="variant-5" mb="x4">
      Sometimes we need to wrap some custom elements in a Link component without applying the
      variation styles. In that case use <strong>link-unstyled</strong> variation.
    </Text>
    <Text variant="variant-5" mb="x4">
      Use plain <strong>a</strong> tag for external links and Link component for internal.
    </Text>
    <Flex flow="column">
      <Code>{externalUnstyledUsage}</Code>
      <Code>{internalUnstyledUsage}</Code>
    </Flex>
  </div>
);

const Template: StoryFn = () => {
  const anchorRef = useRef(null);
  return (
    <>
      <Text variant="variant-1" mb="x3">
        Ananas Links Style Guide
      </Text>
      <VariationsDescription />

      <div style={{ marginTop: '70px' }} />
      <SimpleGrid gap="6px">
        <Text variant="variant-3">Variations</Text>
        <Flex align="center" flow="wrap">
          <Anchor variant="link-1" href="/anchor" target="_blank" ref={anchorRef}>
            Link 1
          </Anchor>
          <Anchor variant="link-1" href="/anchor" target="_blank">
            Link 1
            <IconImage src="/big-bang/icons/arrow-right-short.svg" />
          </Anchor>
        </Flex>
        <Flex align="center" flow="wrap">
          <Anchor variant="link-2" href="/anchor" target="_blank">
            Link 2
          </Anchor>
          <Anchor variant="link-2" href="/anchor" target="_blank">
            Link 2
            <IconImage src="/big-bang/icons/arrow-right-short.svg" />
          </Anchor>
        </Flex>
        <Flex align="center" flow="wrap">
          <Anchor variant="link-3" href="/anchor" target="_blank">
            Link 3
          </Anchor>

          <Anchor variant="link-3" href="/anchor" target="_blank">
            Link 3 <IconImage src="/big-bang/icons/arrow-right-short.svg" />
          </Anchor>
        </Flex>

        <Flex align="center" flow="wrap">
          <Anchor variant="link-4" href="/anchor" target="_blank">
            Link 4
          </Anchor>

          <Anchor variant="link-4" href="/anchor" target="_blank">
            Link 4 <IconImage src="/big-bang/icons/arrow-right-short.svg" />
          </Anchor>
        </Flex>

        <Flex align="center" flow="wrap">
          <Anchor variant="link-5" href="/anchor" target="_blank">
            Link 5
          </Anchor>

          <Anchor variant="link-5" href="/anchor" target="_blank">
            Link 5 <IconImage src="/big-bang/icons/arrow-right-short.svg" />
          </Anchor>
        </Flex>
        <Flex align="center" flow="wrap">
          <Anchor variant="link-6" href="/anchor" target="_blank">
            Anchor 6
          </Anchor>
          <Anchor variant="link-6" href="/anchor" target="_blank">
            Anchor 6 <IconImage src="/big-bang/icons/arrow-right-1.svg" />
          </Anchor>
        </Flex>
        <Flex align="center" flow="wrap">
          <Anchor variant="link-7" href="/anchor" target="_blank">
            Anchor 7
          </Anchor>
          <Anchor variant="link-7" href="/anchor" target="_blank">
            Anchor 7 <IconImage src="/big-bang/icons/arrow-right-1.svg" />
          </Anchor>
        </Flex>
        <Flex align="center" flow="wrap">
          <Anchor variant="link-8" href="/anchor" target="_blank">
            Anchor 8
          </Anchor>
          <Anchor variant="link-8" href="/anchor" target="_blank">
            Anchor 8 <IconImage src="/big-bang/icons/arrow-right-1.svg" />
          </Anchor>
        </Flex>
        <Flex align="center" flow="wrap">
          <Anchor variant="link-9" href="/anchor" target="_blank">
            Anchor 9
          </Anchor>
          <Anchor variant="link-9" href="/anchor" target="_blank">
            Anchor 9 <IconImage src="/big-bang/icons/arrow-right-1.svg" />
          </Anchor>
        </Flex>

        <Flex align="center" flow="wrap">
          <Anchor variant="link-btn" href="/anchor" target="_blank">
            Link Button
          </Anchor>
          <Anchor variant="link-btn" href="/anchor" target="_blank">
            Link Button
          </Anchor>
        </Flex>
      </SimpleGrid>

      <div style={{ marginTop: '70px' }} />

      <SimpleGrid gap="6px">
        <Text variant="variant-3">Usage</Text>
        <UsageDescription />
        <Text variant="variant-3">Link unstyled</Text>
        <LinkUnstyledDescription />
      </SimpleGrid>
    </>
  );
};

export const Default = Template.bind({});
