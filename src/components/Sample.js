import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { useAuth } from '@/context/AuthContext'
import { useLazyQuery, useMutation } from '@apollo/client'
import { VOTES_FOR_SAMPLE, POST_VOTES } from '@/apollo/votesQueries'
import { scoreQuestionsJson, textQuestionsJson } from '@/data/questions'
import Loading from '@/components/Loading'
import LoadingButton from '@/components/LoadingButton'

const dataType = {
  scores: 'scores',
  questions: 'questions'
}

export default function Sample ({ step, sample, currentRound }) {
  const [scores, setScores] = useState([])
  const [questions, setQuestions] = useState([])
  const { user } = useAuth()
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(true)
  const [loadingButton, setLoadingButton] = useState(false)
  const router = useRouter()

  const [getVotesForSample, { data }] = useLazyQuery(VOTES_FOR_SAMPLE, {
    fetchPolicy: 'cache-first'
  })

  const [postVotes, { }] = useMutation(POST_VOTES, {
    refetchQueries: [{
      query: VOTES_FOR_SAMPLE, 
      variables: {
        round: String(currentRound.id),
        step: String(step), 
        sample: sample, 
        uid: user.uid
      }
    }]
  })

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
    const scoreQuestionsSample = (JSON.parse(scoreQuestionsJson))[router.locale]
    const textQuestionsSample = (JSON.parse(textQuestionsJson))[router.locale]
    try {
      const response = await getVotesForSample({
        variables: {
          round: String(currentRound.id),
          step: String(step), 
          sample: sample, 
          uid: user.uid
        }
      })

      response.data.votesForSample.forEach(item => {
        let foundIndex = scoreQuestionsSample.findIndex((element) => Number(element.id) === Number(item.questionId))
        if (foundIndex !== -1) {
          scoreQuestionsSample[foundIndex].score = item.score ?? -1
          scoreQuestionsSample.changed = false
        }

        foundIndex = textQuestionsSample.findIndex((element) => Number(element.id) === Number(item.questionId))
        if (foundIndex !== -1) {
          textQuestionsSample[foundIndex].answer = item.answer ?? ''
          textQuestionsSample.changed = false
        }
      })    
    } catch (error) {
      console.log(error)
      enqueueSnackbar(content[router.locale].SB_ERROR_NO_INFO, { variant: 'error' })
    } finally {
      setScores(scoreQuestionsSample)
      setQuestions(textQuestionsSample)
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
      enqueueSnackbar(content[router.locale].SB_ERROR, { variant: 'error' })
      setLoadingButton(false)
      return
    }

    if (votes.length > 0) {
      try {
        const { data } = await postVotes({
          variables: {
            votes: votes,
          }
        })

        if (data.postVotes.success) {
          enqueueSnackbar(content[router.locale].SB_SUCCESS, { variant: 'success' })

          localStorage.removeItem(scoresNameInLocalStorage)
          localStorage.removeItem(questionsNameInLocalStorage)
        } else {
          enqueueSnackbar(data.postVotes.error, { variant: 'error' })
        }
      } catch (error) {
        console.log(error)
        enqueueSnackbar(content[router.locale].SB_ERROR, { variant: 'error' })
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
          {(step === '1') && content[router.locale].STEP_1}
          {(step === '2') && content[router.locale].STEP_2}
        </h4>
        <h4 className='text-xl my-5 font-bold text-center uppercase'>{content[router.locale].SAMPLE_TITLE} {sample}</h4>
        <p className='my-3'>{content[router.locale].INSTRUCTIONS_LIST[0]}</p>
        <p className='my-3 italic'>{content[router.locale].INSTRUCTIONS_LIST[1]}</p>
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
        {content[router.locale].BUTTON}
      </button>
    </>
  )
}

const content = {
  th: {
    STEP_1: 'ขั้นตอนที่ 1 ตรวจสอบช่อดอก',
    STEP_2: 'ขั้นตอนที่ 2 การทดลองสูบ',
    SAMPLE_TITLE: 'ตัวอย่าง',
    INSTRUCTIONS_LIST: [
      'ตอบคำถามแต่ละข้อเกี่ยวกับคำถามเหล่านี้ โดยให้คะแนนตั้งแต่ 0 ถึง 100',
      'เรียงจาก 0 ต่ำที่สุด และ 100 สูงที่สุด',
      '(คะแนนต่ำกว่า 60 ถือว่าไม่ผ่านเกณฑ์กลางและคะแนนต่ำกว่า 50 คุณภาพแย่มาก)',
      "You can save your answers even if you didn't finish for to continue later!",
    ],
    BUTTON: 'บันทึกคำตอบของฉัน',

    SB_ERROR: 'Oops, something went wrong',
    SB_ERROR_NO_INFO: "Oops, couldn't get saved info",
    SB_SUCCESS: 'Answers are saved'
  },
  en: {
    STEP_1: 'Step 1. Before test',
    STEP_2: 'Step 2. After test',
    SAMPLE_TITLE: 'Sample',
    INSTRUCTIONS_LIST: [
      'Answer for each of them about these questions giving a score from 0 to 100 where 0 is the worst and 100 is the better (please give less than 60 only if not sufficient and less than 50 only if really bad)',
      "You can save your answers even if you didn't finish for to continue later!",
    ],
    BUTTON: 'Save my answers',

    SB_ERROR: 'Oops, something went wrong',
    SB_ERROR_NO_INFO: "Oops, couldn't get saved info",
    SB_SUCCESS: 'Answers are saved'
  }
}
