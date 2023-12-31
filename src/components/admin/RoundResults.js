import React, { useState, useEffect } from 'react'
import { scoreQuestionsJson, textQuestionsJson } from '@/data/questions'
import { useSnackbar } from 'notistack'
import Loading from '@/components/Loading'
import generateAlphabeticalLetters from '@/utils/generateAlphabeticalLetters'
import { useLazyQuery } from '@apollo/client'
import { ALL_VOTES_FOR_ROUND } from '@/apollo/votesQueries'
import { JUDGES } from '@/apollo/judgesQueries'

const RoundResults = ({ round, rounds }) => {
  const { enqueueSnackbar } = useSnackbar()

  const [loading, setLoading] = useState(true)
  const [samples, setSamples] = useState([])
  const [judgesArray, setJudgesArray] = useState([])
  const [votes, setVotes] = useState()
  const [roundTitle, setRoundTitle] = useState()

  const scoreQuestions = (JSON.parse(scoreQuestionsJson)).en
  const textQuestions = (JSON.parse(textQuestionsJson)).en

  const [allVotesForRound, { data: votesData }] = useLazyQuery(ALL_VOTES_FOR_ROUND, {
    fetchPolicy: 'cache-first'
  })

  const [judges, { data: judgesData }] = useLazyQuery(JUDGES, {
    fetchPolicy: 'cache-first'
  })

  useEffect(() => {
    if (round) {
      const r = rounds.find(item => item.id === round)
      setRoundTitle(`${r.title} / ${r.start}`)
      setSamples(generateAlphabeticalLetters(r.samplesNumber))
    }
  }, [round])

  useEffect(() => {
    if (round && samples.length > 0) {
      fetchData()
    }
  }, [round, samples])

  const fetchData = () => {
    if (round === null || samples.length === 0) return

    setLoading(true)

    Promise.all([
      judges(), 
      allVotesForRound({
        variables: {
          round: String(round)
        }
      })])
      .then(([responseJudges, responseVotes]) => {
        processJudges(responseJudges.data.judges)
        processVotes(responseVotes.data.allVotesForRound)
      })
      .catch((error) => {
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

  const processVotes = (data) => {
    const groupedVotes = {}

    samples.forEach(sample => {
      groupedVotes[sample.toLowerCase()] = {
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
      }
    })

    samples.forEach(sample => {
      const sampleSymbol = sample.toLowerCase()
  
      scoreQuestions.forEach(q => {
        const questionGroup = `question_${q.id}`
        if (groupedVotes[sampleSymbol] && groupedVotes[sampleSymbol][questionGroup]) {
          groupedVotes[sampleSymbol].finalResult += groupedVotes[sampleSymbol]?.[questionGroup].result ?? 0
        }
      })
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

  if (round === null) return <p className='my-14 font-bold text-red-500'>* No round choosen, pick a round from the list above</p>
  if (loading || !votes) return <Loading />

  return (
    <>
      <h2 className='text-4xl text-center my-14 font-bold'>{roundTitle}</h2>
      <ol>
      {samples.map(sample => <li key={sample}>{sample}: {votes[sample.toLowerCase()]?.finalResult}</li>)}
      </ol>
      {samples.map(sample => (
        <div className='my-14 results-table' key={sample}>
          <h3 className='text-xl font-bold my-5 text-center'>Sample {sample}: {votes[sample.toLowerCase()]?.finalResult}</h3>
          <div className='overflow-x-auto'>
            <table key={sample} className='table-auto border-collapse border-spacing-0 border border-white text-sm'>
              <thead key='head' className='bg-green-600'>
                <tr key='head1'>
                  <th key='questions' className='border border-white' rowSpan={2}>Questions</th>
                  {judgesArray.map((judge) => (
                    <th key={judge.uid} className='border border-white' colSpan={2}>
                      {judge.name} {judge.surname}
                    </th>
                  ))}
                  <th key='sum' className='border border-white' rowSpan={2}>Summ</th>
                </tr>
                <tr key='head2'>
                  {judgesArray.map((judge) => (
                    <React.Fragment key={judge.id}>
                      <th key={1} className='border border-white'>1</th>
                      <th key={2} className='border border-white'>2</th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody key='body'>
                {scoreQuestions.map(q => (
                  <tr key={q.id}>
                    <td key='questions' className='border border-white'>{q.text}</td>
                    {judgesArray.map((judge) => (
                      <React.Fragment key={judge.id}>
                        <td key={1} className='border border-white text-center'>{votes[sample.toLowerCase()]?.[`question_${q.id}`]?.[judge.uid]?.step_1?.score}</td>
                        <td key={2} className='border border-white text-center'>{votes[sample.toLowerCase()]?.[`question_${q.id}`]?.[judge.uid]?.step_2?.score}</td>
                      </React.Fragment>
                    ))}
                    <td key='result' className='border border-white text-center'>{votes[sample.toLowerCase()]?.[`question_${q.id}`]?.result}</td>
                  </tr>
                ))}
                {textQuestions.map(q => (
                  <tr key={q.id}>
                    <td key='questions' className='border border-white'>{q.text}</td>
                    {judgesArray.map((judge) => (
                      <React.Fragment key={judge.id}>
                        <td key={1} className='border border-white text-sm align-top'>{votes[sample.toLowerCase()]?.[`question_${q.id}`]?.[judge.uid]?.step_1?.answer}</td>
                        <td key={2} className='border border-white text-sm align-top'>{votes[sample.toLowerCase()]?.[`question_${q.id}`]?.[judge.uid]?.step_2?.answer}</td>
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
