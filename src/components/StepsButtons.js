import React from 'react'
import Link from 'next/link'

const StepsButtons = ({ step }) => {

  const classNormalButton = 'flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
  const classCurrentStepButton = 'flex justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600'

  return(
    <div className='my-14 flex flex-row space-x-4 justify-center'>
      <Link href='/step/1'>
        <button
          type='button'
          className={step === '1'
            ? classCurrentStepButton
            : classNormalButton
          }
        >
          Step 1
        </button>
      </Link>

      <Link href='/step/2'>
        <button
          type='button'
          className={step === '2'
          ? classCurrentStepButton
          : classNormalButton
          }
        >
          Step 2
        </button>
      </Link>

      <Link href='/step/3'>
        <button
          type='button'
          className={step === '3'
            ? classCurrentStepButton
            : classNormalButton
          }  
        >
          Step 3
        </button>
      </Link>
    </div>
  )

}

export default StepsButtons
