import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../context/AuthContext'

const ProtectedAdminRouter = ({ children }) => {
  const { admin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!admin) {
      router.push('/')
    }
  }, [router, admin])

  return <>{admin ? children : null}</>
}

export default ProtectedAdminRouter
