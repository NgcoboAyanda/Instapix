import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { BrowserRouter, HashRouter } from 'react-router-dom';

import './index.css';

import App from './app/App';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <Provider store={store}>
      <HashRouter>
        <App />
      </HashRouter>
    </Provider>
);
