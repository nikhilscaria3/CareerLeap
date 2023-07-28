import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store/authstore'
import App from './App';
import "@fortawesome/fontawesome-free/css/all.min.css"; // Add this line


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
