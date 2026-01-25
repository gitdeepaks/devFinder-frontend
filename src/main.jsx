import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Toaster } from '@pheralb/toast';
import { Provider } from 'react-redux';
import '@pheralb/toast/dist/styles.css';
import App from './App.jsx';
import { appStore } from './utils/appStore';
import { ThemeProvider } from './utils/theme-context';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={appStore}>
      <ThemeProvider>
        <App />
        <Toaster />
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
