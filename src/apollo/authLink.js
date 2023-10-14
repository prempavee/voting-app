import { useEffect } from 'react'
import { setContext } from '@apollo/client/link/context'
import { useAuth } from '@/context/AuthContext'

const authLink = setContext((_, { headers }) => {
  const { token } = useAuth()

  useEffect(() => {

  }, [token])
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }
})

export default authLink
