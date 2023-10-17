import React, { useState, useEffect } from 'react'
import { semifinalQuestionsJson } from '@/data/semifinal'
import LoadingButton from '@/components/LoadingButton'
import { POST_SEMIFINAL_VOTES } from '@/apollo/semifinalVotesQueries'
import { useMutation } from '@apollo/client'
import { useSnackbar } from 'notistack'

const Vote = ({ email, code, sample }) => {
  const [loadingButton, setLoadingButton] = useState(false)
  const [scores, setScores] = useState(JSON.parse(semifinalQuestionsJson))
  const [postSemifinalVotes, { data, loading, error }] = useMutation(POST_SEMIFINAL_VOTES)
  const [voted, setVoted] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  const handleSaveClick = async (event) => {
    event.preventDefault()
    setLoadingButton(true)
    try {
      const result = await postSemifinalVotes({ variables: {
        input: {
          email,
          sample,
          q1: scores[0].score,
          q2: scores[1].score,
          q3: scores[2].score
        },
        code
      }})

      if (!result.data.postSemifinalVotes.success) {
        throw new Error(result.data.error)
      }

      setVoted(true)
    } catch (error) {
      console.log(error)
      enqueueSnackbar("Oops, couldn't submit votes", { variant: 'error' })
    } finally {
      setLoadingButton(false)
    }
  }

  const handleChangeScore = (value, id) => {
    if (value.trim() === '') {
      setScores(prevScores => {
        const newScores = prevScores.map((item) => {
          if (item.id === id) {
            item.score = -1
            item.changed = true
          }
          return item
        })
        return newScores
      })
    } else {
      const newScore = Number(value)
      if (newScore < 0 || newScore > 100) {
        return
      } else {
        setScores(prevScores => {
          const newScores = prevScores.map((item) => {
            if (item.id === id) {
              item.score = newScore
              item.changed = true
            }
            return item
          })
          return newScores
        })
      }
    }
  }

  if (voted) return (
    <div className='flex flex-col justify-center min-h-screen text-center'>
      <h1 className='text-xl text-green-500'>Your votes are submitted</h1>
      <p className='text-xl text-green-500 my-12 font-bold'>Thank you!</p>
    </div>
  )

  return (
    <div className='my-14 text-sm'>
      <p className='text-sm text-slate-600'>{email}</p>
      <ol className='list-decimal my-8'>
        {scores.map(item => {
          return (
            <li
              key={item.id}
              className='py-3 border-b-[1px] border-slate-700'
            >
              <div className='flex flex-row items-center'>
                <div className='flex-1 flex flex-col'>
                  <p className='text-base'>{item.text}</p>
                  <p className='text-sm text-slate-600 italic'>{item.comment}</p>
                </div>
                <input
                  id={`score${item.id}`}
                  name={`score${item.id}`}
                  type='number'
                  min='-1'
                  max='100'
                  value={item.score >=0 ? item.score : ''}
                  onChange={(e) => handleChangeScore(e.target.value, item.id)}
                  className='m-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3'
                />
              </div>
            </li>
          )
        })}
      </ol>
      <button
        type='button'
        className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mb-8'
        onClick={handleSaveClick}
        disabled={loadingButton}
      >
        Submit
        <LoadingButton loadingButton={loadingButton} />
      </button>
    </div>
  )
}

export default Vote
