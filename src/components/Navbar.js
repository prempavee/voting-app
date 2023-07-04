import React from 'react'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'

const Navbar = () => {
  const { user, logout } = useAuth()

  const handleLogout = async (event) => {
    event.preventDefault()
    await logout()
  }

  if (!user) return null

  return (
    <nav className='bg-gray-600 font-mono'>
      <div className='max-w-screen-md container relative flex h-16 items-center'>
          <div className=''>
            <Link
              href='/'
              className='text-white rounded-md px-3 py-2 text-lg font-medium uppercase'
              aria-current='page'
            >
              Home
            </Link>
          </div>
          {/* <div className=''>
            <a
              href='#'
              className='text-white rounded-md px-3 py-2 text-lg font-medium'
              aria-current='page'
            >
              Step1
            </a>
          </div>
          <div className=''>
            <a
              href='#'
              className='text-white rounded-md px-3 py-2 text-lg font-medium'
              aria-current='page'
            >
              Step2
            </a>
          </div>
          <div className=''>
            <a
              href='#'
              className='text-white rounded-md px-3 py-2 text-lg font-medium'
              aria-current='page'
            >
              Step3
            </a>
          </div> */}
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
