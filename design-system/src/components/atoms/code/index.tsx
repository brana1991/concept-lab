import { Prism } from '@mantine/prism';
import codeTheme from 'prism-react-renderer/themes/nightOwl';

import useStyle from './code.styles';

const Code = ({ children }) => {
  const { classes } = useStyle();

  return (
    <Prism className={classes.root} language="tsx" withLineNumbers getPrismTheme={() => codeTheme}>
      {children}
    </Prism>
  );
};

export default Code;
