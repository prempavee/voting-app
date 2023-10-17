import { useState, useEffect } from 'react'
import MainContainer from '@/components/MainContainer'
import Loading from '@/components/Loading'
import { SEMIFINAL_VOTES } from '@/apollo/semifinalVotesQueries'
import { useQuery } from '@apollo/client'
import { semifinalQuestionsJson } from '@/data/semifinal'
import generateSamples from '@/utils/generateAlphabeticalLetters'

const Results = () => {
  const { loading, error, data } = useQuery(SEMIFINAL_VOTES)
  const questions = JSON.parse(semifinalQuestionsJson)

  const [samples, setSamples] = useState(generateSamples(15))
  const [votes, setVotes] = useState()

  useEffect(() => {
    if (data) {
      const _votes = {}
      for (const s of samples) {
        _votes[s] = {
          votes: [],
          summ: [0, 0, 0],
          total: 0
        }
      }
      data.semifinalVotes.forEach(item => {
        const _sample = item.sample.toUpperCase()
        _votes[_sample].votes.push({
          q1: item.q1,
          q2: item.q2,
          q3: item.q3
        })
        _votes[_sample].summ[0] += item.q1
        _votes[_sample].summ[1] += item.q2
        _votes[_sample].summ[2] += item.q3
      })

      data.semifinalVotes.forEach(item => {
        const _sample = item.sample.toUpperCase()
        const _totalVotes = _votes[_sample].votes.length
        if (_totalVotes !== 0) {
          _votes[_sample].summ[0] = _votes[_sample].summ[0] / _totalVotes
          _votes[_sample].summ[1] = _votes[_sample].summ[1] / _totalVotes
          _votes[_sample].summ[2] = _votes[_sample].summ[2] / _totalVotes
        }

        _votes[_sample].total = _votes[_sample].summ[0] + _votes[_sample].summ[1] + _votes[_sample].summ[2]
      })

      setVotes(_votes)
    }
  }, [data])

  if (error) return <p>Can't get data</p>

  if (loading || !votes) return <Loading />

  return (
    <MainContainer title='Semifinal Results'>
      <div className='mt-20'>
        <h1 className='text-xl text-center font-bold'>Semifinal results</h1>

        <div className='my-12'>
          <h3 className='text-center font-bold'>Questions</h3>
          <ol className='list-decimal' >
            {questions.map(item => <li key={item.id}>{item.text}</li>)}
          </ol>
        </div>

        <ul className='my-12'>
          {samples.map(item => <li key={item}>
            {item}: {votes[item].total}
          </li>)}
        </ul>

        <div className='my-12 flex flex-row flex-wrap flex-start'>
          {samples.map(item => <div className='flex flex-col m-4'>
            <h4 className='text-center text-l font-bold'>{item}: {votes[item].total}</h4>
            <table key={item}>
              <thead className='bg-green-600'>
                <tr>
                  <th key='q1' className='border border-slate-400'>q1</th>
                  <th key='q2' className='border border-slate-400'>q2</th>
                  <th key='q3' className='border border-slate-400'>q3</th>
                  {/* <th key='sum' className='border border-slate-400' rowSpan={2}>Summ</th> */}
                </tr>
              </thead>
              <tbody>
                {votes[item].votes.map(vote => <tr>
                  <td key='q1' className='border border-slate-400 text-right'>{vote.q1}</td>
                  <td key='q2' className='border border-slate-400 text-right'>{vote.q2}</td>
                  <td key='q3' className='border border-slate-400 text-right'>{vote.q3}</td> 
                </tr>)}
              </tbody>
              <tfoot className='bg-violet-800'>
                <tr>
                  <th key='q1' className='border border-slate-400 text-right'>{votes[item].summ[0]}</th>
                  <th key='q2' className='border border-slate-400 text-right'>{votes[item].summ[1]}</th>
                  <th key='q3' className='border border-slate-400 text-right'>{votes[item].summ[2]}</th>
                </tr>
              </tfoot>
            </table>
          </div>)}
        </div>
      </div>
    </MainContainer>
  )
}

export default Results
