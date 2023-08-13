import '@/styles/globals.css'
import { useRouter } from 'next/router'
import ProtectedRoute from '@/components/ProtectedRoute'
import { AuthContextProvider } from '@/context/AuthContext'
import { RoundContextProvider } from '@/context/RoundContext'
import { SnackbarProvider } from 'notistack'

import ProtectedAdminRouter from '@/components/ProtectedAdminRouter'

const noAuthRequired = ['/login']
const adminOnly = ['/admin', '/results']

export default function App ({ Component, pageProps }) {
  const router = useRouter()
  return (
    <AuthContextProvider>
      <SnackbarProvider maxSnack={3}>
        {noAuthRequired.includes(router.pathname)
          ? (<Component {...pageProps} />)
          : (
            <RoundContextProvider>
              <ProtectedRoute>
                {adminOnly.includes(router.pathname)
                  ? (
                    <ProtectedAdminRouter>
                      <Component {...pageProps} />
                    </ProtectedAdminRouter>)
                  : (<Component {...pageProps} />)}
              </ProtectedRoute>
            </RoundContextProvider>
          )
        }
      </SnackbarProvider>
    </AuthContextProvider>
  )
}
