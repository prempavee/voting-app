import { useState, useEffect } from 'react'
import { POST_ROUND, ROUNDS } from '@/apollo/roundsQueries'
import { useMutation } from '@apollo/client'
import { useSnackbar } from 'notistack'

const CreateRound = () => {
  const [newRound, setNewRound] = useState({ 
    title: '',
    start: '2023-08-01',
    samplesNumber: 10
  })
  const [loading, setLoading] = useState(true)
  const { enqueueSnackbar } = useSnackbar()
  const [postRound] = useMutation(POST_ROUND)
  
  useEffect(() => {
    setLoading(true)
    updateNewRound()

    if (loading) {
      setLoading(false)
    }
  }, [])

  const updateNewRound = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0')
    const day = String(currentDate.getDate()).padStart(2, '0')
    const formattedDate = `${year}-${month}-${day}`
    setNewRound({
      title: '',
      start: formattedDate,
      samplesNumber: 10
    })
  }

  const handleChangeRound = (event) => {
    const { name, value } = event.target
    setNewRound(prevRoundData => ({ ...prevRoundData, [name]: value }))
  }


  const handleSubmitRound = async (event) => {
    event.preventDefault()

    if (newRound.title && newRound.start && newRound.samplesNumber) {
      try {
        await postRound({
          variables: {
            input: newRound
          },
          refetchQueries: [{ query: ROUNDS }]
        })

        updateNewRound()
        enqueueSnackbar('Round is created', { variant: 'success' })
      } catch (error) {
        console.log(error)
        enqueueSnackbar('Error while creating a new round', { variant: 'error' })
      }
    } else {
      enqueueSnackbar('Fill the form', { variant: 'error' })
    }
  }

  return (
    <div className='my-8'>
      <h3 className='font-bold text-center'>Create new round</h3>
      <form className='space-y-6'
      onSubmit={handleSubmitRound}
      >
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
            <label htmlFor='start' className='block text-sm font-medium leading-6'>
              Start date
            </label>
            <input
              id='start'
              name='start'
              type='date'
              required
              value={newRound.start}
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
  )
}

export default CreateRound
