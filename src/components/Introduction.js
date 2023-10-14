import React, { useState } from 'react'
import { useSnackbar } from 'notistack'
import MainContainer from '@/components/MainContainer'
import LoadingButton from '@/components/LoadingButton'
import { useAuth } from '@/context/AuthContext'
import { useMutation } from '@apollo/client'
import { POST_JUDGE, JUDGE } from '@/apollo/judgesQueries'

export default function Introduction () {
  const [isChecked, setIsChecked] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const [formData, setFormData] = useState({ name: '', surname: '' })
  const { user, token } = useAuth()
  const [loadingButton, setLoadingButton] = useState(false)

  const [postJudge] = useMutation(POST_JUDGE)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    setLoadingButton(true)

    try {
      const input = {
        uid: user.uid,
        email: user.email,
        name: formData.name,
        surname: formData.surname,
        accepted: isChecked,
      }
      await postJudge({
        variables: { input },
        refetchQueries: [{ query: JUDGE, variables: { uid: user.uid } }]
      })
    } catch (error) {
      console.log(error)
      enqueueSnackbar('Oops, something went wrong', { variant: 'error' })
    } finally {
      setLoadingButton(false)
    } 
  }

  return (
    <MainContainer title='Home'>
      <h1 className='text-4xl text-center my-14 font-bold'>1st Ganja Cup Thailand</h1>
      <h4 className='text-xl font-bold my-5'>
        Welcome to the Jury panel  
      </h4>

      <div className='my-14'>
        <h4 className='text-xl my-5 font-bold text-center'>INSTRUCTIONS</h4>
        <ol className='list-decimal'>
          <li className='my-3'>
            Take some free time to understand how it works. Around an hour will be enough for the first time, at least an hour and the feeling that is the right moment to focus on the task. If is not just wait and set up the right moment for later.
          </li>
          <li className='my-3'>
            Be in a place clean, well illuminated, with a table or a flat surface in front of you. Avoid windy situations other people or animals that they may generate disturbances  
          </li>
          <li className='my-3'>
            Your computer or mobile, some paper, a pencil or a pen, a scale if you have, a metal grinder, lighter, cardboard for filters, your rolling papers or bong or vape, a glass and some fresh water. 
          </li>
        </ol>
      </div>

      <form className='my-14 space-y-3' onSubmit={handleSubmit}>
        <h4 className='text-xl my-5 font-bold text-center'>READY?</h4>

        <div className=''>
          <label htmlFor='name' className='block text-sm font-medium leading-6'>
            Name
          </label>
          <input
            id='name'
            name='name'
            required
            value={formData.name}
            onChange={handleChange}
            className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3'
          />
        </div>

        <div className=''>
          <label htmlFor='surname' className='block text-sm font-medium leading-6'>
            Surname
          </label>
          <input
            id='surname'
            name='surname'
            required
            value={formData.surname}
            onChange={handleChange}
            className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3'
          />
        </div>

        <div className='flex flex-row'>
          <input
            type='checkbox'
            name='acceptCheckbox'
            className='mr-3'
            checked={isChecked}
            required
            onChange={() => setIsChecked((prev) => !prev)}
          />
          <label htmlFor='acceptCheckbox' className='block text-sm font-medium leading-6 text-gray-400'>
            I understand and accept instructions
          </label>
        </div>
        <button
          type='submit'
          className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          disabled={loadingButton}
        >
          <LoadingButton loadingButton={loadingButton} />
          Let's go
        </button>
      </form>
    </MainContainer>
  )
}
