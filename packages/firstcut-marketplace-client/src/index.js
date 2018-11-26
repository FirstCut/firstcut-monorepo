import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

console.log(process.env);
const SERVER_ROOT = (process.env.NODE_ENV === 'development') ? 'http://localhost:4000' : 'http://52.43.83.221';
const client = new ApolloClient({
  uri: `${SERVER_ROOT}/graphql`
});

ReactDOM.render((
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
  ), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
