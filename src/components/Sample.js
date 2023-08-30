import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { useAuth } from '@/context/AuthContext'
import { useRounds } from '@/context/RoundContext'
import { postVotes, getVotesForSample } from '@/api/votesApi'
import { scoreQuestionsJson, textQuestionsJson } from '@/data/questions'
import Loading from '@/components/Loading'
import LoadingButton from '@/components/LoadingButton'

const dataType = {
  scores: 'scores',
  questions: 'questions'
}

export default function Sample ({ step, sample }) {
  const [scores, setScores] = useState([])
  const [questions, setQuestions] = useState([])
  const { user, token } = useAuth()
  const { enqueueSnackbar } = useSnackbar()
  const { currentRound } = useRounds()
  const [loading, setLoading] = useState(true)
  const [loadingButton, setLoadingButton] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setLoading(true)
    if (currentRound && step && sample && user) {
      fetchAnswers()
    }
  }, [step, sample, user, currentRound])

  useEffect(() => {
    const handleRouteChange = (url) => {
      saveData()
    }
    router.events.on('beforeHistoryChange', handleRouteChange)

    return () => {
      router.events.off('beforeHistoryChange', handleRouteChange)
    }
  }, [])

  const fetchAnswers = async () => {
    const scoreQuestions = JSON.parse(scoreQuestionsJson)
    const textQuestions = JSON.parse(textQuestionsJson)
    try {
      const { data } = await getVotesForSample(token, user.uid, String(currentRound.id), step, sample)
      data.data.forEach(item => {
        let foundIndex = scoreQuestions.findIndex((element) => Number(element.id) === Number(item.questionId))
        if (foundIndex !== -1) {
          scoreQuestions[foundIndex].score = item.score ?? -1
          scoreQuestions.changed = false
        }

        foundIndex = textQuestions.findIndex((element) => Number(element.id) === Number(item.questionId))
        if (foundIndex !== -1) {
          textQuestions[foundIndex].answer = item.answer ?? ''
          textQuestions.changed = false
        }
      })    
      setScores(scoreQuestions)
      setQuestions(textQuestions)

    } catch (error) {
      setScores(scoreQuestions)
      setQuestions(textQuestions)
      console.log(error)
      enqueueSnackbar("Oops, couldn't get saved info", { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const saveData = async () => {
    setLoadingButton(true)

    const scoresNameInLocalStorage = getNameInLocalStorage(dataType.scores)
    const questionsNameInLocalStorage = getNameInLocalStorage(dataType.questions)
    const scoresSaved = JSON.parse(localStorage.getItem(scoresNameInLocalStorage))
    const questionsSaved = JSON.parse(localStorage.getItem(questionsNameInLocalStorage))

    const votes = []

    try {
      if (scoresSaved && currentRound) {
        scoresSaved.filter(item => item.changed).forEach(item => {
          if (item.score > -1) {
            votes.push({
              uid: user.uid,
              email: user.email,
              round: String(currentRound.id),
              roundTitle: currentRound.title,
              step,
              sample,
              questionId: String(item.id),
              question: item.text,
              score: item.score
            })
          }
        })
      }
  
      if (questionsSaved && currentRound) {
        questionsSaved.filter(item => item.changed).forEach(item => {
          if (item.answer.trim() !== '') {
            votes.push({
              uid: user.uid,
              email: user.email,
              round: String(currentRound.id),
              roundTitle: currentRound.title,
              step,
              sample,
              questionId: String(item.id),
              question: item.text,
              answer: item.answer
            })
          }
        })
      } 
    } catch (error) {
      enqueueSnackbar('Oops, something went wrong', { variant: 'error' })
      setLoadingButton(false)
      return
    }

    if (votes.length > 0) {
      try {
        const result = await postVotes(token, votes)
        if (result.status !== 201) {
          throw new Error()
        }

        enqueueSnackbar('Answers are saved', { variant: 'success' })

        localStorage.removeItem(scoresNameInLocalStorage)
        localStorage.removeItem(questionsNameInLocalStorage)
      } catch (error) {
        if (error && error.response && error.response.data) {
          enqueueSnackbar(error.response.data, { variant: 'error' })
        } else {
          enqueueSnackbar('Oops, something went wrong', { variant: 'error' })
        }
      }
    }

    setLoadingButton(false)
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
        saveToLocalStorage(newScores, dataType.scores)
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
          saveToLocalStorage(newScores, dataType.scores)
          return newScores
        })
      }
    }
  }

  const saveToLocalStorage = (data, savedDataType) => {
    localStorage.setItem(getNameInLocalStorage(savedDataType), JSON.stringify(data))
  }

  const getNameInLocalStorage = savedDataType => {
    return user.uid + '_' + savedDataType + '_' + step + '_' + sample
  }

  const handleSaveClick = async (event) => {
    event.preventDefault()
    await saveData()
  }

  const handleChangeAnswer = async (value, id) => {
    setQuestions(prevQ => {
      const newQ = prevQ.map((item) => {
        if (item.id === id) {
          item.answer = value
          item.changed = true
        }
        return item
      })
      saveToLocalStorage(newQ, dataType.questions)
      return newQ
    })
  }

  if (loading) return <Loading />

  return (
    <>
      <div className='my-14 text-sm'>
        <h4 className='text-base my-3 font-bold text-center uppercase'>
          {(step === '1') && 'step 1. BEFORE TEST'}
          {(step === '2') && 'step 2. AFTER TEST'}
          {(step === '3') && 'step 3. AFTER MEETING'}
        </h4>
        <h4 className='text-xl my-5 font-bold text-center uppercase'>Sample {sample}</h4>
        <p className='my-3'>Answer for each of them about these questions giving a score from 0 to 100 where 0 is the worst and 100 is the better (please give less than 60 only if not sufficient and less than 50 only if really bad)</p>
        <p className='my-3 italic'>You can save your answers even if you didn't finish for to continue later!</p>
      </div>

      <div className='my-14 text-sm'>
        <ol className='list-decimal'>
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
          {questions.map(item => {
            return (
              <li
                key={item.id}
                className='py-3 border-b-[1px] border-slate-700'
              >
                <div className='flex flex-col'>
                  <div className='flex-1 flex flex-col'>
                    <p className='text-base'>{item.text}</p>
                    <p className='text-sm text-gray-400 italic'>{item.comment}</p>
                  </div>
                  <textarea
                    id={`score${item.id}`}
                    name={`score${item.id}`}
                    value={item.answer}
                    rows={5}
                    onChange={(e) => handleChangeAnswer(e.target.value, item.id)}
                    className='m-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3'
                  />
                </div>
              </li>
            )
          })}
        </ol>
      </div>
      <button
        type='button'
        className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mb-8'
        onClick={handleSaveClick}
        disabled={loadingButton}
      >
        <LoadingButton loadingButton={loadingButton} />
        Save my answers
      </button>
    </>
  )
}
