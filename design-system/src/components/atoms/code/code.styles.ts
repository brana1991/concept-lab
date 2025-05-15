import { createStyles } from '@mantine/core';

export default createStyles(() => {
  return {
    root: {
      '.mantine-Prism-code': {
        fontSize: 16,
        paddingRight: 34,

        span: {
          fontFamily: 'Fira Code',
        },
      },
    },
  };
});
