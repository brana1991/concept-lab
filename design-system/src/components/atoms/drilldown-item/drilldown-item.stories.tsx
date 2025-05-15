import { Meta, StoryFn } from '@storybook/react';
import DrillDownItem from './';
import SimpleGrid from '../simple-grid';

export default {
  title: 'Big Bang / Atoms / Drilldown Item',
  component: DrillDownItem,
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'paper',
      values: [{ name: 'paper', value: '#EFF7FF' }],
    },
  },
} as Meta;

const Intro = () => (
  <>
    {' '}
    <h2 style={{ margin: '0 0 8px 0' }}>Drilldown Item</h2>
    <p style={{ margin: '0 0 8px 0' }}>
      Drilldown-item refers to a <b>single option or entry.</b> It typically contains a label or
      text that describes the option and is often displayed as a clickable element, such as a button
      or a link.
    </p>
    <p style={{ margin: '0 0 8px 0' }}>
      Although this component provides expand and collapse behavior for nested items it differs from
      the Accordion component in some crucial ways.
    </p>
    <p>
      Menu item doesn&apos;t have panels and headers like Accordion. Its content area is meant to be
      a single option only.{' '}
      <b>
        Its sole purpose is to perform actions while accordions are used to display a large amount
        of content in a small space and allow users to see more detailed information by expanding or
        collapsing different sections.
      </b>
    </p>
    <p style={{ margin: '0 0 8px 0' }}>Some common actions that a menu item may perform include:</p>
    <ul style={{ margin: '0 0 8px 0' }}>
      <li style={{ marginLeft: '16px' }}>Navigating to a different page or section of a website</li>
      <li style={{ marginLeft: '16px' }}>Loading dynamic content</li>
      <li style={{ marginLeft: '16px' }}>Launching a modal or dialog</li>
      <li style={{ marginLeft: '16px' }}>
        Filtering or sorting data: A menu item can be used to filter or sort data that is being
        displayed on the page. For example, a menu item could be used to filter a list of products
        by category or to sort them by price.
      </li>
      <li style={{ marginLeft: '16px' }}>
        Executing JavaScript code: Wide range of possibilities like validating forms, opening new
        tabs or windows, and many other actions.
      </li>
    </ul>
    <p>Considering previously said Menu-items can be used within Accordions if needed.</p>
  </>
);

const FilledWhiteBoxVariation = () => (
  <div>
    <h2>Filled-white-box variation</h2>
    <DrillDownItem variant="filled-white-box" label="FashionOutlet" opened>
      <DrillDownItem label="Odeća" variant="filled-white-box">
        <DrillDownItem variant="filled-white-box" label="Žene" />
        <DrillDownItem variant="filled-white-box" label="Dečaci" />
        <DrillDownItem variant="filled-white-box" label="Muškarci" />
        <DrillDownItem variant="filled-white-box" label="Devojčice" />

        <DrillDownItem label="Obuća" variant="filled-white-box">
          <DrillDownItem variant="filled-white-box" label="Patike" />
          <DrillDownItem variant="filled-white-box" label="Cipele" />
          <DrillDownItem variant="filled-white-box" label="Cizme" />
        </DrillDownItem>
      </DrillDownItem>
    </DrillDownItem>
  </div>
);

const Template: StoryFn = () => {
  return (
    <>
      <Intro />
      <SimpleGrid cols={3}>
        <FilledWhiteBoxVariation />
      </SimpleGrid>
    </>
  );
};

export const Default = Template.bind({});
