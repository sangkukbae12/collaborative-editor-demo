import { useState } from 'react';
import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import NotFound from './components/NotFound';
import SignIn from './components/SignIn';
import Home from './pages/Home';
import { theme } from './theme';


function App() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');
  const toggleColorScheme = (value?: ColorScheme) => {
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ColorSchemeProvider colorScheme={ colorScheme } toggleColorScheme={ toggleColorScheme }>
      <MantineProvider withNormalizeCSS withGlobalStyles theme={ { ...theme, colorScheme } }>
        <NotificationsProvider autoClose={ 3000 }>
          <Router>
            <Routes>
              <Route element={ <Layout /> }>
                <Route index element={ <Home /> } />
                <Route path='/login' element={ <SignIn /> } />
                <Route path='*' element={ <NotFound /> } />
              </Route>
            </Routes>
          </Router>
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
