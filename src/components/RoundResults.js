import React, { useState, useEffect } from 'react'
import { getAllVotesForRound } from '@/api/votesApi'
import { useAuth } from '@/context/AuthContext'
import { scoreQuestionsJson, textQuestionsJson } from '@/data/questions'
import { useSnackbar } from 'notistack'
import { useRounds } from '@/context/RoundContext'
import { getAllJudges } from '@/api/judgesApi'
import Loading from './Loading'

const RoundResults = ({ round, rounds }) => {
  const { token } = useAuth()
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(true)
  const { samples } = useRounds()
  const [judgesArray, setJudgesArray] = useState([])
  const [votes, setVotes] = useState()
  const [roundTitle, setRoundTitle] = useState()

  const scoreQuestions = JSON.parse(scoreQuestionsJson)
  const textQuestions = JSON.parse(textQuestionsJson)

  useEffect(() => {
    fetchData()
    if (round) {
      const r = rounds.find(item => item.id === round)
      setRoundTitle(`${r.title} / ${r.start}`)
    }
  }, [round])

  const fetchData = () => {
    if (round === null) return

    setLoading(true)

    Promise.all([getAllVotesForRound(token, round), getAllJudges(token)])
      .then(([votesData, judgesData]) => {
        processJudges(judgesData.data)
        processVotes(votesData.data.data)
      })
      .catch(error => {
        console.log(error)
        enqueueSnackbar('Error while fetching data', { variant: 'error' })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const processJudges = data => {
    const jArray = []
    data.forEach(row => {
      const { uid, name, surname } = row
      jArray.push({ uid, name, surname })
    })

    setJudgesArray(jArray)
  }

  const processVotes = data => {
    const groupedVotes = {}

    samples.forEach(sample => {
      groupedVotes[sample.symbol.toLowerCase()] = {
        finalResult: 0
      }
    })

    data.forEach(row => {
      const { sample, uid, questionId, step, score, answer } = row
      const questionGroup = `question_${questionId}`
      const stepGroup = `step_${step}`

      if (!groupedVotes[sample][questionGroup]) {
        groupedVotes[sample][questionGroup] = {
          scores: [],
          result: 0
        }
      }

      if (!groupedVotes[sample][questionGroup][uid]) {
        groupedVotes[sample][questionGroup][uid] = {}
      }

      if (!groupedVotes[sample][questionGroup][uid][stepGroup]) {
        groupedVotes[sample][questionGroup][uid][stepGroup] = {}
      }

      groupedVotes[sample][questionGroup][uid][stepGroup] = { score, answer }

      if (score >= 0) {
        groupedVotes[sample][questionGroup].scores.push(score)
        groupedVotes[sample][questionGroup].result = getResult(groupedVotes[sample][questionGroup].scores)
        groupedVotes[sample].finalResult += groupedVotes[sample][questionGroup].result
      }
    })

    setVotes(groupedVotes)
  }

  const getResult = (scoresArray) => {
    if (scoresArray && scoresArray.length > 0) {
      return parseFloat(((scoresArray.reduce((sum, current) => sum + current, 0)) / scoresArray.length).toFixed(2))
    } else {
      return 0
    }
  }

  if (round === null) return null
  if (loading) return <Loading />

  return (
    <>
      <h2 className='text-4xl text-center my-14 font-bold'>{roundTitle}</h2>
      {samples.map(sample => (
        <div className='my-14' key={sample.id}>
          <h3 className='text-xl font-bold my-5 text-center'>Sample {sample.symbol}: {votes[sample.symbol.toLowerCase()]?.finalResult}</h3>
          <div className='overflow-x-auto'>
            <table className='table-auto border-separate border-spacing-0.5 border border-slate-400'>
              <thead className='bg-slate-400'>
                <tr key='head1'>
                  <th key='questions' className='border border-slate-400' rowSpan={2}>Questions</th>
                  {judgesArray.map((judge) => (
                    <th key={judge.uid} className='border border-slate-400' colSpan={3}>
                      {judge.name} {judge.surname}
                    </th>
                  ))}
                  <th key='sum' className='border border-slate-400' rowSpan={2}>Summ</th>
                </tr>
                <tr key='head2'>
                  {judgesArray.map((judge) => (
                    <React.Fragment key={judge.id}>
                      <th key={1} className='border border-slate-400'>1</th>
                      <th key={2} className='border border-slate-400'>2</th>
                      <th key={3} className='border border-slate-400'>3</th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scoreQuestions.map(q => (
                  <tr key={q.id}>
                    <td key='questions' className='border border-slate-400'>{q.text}</td>
                    {judgesArray.map((judge) => (
                      <React.Fragment key={judge.id}>
                        <td key={1} className='border border-slate-400'>{votes[sample.symbol.toLowerCase()]?.[`question_${q.id}`]?.[judge.uid]?.step_1?.score}</td>
                        <td key={2} className='border border-slate-400'>{votes[sample.symbol.toLowerCase()]?.[`question_${q.id}`]?.[judge.uid]?.step_2?.score}</td>
                        <td key={3} className='border border-slate-400'>{votes[sample.symbol.toLowerCase()]?.[`question_${q.id}`]?.[judge.uid]?.step_3?.score}</td>
                      </React.Fragment>
                    ))}
                    <td key='result' className='border border-slate-400'>{votes[sample.symbol.toLowerCase()]?.[`question_${q.id}`]?.result}</td>
                  </tr>
                ))}
                {textQuestions.map(q => (
                  <tr key={q.id}>
                    <td key='questions' className='border border-slate-400'>{q.text}</td>
                    {judgesArray.map((judge) => (
                      <React.Fragment key={judge.id}>
                        <td key={1} className='border border-slate-400'>{votes[sample.symbol.toLowerCase()]?.[`question_${q.id}`]?.[judge.uid]?.step_1?.answer}</td>
                        <td key={2} className='border border-slate-400'>{votes[sample.symbol.toLowerCase()]?.[`question_${q.id}`]?.[judge.uid]?.step_2?.answer}</td>
                        <td key={3} className='border border-slate-400'>{votes[sample.symbol.toLowerCase()]?.[`question_${q.id}`]?.[judge.uid]?.step_3?.answer}</td>
                      </React.Fragment>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </>
  )

}

export default RoundResults
