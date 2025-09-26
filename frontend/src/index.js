import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './controllers/AppController';
import reportWebVitals from './models/reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals(); 