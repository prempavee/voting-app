import React from 'react'
import { useRounds } from '@/context/RoundContext'
import Link from 'next/link'

const SamplesButtonList = ({ step, sample }) => {
  const { samples } = useRounds()

  return (
    <div className='my-14 flex flex-row flex-wrap justify-center'>
      {samples.map((item) => {
        const sampleButton = item.symbol
        return (
          <Link
            href={`/step/${step}/${sampleButton.toLowerCase()}`}
            key={item.symbol}
          >
            <button
              type='button'
              className={(sampleButton.toLowerCase() === sample)
                ? 'flex justify-center rounded-md bg-green-600 m-3 px-4 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600'
                : 'flex justify-center rounded-md bg-indigo-600 m-3 px-4 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
              }
            >
              {sampleButton}
            </button>
          </Link>
        )
      })}
    </div>
  )
}

export default SamplesButtonList
