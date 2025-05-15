import { Meta, StoryFn } from '@storybook/react';
import Flex from './';
import FlexItem from './item';

export default {
  title: 'Big Bang / Atoms / Flex',
  component: Flex,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    justify: {
      name: 'Flex Container justify content property',
      defaultValue: 'flex-start',
      control: 'text',
    },
    flow: {
      name: 'Flex Container flow property',
      defaultValue: 'row',
      control: 'text',
    },
    width1: {
      name: 'Flex item 1 width',
      defaultValue: '50%',
      control: 'text',
    },
    width2: {
      name: 'Flex item 2 width',
      defaultValue: '50%',
      control: 'text',
    },
    flex1: {
      name: 'Flex item 1 flex property',
      defaultValue: '0 1 auto',
      control: 'text',
    },
    flex2: {
      name: 'Flex item 2 flex property',
      defaultValue: '0 1 auto',
      control: 'text',
    },
    order1: {
      name: 'Flex item 1 order property',
      defaultValue: '1',
      control: 'text',
    },
    order2: {
      name: 'Flex item 2 order property',
      defaultValue: '2',
      control: 'text',
    },
    breakpoints1: {
      name: 'Flex item 1 breakpoints',
      defaultValue: [{ breakpoint: 'lg' }],
      control: 'object',
    },
    breakpoints2: {
      name: 'Flex item 2 breakpoints',
      defaultValue: [{ breakpoint: 'lg' }],
      control: 'object',
    },
  },
} as Meta;

const About = () => (
  <>
    <h2 style={{ margin: '0 0 8px 0' }}>Flexbox system</h2>
    <h4 style={{ margin: '0 0 8px 0' }}>When to use flexbox? Consider the following.</h4>
    <p>A simple question to ask yourself when deciding between grid or flexbox is:</p>
    <ul>
      <li style={{ marginLeft: '16px' }}>
        Do I only need to control the layout by row or column – <b>use a flexbox</b>
      </li>
      <li style={{ marginLeft: '16px' }}>
        Do I need to control the layout by row and column – <b>use a grid</b>
      </li>
    </ul>
    <p style={{ marginTop: '16px' }}>
      In addition to the one-dimensional versus two-dimensional distinction, there is another way to
      decide if you should use flexbox or grid for a layout:
    </p>
    <ul style={{ marginBottom: '16px' }}>
      <li style={{ marginLeft: '16px' }}>
        Content out - <b>use a flexbox</b>
      </li>
      <li style={{ marginLeft: '16px' }}>
        Layout in - <b>use a grid</b>
      </li>
    </ul>
    <p style={{ marginBottom: '16px', maxWidth: '1200px' }}>
      Flexbox works from the content out. An ideal use case for flexbox is when you have a set of
      items and want to space them out evenly in a container. You let the size of the content decide
      how much individual space each item takes up. If the items wrap onto a new line, they will
      work out their spacing based on their size and the available space on that line. <br />
      When you wrap flex items, each new row (or column when working by column) is an independent
      flex line in the flex container. Space distribution happens across the flex line.
    </p>
    <h4 style={{ margin: '0 0 8px 0' }}>Component defaults:</h4>
    <ul style={{ margin: '0 0 8px 0' }}>
      <li style={{ marginLeft: '8px', listStyle: 'none' }}>Flex-Container:</li>
      <li style={{ marginLeft: '32px' }}>flex-flow: row no-wrap;</li>
      <li style={{ marginLeft: '32px' }}>gap: 16px;</li>
      <li style={{ marginLeft: '8px', listStyle: 'none' }}>Flex-Item:</li>
      <li style={{ marginLeft: '32px' }}>flex: 0 1 auto;</li>
    </ul>
    Flex item component works in conjunction with the container but its not obligatory. Use
    Flex-item only when in need of controlling flex-items(width, flex, order …). In this way, we can
    avoid extensive DOM size.
    <p>
      Both flex components could control <b>background, border, and border-radius </b>throughout
      media queries.
    </p>
  </>
);

const Basic = () => (
  <>
    <h2 style={{ margin: '16px 0 8px 0' }}>Usage:</h2>
    <Flex>
      <FlexItem width="33%" background="ghostBlue" p="16px">
        1
      </FlexItem>
      <FlexItem width="33%" background="ghostBlue" p="16px">
        1
      </FlexItem>
      <FlexItem width="33%" background="ghostBlue" p="16px">
        1
      </FlexItem>
    </Flex>
  </>
);

const Ordering = () => (
  <>
    <h3 style={{ margin: '16px 0 8px 0' }}>Order:</h3>
    <p style={{ marginBottom: '16px', maxWidth: '1200px' }}>
      Set the order prop on FlexItem component to change the order of columns:
    </p>
    <Flex>
      <FlexItem width="33%" order={3} background="ghostBlue" p="16px">
        1
      </FlexItem>
      <FlexItem width="33%" order={1} background="ghostBlue" p="16px">
        2
      </FlexItem>
      <FlexItem width="33%" order={2} background="ghostBlue" p="16px">
        3
      </FlexItem>
    </Flex>
  </>
);

const MultipleRows = () => (
  <>
    <h3 style={{ margin: '16px 0 8px 0' }}>Multiple rows:</h3>
    <p style={{ marginBottom: '16px', maxWidth: '1200px' }}>
      If flex-flow is set to wrap and once flex items widths, offsets(gaps) exceeds flex line items
      are placed on next row:
    </p>
    <Flex flow="wrap" gap={18}>
      <FlexItem width="calc(33.3% - 12px)" background="ghostBlue" p="16px">
        1
      </FlexItem>
      <FlexItem width="calc(33.3% - 12px)" background="ghostBlue" p="16px">
        2
      </FlexItem>
      <FlexItem width="calc(33.3% - 12px)" background="ghostBlue" p="16px">
        3
      </FlexItem>
      <FlexItem width="60%" background="ghostBlue" p="16px">
        4
      </FlexItem>
    </Flex>
  </>
);

const Responsiveness = () => {
  const twoColumnsInRow = 'calc(50% - 9px)';
  const fourColumnsInRow = 'calc(25% - 13.5px)';

  return (
    <>
      <h3 style={{ margin: '16px 0 8px 0' }}>Responsive columns:</h3>
      <p style={{ marginBottom: '16px', maxWidth: '1200px' }}>
        Use breakpoint props (xs, sm, md, lg, xl) to make columns respond to viewport changes.In
        this example up to md there will be 1 column, from md to lg there will be 2 columns and from
        lg and up, there will be 4 columns.
      </p>
      <p style={{ marginBottom: '16px', maxWidth: '1200px' }}>
        <i>
          note: When flex-flow is set to wrap flexbox doesnt take the gap into account when
          calculating relative widths of cells. This means you have to subtract the gap when setting
          cell widths.
        </i>
        <br />
        <i style={{ display: 'flex', marginTop: '8px' }}>
          note: We are using the mobile first approach, so media-queries are produced with the
          min-width rule.
        </i>
      </p>
      <Flex flow="wrap" gap={18}>
        <FlexItem
          background="ghostBlue"
          p="16px"
          width="100%"
          breakpoints={[
            { breakpoint: 'md', width: twoColumnsInRow },
            { breakpoint: 'lg', width: fourColumnsInRow },
          ]}
        >
          1
        </FlexItem>
        <FlexItem
          background="ghostBlue"
          p="16px"
          width="100%"
          breakpoints={[
            { breakpoint: 'md', width: twoColumnsInRow },
            { breakpoint: 'lg', width: fourColumnsInRow },
          ]}
        >
          2
        </FlexItem>
        <FlexItem
          background="ghostBlue"
          p="16px"
          width="100%"
          breakpoints={[
            { breakpoint: 'md', width: twoColumnsInRow },
            { breakpoint: 'lg', width: fourColumnsInRow },
          ]}
        >
          3
        </FlexItem>
        <FlexItem
          background="ghostBlue"
          p="16px"
          width="100%"
          breakpoints={[
            { breakpoint: 'md', width: twoColumnsInRow },
            { breakpoint: 'lg', width: fourColumnsInRow },
          ]}
        >
          4
        </FlexItem>
      </Flex>
    </>
  );
};

const AutoSizedColumns = () => (
  <>
    <h3 style={{ margin: '16px 0 8px 0' }}>Auto sized columns:</h3>
    <p style={{ marginBottom: '16px', maxWidth: '1200px' }}>
      All columns in a row flex: 1 will have equal size, growing as much as they can to fill the
      row. In this example, the second column takes up 50% of the row while the other two columns
      automatically resize to fill the remaining space:
    </p>

    <Flex>
      <FlexItem flex="1" background="ghostBlue" p="16px">
        1
      </FlexItem>
      <FlexItem width="50%" background="ghostBlue" p="16px">
        2
      </FlexItem>
      <FlexItem flex="1" background="ghostBlue" p="16px">
        3
      </FlexItem>
    </Flex>
  </>
);

const Playground = (args) => (
  <>
    {console.log(args)}
    <h2 style={{ margin: '16px 0 8px 0' }}>Playground:</h2>
    <Flex gap={args.gap} justify={args.justify} align={args.align} flow={args.flow} mt="x7" mb="x7">
      <FlexItem
        p="16px"
        background="ghostBlue"
        width={args.width1}
        flex={args.flex1}
        order={args.order1}
        breakpoints={args.breakpoints1}
      >
        1
      </FlexItem>
      <FlexItem
        width={args.width2}
        flex={args.flex1}
        order={args.order2}
        breakpoints={args.breakpoints2}
        p="16px"
        background="ghostBlue"
      >
        2
      </FlexItem>
    </Flex>
  </>
);

const Templates: StoryFn = (args) => {
  return (
    <>
      <About />
      <Basic />
      <Ordering />
      <MultipleRows />
      <Responsiveness />
      <AutoSizedColumns />
      <Playground {...args} />
    </>
  );
};

export const Default = Templates.bind({});
