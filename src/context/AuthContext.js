import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  getAuth,
  sendPasswordResetEmail
} from 'firebase/auth'
import { app } from '@/config/firebase'
import Loading from '@/components/Loading'

export const AuthContext = createContext({})
export const useAuth = () => useContext(AuthContext)

export const AuthContextProvider = ({
  children
}) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [admin, setAdmin] = useState(false)
  const [error, setError] = useState(false)

  const getToken = async () => {
    if (getAuth(app) && getAuth(app).currentUser) {
      try {
        const token = await getAuth(app).currentUser.getIdToken(true)
        setToken(token)
        return token
      } catch (error) {
        setError(true)
        console.log({ error })
        return { error }
      }
    }
  }

  const getUser = async () => {
    const u = await getAuth(app).currentUser
    if (u) {
      const t = await getToken()
      // TODO check this direct assignment
      user.token = t
    }
    setUser(u || null)
    return u || null
  }

  const login = async (email, password) => {
    try {
      const authentication = getAuth(app)
      const user = await signInWithEmailAndPassword(authentication, email, password)
      return { user }
    } catch (error) {
      console.log({ error })
      return { error }
    }
  }

  const logout = async () => {
    const authentication = getAuth(app)
    return await signOut(authentication).then(() => {
      setUser(null)
    })
  }

  const resetPassword = async (email) => {
    const authentication = getAuth()
    return sendPasswordResetEmail(authentication, email)
      .then(() => {
        return true
      })
      .catch((error) => {
        console.log({ error })
        return { error }
      })
  }

  useEffect(() => {
    const authentication = getAuth(app)
    const unsubscribe = onAuthStateChanged(authentication, async authUser => {
      if (authUser) {
        setUser({ ...authUser })

        if (authUser.email === 'kittyprempavee@gmail.com') {
          setAdmin(true)
        } else {
          setAdmin(false)
        }

        try {
          const token = await getAuth(app).currentUser.getIdToken(true)
          setToken(token)
        } catch (error) {
          setError(true)
        }
      } else {
        setUser(null)
        setToken(null)
        setAdmin(false)
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        getUser,
        getToken,
        token,
        admin,
        resetPassword,
        error
      }}
    >
      {loading ? <Loading /> : children}
    </AuthContext.Provider>
  )
}
