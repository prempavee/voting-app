import React, { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { ApolloProvider } from '@apollo/client'
import createApolloClient from '@/apollo/apolloClient'

const AuthApollo = ({ children }) => {
  const { token } = useAuth()
  const [client, setClient] = useState(createApolloClient(token))

  useEffect(() => {
    setClient(createApolloClient(token))
  }, [token])

  return <ApolloProvider client={client}>{children}</ApolloProvider>
}

export default AuthApollo
