import { ApolloClient, createNetworkInterface } from 'apollo-client';

const clientConfig = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: '/api/graphql'
  })
});

export function client(): ApolloClient {
  return clientConfig;
}