import React, { useState } from 'react'

import { useRouter } from 'next/router'
// import Link from 'next/link'
import { useSnackbar } from 'notistack'
import { useAuth } from '@/context/AuthContext'
import MainContainer from '@/components/MainContainer'
import LoadingButton from '@/components/LoadingButton'

const Login = () => {
  const [calledPush, setCalledPush] = useState(false)
  const router = useRouter()
  const { user, login, resetPassword } = useAuth()
  const { enqueueSnackbar } = useSnackbar()
  const [loadingButton, setLoadingButton] = useState(false)

  const [formData, setFormData] = useState({ email: '', password: '' })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }))
  }

  if (user && !calledPush) {
    router.push('/')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoadingButton(true)
    const result = await login(formData.email, formData.password)
    if (!result.error) {
      if (calledPush) {
        return // no need to call router.push() again
      }
      router.push('/')
      setCalledPush(true)
    } else {
      enqueueSnackbar('Authentication failed', { variant: 'error' })
    }

    setLoadingButton(false)
  }

  const handleForgotPassword = async (event) => {
    event.preventDefault()
    if (!formData.email) {
      enqueueSnackbar('Fill in your email', { variant: 'error' })
      return
    }
    try {
      await resetPassword(formData.email)
      enqueueSnackbar("We've sent a link to your email!", { variant: 'success' })
    } catch (error) {
      enqueueSnackbar('Something went wrong', { variant: 'error' })
    }
  }

  return (
    <MainContainer title='Login'>
      <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
        <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
          <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight'>
            Sign in to your account
          </h2>
        </div>

        <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
          <form className='space-y-6' onSubmit={handleSubmit}>
            <div>
              <label htmlFor='email' className='block text-sm font-medium leading-6'>
                Email address
              </label>
              <div className='mt-2'>
                <input
                  id='email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3'
                />
              </div>
            </div>

            <div>
              <div className='flex items-center justify-between'>
                <label htmlFor='password' className='block text-sm font-medium leading-6'>
                  Password
                </label>
                <div className='text-sm'>
                  <a onClick={handleForgotPassword} className='font-semibold text-indigo-600 hover:text-indigo-500'>
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className='mt-2'>
                <input
                  id='password'
                  name='password'
                  type='password'
                  autoComplete='current-password'
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3'
                />
              </div>
            </div>

            <button
              type='submit'
              className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 items-center'
            >
              <LoadingButton loadingButton={loadingButton} />
              Sign in
            </button>
          </form>
        </div>
      </div>
    </MainContainer>
  )
}

export default Login
