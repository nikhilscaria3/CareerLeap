import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store/authstore'
import App from './App';
import "@fortawesome/fontawesome-free/css/all.min.css"; // Add this line
import { GoogleOAuthProvider } from "@react-oauth/google"


ReactDOM.render(

  <Provider store={store}>

    <GoogleOAuthProvider
      clientId={`710019880977-d77t8mffj0e0cbsl9q1hja4ntesg9mdi.apps.googleusercontent.com`}>
      <App />
    </GoogleOAuthProvider>

  </Provider>,

  document.getElementById('root')
);
