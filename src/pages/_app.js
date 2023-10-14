import '@/styles/globals.css'
import { useRouter } from 'next/router'
import ProtectedRoute from '@/components/ProtectedRoute'
import { AuthContextProvider } from '@/context/AuthContext'
import { SnackbarProvider } from 'notistack'
import ProtectedAdminRouter from '@/components/ProtectedAdminRouter'
import AuthApollo from '@/components/AuthApollo'

const noAuthRequired = ['/login']
const adminOnly = ['/admin', '/results']

export default function App ({ Component, pageProps }) {
  const router = useRouter()
  return (
    <AuthContextProvider>
      <AuthApollo>
        <SnackbarProvider maxSnack={3}>
          {noAuthRequired.includes(router.pathname)
            ? (<Component {...pageProps} />)
            : (
              <ProtectedRoute>
                {adminOnly.includes(router.pathname)
                  ? (
                    <ProtectedAdminRouter>
                      <Component {...pageProps} />
                    </ProtectedAdminRouter>)
                  : (<Component {...pageProps} />)}
              </ProtectedRoute>
            )
          }
        </SnackbarProvider>
      </AuthApollo>
    </AuthContextProvider>
  )
}
