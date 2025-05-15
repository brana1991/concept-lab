import { Loader as MantineLoader, LoaderProps as MantineLoaderProps } from '@mantine/core';

import { ModifyMantineProps } from '../../shared-types';
import { withDefaultProps } from '../../shared-utils';

type LoaderProps = ModifyMantineProps<MantineLoaderProps, unknown>;

const DEFAULT_VARIANT = 'dots';
const DEFAULT_COLOR = 'redOrange';

const Loader = () => {
  return <MantineLoader variant={DEFAULT_VARIANT} color={DEFAULT_COLOR} />;
};

Loader.displayName = 'Loader';

export default withDefaultProps<LoaderProps>(Loader);
