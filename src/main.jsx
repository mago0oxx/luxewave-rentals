import React from 'react';
import ReactDOM from 'react-dom';
import { Helmet } from 'react-helmet';
import './i18n';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Helmet
        defaultTitle='LuxeWave Rentals '
        titleTemplate='%s | Vite React Tailwind Starter'
      >
        <meta charSet='utf-8' />
        <html lang='id' amp />
      </Helmet>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
