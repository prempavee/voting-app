import React, { useState } from 'react'
import { useSnackbar } from 'notistack'
import { useRounds } from '@/context/RoundContext'
import SamplesInfo from './SamplesInfo'

const AdminSamples = () => {
  const [newSample, setNewSample] = useState('')
  const { enqueueSnackbar } = useSnackbar()
  const { samples, createSample } = useRounds()

  const handleChangeSample = async (event) => {
    setNewSample(event.target.value)
  }

  const handleSubmitSample = async (event) => {
    event.preventDefault()

    if (newSample) {
      try {
        const result = await createSample(newSample)
        if (result.status === 201) {
          enqueueSnackbar('Sample is created', { variant: 'success' })
          setNewSample('')
        } else {
          enqueueSnackbar('Something went wrong...', { variant: 'error' })
        }
      } catch (error) {
        console.log(error)
        enqueueSnackbar('Error while creating a sample...', { variant: 'error' })
      }
    } else {
      enqueueSnackbar('Fill the form', { variant: 'error' })
    }
  }

  return (
    <div className='my-20'>
      <div className='my-5'>
        <h2 className='text-xl my-5 font-bold text-center'>Samples</h2>
        {samples.length > 0
          ? (
            <ul className='flex flex-row flex-wrap'>
              {samples.map(item => {
                return (
                  <li
                    key={item.symbol}
                    className='m-2 bg-indigo-400 px-3 py-1.5'
                  >
                    {item.symbol}
                  </li>
                )
              })}
            </ul>
          )
          : <SamplesInfo />
        }
      </div>
      <div className='my-5'>
        <h3>Add a sample</h3>
        <form className='space-y-6' onSubmit={handleSubmitSample}>
          <div>
            <div className='mt-2'>
              <input
                id='sample'
                name='sample'
                required
                value={newSample}
                onChange={handleChangeSample}
                className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3'
              />
            </div>
          </div>

          <button
            type='submit'
            className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          >
            Create sample
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminSamples
