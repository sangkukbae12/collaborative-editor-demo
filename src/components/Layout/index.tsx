import { createStyles } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import Footer from '../Footer';
import Header from '../Header';

const useStyles = createStyles(() => ({
  root: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto'
  },
}));

const Layout = () => {
  const { classes } = useStyles();
  return (
    <div className={ classes.root }>
      <Header links={ [
        { link: '/', label: 'home' },
      ] } />
      <main className={ classes.content }>
        <Outlet />
      </main>
      <Footer />
    </div>

  );
};

export default Layout;