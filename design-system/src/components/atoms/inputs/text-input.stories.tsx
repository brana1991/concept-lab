import { Meta, StoryFn } from '@storybook/react';
import Box from '../box';
import Code from '../code';
import Flex from '../flex';
import IconImage from '../icon-image';
import Text from '../text';
import TextInput from '.';

import { useForm as useReactHookForm } from '../../../hooks';
import * as yup from 'yup';

import ActionIcon from '../action-icon';

export default {
  title: 'Big Bang / Atoms / Inputs / Text',
  component: TextInput,
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'paper',
      values: [{ name: 'paper', value: '#EFF7FF' }],
    },
  },
  argTypes: {
    label: {
      name: 'Label text',
      defaultValue: 'Label',
      control: 'text',
    },
    placeholder: {
      name: 'Placeholder text',
      control: 'text',
      defaultValue: 'Placeholder',
    },
    required: {
      name: 'Required',
      control: 'boolean',
      defaultValue: true,
    },
    error: {
      name: 'Error message',
      control: 'text',
    },
    rightSection: {
      name: 'Right section',
      control: 'boolean',
      defaultValue: false,
    },
    rightSectionWidth: {
      name: 'Right section width',
      description: 'Used in calculation for the right padding of the input',
      control: 'number',
      defaultValue: 24,
    },
    rightSectionSpacing: {
      name: 'Right section spacing',
      description:
        'Used to position the right icon/button. Also used in calculation for the right padding of the input',
      control: 'number',
      defaultValue: 14,
    },
    disabled: {
      name: 'Disabled',
      control: 'boolean',
      defaultValue: false,
    },
  },
} as Meta;

const Description = () => (
  <div style={{ marginBottom: '50px' }}>
    <Text variant="variant-5" m="0">
      In the Ananas Design System, all input elements share a common set of base styles and states.
      This is achieved through the use of shared component tokens, which ensure consistent styling
      across different inputs. The shared styles mostly include sizings and colors in their
      respective states (default, focus, disabled, error).
    </Text>
  </div>
);

const InputStates = () => {
  const { register, formState } = useReactHookForm({
    mode: 'onChange',
    defaultValues: { default: '', error: '' },
    schema: yup.object({
      error: yup
        .string()
        .required('*Ovo polje je obavezno.')
        .min(3, 'Polje mora imati minimum 3 karaktera.'),
    }),
  });

  return (
    <div style={{ marginBottom: '50px' }}>
      <Text variant="variant-3" mb="x3">
        States
      </Text>
      <div
        style={{
          rowGap: '40px',
          display: 'grid',
          gridTemplateColumns: '150px 320px',
          alignItems: 'center',
          justifyItems: 'start',
          width: '100%',
        }}
      >
        <span>Default</span>
        <TextInput
          label="Label"
          defaultValue=""
          variant="filled"
          id="test-input-id"
          placeholder="Placeholder text"
        />

        <span>Disabled</span>
        <TextInput disabled label="Label" defaultValue="" variant="filled" id="test-input-id-3" />

        <span>Error</span>
        <TextInput
          required
          label="Label"
          defaultValue=""
          variant="filled"
          id="test-input-id-2"
          {...register('error')}
          error={formState.errors?.error?.message}
        />
      </div>
    </div>
  );
};

const InputRightSection = () => {
  const codeInlineIcon = `
  <TextInput
    label="Label"
    defaultValue=""
    id="text-input-id"
    rightSection={<IconImage src="/big-bang/icons/envelope.svg" />}
    rightSectionWidth={24}
  />
`;

  const codeInlineActionIcon = `
  <TextInput
    id="email"
    defaultValue=""
    placeholder="E-mail"
    rightSection={
      <ActionIcon
          type="submit"
          color="white"
          style={{ background: "red", borderRadius: "0 8px 8px 0" }}
          title="Submit email"
      >
        <IconImage src="/big-bang/icons/envelope-open-fill.svg" />
      </ActionIcon>
    }
    rightSectionWidth={48}
    rightSectionSpacing={2}
  />
`;

  return (
    <div style={{ marginBottom: '50px' }}>
      <Text variant="variant-3" mb="x3">
        Input right section
      </Text>
      <Text variant="variant-5" m="0">
        Text inputs can be tailored to include a right section for incorporating buttons or icons in
        various sizes. To ensure proper right padding calculation, developers should set the width
        of the right section based on the dimensions of the icon or button being added. The icon
        color follows the input text by default, but can be overridden easily by setting the{' '}
        <strong>--icon-color</strong> CSS Var.
      </Text>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
          columnGap: '20px',
          rowGap: '40px',
          marginTop: '40px',
        }}
      >
        <TextInput
          label="Label"
          defaultValue=""
          variant="filled"
          id="test-input-id-2"
          rightSection={<IconImage src="/big-bang/icons/envelope.svg" />}
          rightSectionWidth={24}
        />
        <Code>{codeInlineIcon}</Code>
        <TextInput
          placeholder="E-mail"
          defaultValue=""
          variant="filled"
          id="test-input-id-2"
          rightSection={
            <ActionIcon
              type="submit"
              color="white"
              style={{ background: 'red', borderRadius: '0 8px 8px 0' }}
              title="Submit email"
            >
              <IconImage src="/big-bang/icons/envelope-open-fill.svg" />
            </ActionIcon>
          }
          rightSectionWidth={48}
          rightSectionSpacing={2}
        />
        <Code>{codeInlineActionIcon}</Code>
      </div>
    </div>
  );
};

const ControlledVsUncontrolled = () => {
  const controlledInput = `
  const { register, watch, formState } = useReactHookForm({
    mode: "onChange",
    defaultValues: { firstName: "" },
    schema: yup.object({ firstName: yup.string().required() }),
  });

  const fields = watch();

  <TextInput
      id="first-name"
      label="First Name"
      value={fields.firstName}
      {...register("firstName")}
      error={formState.errors.firstName?.message}
  />;
`;

  const uncontrolledInput = `
  const { register, formState } = useReactHookForm({
      mode: "onChange",
      defaultValues: { firstName: "" },
      schema: yup.object({ firstName: yup.string().required() }),
  });

  <TextInput
      id="first-name"
      label="First Name"
      defaultValue=""
      {...register("firstName")}
      error={formState.errors.firstName?.message}
  />
`;

  return (
    <>
      <Text variant="variant-3" mb="x3">
        Controlled VS Uncontrolled
      </Text>
      <Text variant="variant-5" m="0">
        Inputs can be either controlled or uncontrolled, depending on whether the developer manages
        the input value manually or allows React to handle it internally. The uncontrolled inputs
        expect the <strong>defaultValue</strong> prop, while controlled ones expect the{' '}
        <strong>value </strong> prop. It is recommended to use uncontrolled inputs as much as
        possible to achieve better performance.
      </Text>

      <Text variant="variant-4" mt="x5" mb="x3">
        Controlled
      </Text>
      <Code>{controlledInput}</Code>

      <Text variant="variant-4" mt="x5" mb="x3">
        Uncontrolled
      </Text>
      <Code>{uncontrolledInput}</Code>
    </>
  );
};

export const Documentation = () => (
  <div style={{ width: '60%' }}>
    <Text variant="variant-1" mb="x3">
      Ananas Text Input Style Guide
    </Text>
    <Description />
    <InputStates />
    <InputRightSection />
    <ControlledVsUncontrolled />
  </div>
);

// both default values must be set at the same time for uncontrolled input
const Template: StoryFn = ({ ...args }) => {
  const { register, watch } = useReactHookForm({
    defaultValues: { firstName: '', lastName: '' },
    schema: yup.object({ firstName: yup.string() }),
  });

  const fields = watch();

  const { rightSection, rightSectionWidth, label, ...restArgs } = args;

  return (
    <Flex sx={{ height: '500px' }} align="center" justify="center" flow={'column'} gap={26}>
      <Box sx={{ width: 370 }}>
        <TextInput
          {...restArgs}
          {...register('firstName')}
          id="test-input-id"
          value={fields.firstName}
          label={label || undefined}
          rightSection={rightSection ? <IconImage src="/big-bang/icons/eye.svg" /> : null}
          rightSectionWidth={rightSection && rightSectionWidth ? rightSectionWidth : 0}
        />
      </Box>
      <Box sx={{ width: 370 }}>
        <TextInput
          {...restArgs}
          {...register('lastName')}
          id="test-input-id"
          value={fields.lastName}
          label={label || undefined}
          rightSection={rightSection ? <IconImage src="/big-bang/icons/eye.svg" /> : null}
          rightSectionWidth={rightSection && rightSectionWidth ? rightSectionWidth : 0}
        />
      </Box>
    </Flex>
  );
};

export const Playground = Template.bind({});
