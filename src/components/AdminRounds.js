import React, { useState, useEffect } from 'react'
import { useSnackbar } from 'notistack'
import { useRounds } from '@/context/RoundContext'
import Loading from '@/components/Loading'
import CurrentRoundInfo from './CurrentRoundInfo'

const AdminRounds = () => {
  const { enqueueSnackbar } = useSnackbar()
  const { createRound, getAllRounds, makeCurrent } = useRounds()

  const [rounds, setRounds] = useState([])
  const [newRound, setNewRound] = useState({ 
    title: '',
    startDate: '2023-08-01',
    samplesNumber: 10
  })
  const [loading, setLoading] = useState(true)

  const handleChangeRound = (event) => {
    const { name, value } = event.target
    setNewRound(prevRoundData => ({ ...prevRoundData, [name]: value }))
  }

  const handleSubmitRound = async (event) => {
    event.preventDefault()

    if (newRound.title && newRound.startDate && newRound.samplesNumber) {
      try {
        const result = await createRound(newRound)
        if (result.status === 201) {
          enqueueSnackbar('Round is created', { variant: 'success' })
          setNewRound(prevRoundData => ({ ...prevRoundData, title: '', samplesNumber: 10 }))
          await fetchData()
        } else {
          enqueueSnackbar('Something went wrong', { variant: 'error' })
        }
      } catch (error) {
        console.log(error)
        enqueueSnackbar('Error while creating a new round', { variant: 'error' })
      }
    } else {
      enqueueSnackbar('Fill the form', { variant: 'error' })
    }
  }

  const fetchData = async () => {
    if (!loading) {
      setLoading(true)
    }

    try {
      const response = await getAllRounds()
      setRounds(response.data) 
    } catch (error) {
      console.log(error)
      enqueueSnackbar('Error while fetching data', { variant: 'error' })
    }

    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0')
    const day = String(currentDate.getDate()).padStart(2, '0')
    const formattedDate = `${year}-${month}-${day}`
    setNewRound({
      title: '',
      startDate: formattedDate,
      samplesNumber: 10
    })

    fetchData()

    if (loading) {
      setLoading(false)
    }
  }, [])

  const setCurrent = async (id) => {
    try {
      await makeCurrent(id)
      setRounds(prevRounds => {
        const newRounds = prevRounds.map((item) => {
          if (item.id === id) {
            item.current = true
          } else {
            item.current = false
          }
          return item
        })
        return newRounds
      })
      enqueueSnackbar('Current round is changed', { variant: 'success' })
    } catch (error) {
      console.log(error)
      enqueueSnackbar('Something went wrong', { variant: 'error' }) 
    }
  }

  if (loading) {
    return (
      <Loading />
    )
  }

  return (
    <div className='my-20'>
      <div className='my-5'>
        <h2 className='text-xl my-5 font-bold text-center'>Rounds</h2>

        {rounds.length > 0
          ? (
            <ul className='flex flex-col'>
              {rounds.map(item => {
                return (
                  <li
                    key={item.id}
                    className={item.current ? 'bg-green-400 px-3 py-1.5 my-1' : 'bg-indigo-400 px-3 py-1.5 my-1'}
                  >
                    <div className='flex flex-row'>
                      <div className='flex-1'>
                      {item.title} / {item.start} / {item.samplesNumber} samples
                      </div>
                      
                      <input
                        type='checkbox'
                        name='current'
                        className='ml-3'
                        checked={item.current}
                        onChange={() => setCurrent(item.id)}
                        disabled={item.current}
                      />
                    </div>
                  </li>
                )
              })}
            </ul>
          )
          : (
            <p className='text-sm'>... no rounds yet</p>
          )
        }

        <CurrentRoundInfo />

        <div className='my-5'>
          <h3 className='font-bold text-center'>Create new round</h3>
          <form className='space-y-6' onSubmit={handleSubmitRound}>
            <div>
              <div className='mt-2'>
                <label htmlFor='title' className='block text-sm font-medium leading-6'>
                  Round title
                </label>
                <input
                  id='title'
                  name='title'
                  required
                  value={newRound.title}
                  onChange={handleChangeRound}
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3'
                />
                <label htmlFor='samplesNumber' className='block text-sm font-medium leading-6'>
                  Amount of samples
                </label>
                <input
                  id='samplesNumber'
                  name='samplesNumber'
                  type='number'
                  min='1'
                  required
                  value={newRound.samplesNumber}
                  onChange={handleChangeRound}
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3'
                />
                <label htmlFor='startDate' className='block text-sm font-medium leading-6'>
                  Start date
                </label>
                <input
                  id='startDate'
                  name='startDate'
                  type='date'
                  required
                  value={newRound.startDate}
                  onChange={handleChangeRound}
                  className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3'
                />
              </div>
            </div>

            <button
              type='submit'
              className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            >
              Create round
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminRounds
