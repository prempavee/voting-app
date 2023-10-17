import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

// Create an Apollo Client instance with an optional token parameter
const createApolloClient = (token = null) => {
  let link = createHttpLink({ uri: process.env.NEXT_PUBLIC_API })

  if (token) {
    const authLink = setContext((_, { headers }) => {
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : "",
        }
      }
    })

    link = authLink.concat(link)
  }

  const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      },
    },
    
    // connectToDevTools: true
  })

  return client
}

export default createApolloClient
