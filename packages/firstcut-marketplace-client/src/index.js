import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

const SERVER_ROOT = (process.env.NODE_ENV === 'development') ? 'http://localhost:4000' : 'https://api.firstcut.io';
const client = new ApolloClient({
  uri: `${SERVER_ROOT}/graphql`
});

ReactDOM.render((
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
  ), document.getElementById('root'));

serviceWorker.unregister();
