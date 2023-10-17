import { useState } from 'react'

const UserInfo = ({ submitEmail }) => {
  const [email, setEmail] = useState('')
  const [isOver21, setIsOver21] = useState(false)

  const handleChange = e => {
    setEmail(e.target.value)
  }

  const handleSubmit = () => {
    submitEmail(email)
  }
 
  return (
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
              value={email}
              onChange={handleChange}
              className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3'
            />
          </div>
        </div>

        <div className='flex flex-row'>
          <input
            type='checkbox'
            name='acceptCheckbox'
            className='mr-3'
            checked={isOver21}
            required
            onChange={() => setIsOver21((prev) => !prev)}
          />
          <label htmlFor='acceptCheckbox' className='block text-sm font-medium leading-6 text-gray-400'>
            I'm over 21 years old
          </label>
        </div>

        <button
          type='submit'
          className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 items-center'
        >
          Confirm
        </button>
      </form>
    </div>
  )
}

export default UserInfo
