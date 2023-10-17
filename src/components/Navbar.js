import React from 'react'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'

const Navbar = () => {
  const { user, logout, admin } = useAuth()

  const handleLogout = async (event) => {
    event.preventDefault()
    await logout()
  }

  if (!user) return null

  return (
    <nav className='font-mono'>
      <div className='max-w-screen-md container relative flex h-16 items-center'>
          {admin
            ? <>
              <div className=''>
              <Link
                href='/admin'
                className='text-white rounded-md px-3 py-2 text-lg font-medium uppercase'
                aria-current='page'
              >
                Admin
              </Link>
              <Link
                href='/results'
                className='text-white rounded-md px-3 py-2 text-lg font-medium uppercase'
                aria-current='page'
              >
                Results
              </Link>
              <Link
                href='/semifinal-results'
                className='text-white rounded-md px-3 py-2 text-lg font-medium uppercase'
                aria-current='page'
              >
                Semifinal
              </Link>
              </div>
            </>
            : 
            <div className=''>
              <Link
                href='/'
                className='text-white rounded-md px-3 py-2 text-lg font-medium uppercase'
                aria-current='page'
              >
                Home
              </Link>
            </div>
          }

          <div className='absolute inset-y-0 right-0 flex items-center pr-2'>
            <button
              type='button'
              className='flex text-sm focus:outline-none' 
              id='logout-button'
              onClick={handleLogout}
            >
              <span className='text-white px-3 py-2 text-lg font-medium'>Logout</span>
            </button>
          </div>
        </div>
    </nav>
  )
}

export default Navbar
