// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { I18nextProvider } from 'react-i18next';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';

// App imports
import App from './App';
import { store, persistor } from './store/store';
import theme from './styles/theme';
import i18n from './utils/i18n';
import './styles/global.css';

// Service workers and error tracking
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './utils/reportWebVitals';

// Initialize error tracking
import errorService from './services/errorService';

// Global error handler
window.addEventListener('error', (event) => {
  errorService.reportError(event.error, {
    type: 'unhandled_error',
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
  });
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  errorService.reportError(event.reason, {
    type: 'unhandled_promise_rejection',
    promise: event.promise,
  });
});

// Create root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found. Please check your HTML file.');
}

const root = ReactDOM.createRoot(rootElement);

// Initialize WebSocket connection on app start
const initializeWebSocket = () => {
  const token = localStorage.getItem('token');
  if (token) {
    import('./services/websocketService').then(({ default: webSocketService }) => {
      webSocketService.connect(token);
    });
  }
};

// Main render function
const renderApp = () => {
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <I18nextProvider i18n={i18n}>
            <ThemeProvider theme={theme}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <CssBaseline />
                <BrowserRouter>
                  <App />
                </BrowserRouter>
              </LocalizationProvider>
            </ThemeProvider>
          </I18nextProvider>
        </PersistGate>
      </Provider>
    </React.StrictMode>
  );
};

// Initial render
renderApp();

// Initialize WebSocket after render
setTimeout(initializeWebSocket, 1000);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    const waitingServiceWorker = registration.waiting;
    if (waitingServiceWorker) {
      waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  },
});

// Performance monitoring
reportWebVitals(console.log);

// Export for testing
export { renderApp };