import React from 'react'
import Link from 'next/link'

const StepsButtons = ({ step }) => {

  const classButton = 'flex justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 my-3 mx-auto w-3/4'

  const classNormalButton = classButton + ' bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600'
  const classCurrentStepButton = classButton + ' bg-green-600 hover:bg-green-500 focus-visible:outline-green-600'

  return(
    <div className='my-14 grid grid-cols-1 md:grid-cols-2 justify-between'>
      <Link href='/step/1'>
        <button
          type='button'
          className={step === '1'
            ? classCurrentStepButton
            : classNormalButton
          }
        >
          1. Before test
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
          2. After test
        </button>
      </Link>
    </div>
  )

}

export default StepsButtons
