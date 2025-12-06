import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import "bootstrap-icons/font/bootstrap-icons.css";
import reportWebVitals from './reportWebVitals';

import { SiteConfigProvider } from "./context/SiteConfigContext"; // 🔥 IMPORTANTE

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <SiteConfigProvider>
    <App />
  </SiteConfigProvider>
);

reportWebVitals();
