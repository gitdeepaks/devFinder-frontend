import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Toaster } from '@pheralb/toast';
import { Provider } from 'react-redux';
import '@pheralb/toast/dist/styles.css';
import App from './App.jsx';
import { appStore } from './utils/appStore';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={appStore}>
      <App />
      <Toaster />
    </Provider>
  </StrictMode>
);
