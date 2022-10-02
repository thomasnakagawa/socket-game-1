import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { SocketContextContextProvider } from './connection/SocketConnectionContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <SocketContextContextProvider>
      <App />
    </SocketContextContextProvider>
  </React.StrictMode>
);
