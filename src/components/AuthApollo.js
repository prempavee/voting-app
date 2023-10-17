import React, { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { ApolloProvider } from '@apollo/client'
import createApolloClient from '@/apollo/apolloClient'

const AuthApollo = ({ children }) => {
  const { token, error } = useAuth()
  const [client, setClient] = useState(createApolloClient(token))

  useEffect(() => {
    setClient(createApolloClient(token))
  }, [token])

  if (error) return (
    <div className='flex flex-col justify-center min-h-screen text-center '>
      Network's problem, try again later
    </div>
  )

  return <ApolloProvider client={client}>{children}</ApolloProvider>
}

export default AuthApollo
