import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

// Create an Apollo Client instance with an optional token parameter
const createApolloClient = (token = null) => {
  const httpLink = createHttpLink({ uri: process.env.NEXT_PUBLIC_API })

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      }
    }
  })

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      },
    },
    
    connectToDevTools: true
  })

  return client
}

export default createApolloClient
