import { MantineProvider } from '@mantine/core';
import { Global } from '@mantine/core';
import theme from '../theme';

const GlobalStyles = () => (
  <Global
    styles={() => ({
      '*, *::before, *::after': {
        boxSizing: 'border-box',
      },

      p: {
        margin: 0,
      },
    })}
  />
);

const Provider = (props: { children: React.ReactNode }) => {
  return (
    <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
      <GlobalStyles />
      {props.children}
    </MantineProvider>
  );
};

export default Provider;
