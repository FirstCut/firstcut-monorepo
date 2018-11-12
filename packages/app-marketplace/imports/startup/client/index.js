
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import gql from 'graphql-tag';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { MeteorAccountsLink } from 'meteor/apollo';
import { withClientState } from 'apollo-link-state';
import App from '../../ui/app';

const cache = new InMemoryCache();

const stateLink = withClientState({
  cache,
  resolvers: {
    Mutation: {
      updateNetworkStatus: (_, { isConnected }, { cache }) => {
        const data = {
          networkStatus: {
            __typename: 'NetworkStatus',
            isConnected,
          },
        };
        cache.writeData({ data });
        return null;
      },
    },
  },
  defaults: {
    networkStatus: {
      __typename: 'NetworkStatus',
      isConnected: true,
    },
  },
});

const client = new ApolloClient({
  link: ApolloLink.from([
    stateLink,
    new MeteorAccountsLink(),
    new HttpLink({
      uri: '/graphql',
    }),
  ]),
  cache,
});

Meteor.startup(() => {
  const rootEl = document.querySelector('#react-root');
  console.log(client.query({
    query: gql`{
      projects {
        title,
        description
      }
    }`,
  }));
  render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>,
    rootEl,
  );
});
