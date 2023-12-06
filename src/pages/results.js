import { useState } from 'react'
import MainContainer from '@/components/MainContainer'
import Loading from '@/components/Loading'
import ResultsRounds from '@/components/admin/RoundsListForResults'
import RoundResults from '@/components/admin/RoundResults'
import CurrentRoundInfo from '@/components/CurrentRoundInfo'
import { ROUNDS } from '@/apollo/roundsQueries'
import { useQuery } from '@apollo/client'

const Results = () => {
  const { loading, error: roundsError, data: roundsData } = useQuery(ROUNDS)
  const [choosenRound, setChoosenRound] = useState(null)

  const handleClickRound = async (id) => {
    setChoosenRound(id)
  }

  if (loading) return <Loading />

  return (
    <MainContainer title='Results'>
      <ResultsRounds rounds={roundsData.rounds} handleClickRound={handleClickRound} />
      <CurrentRoundInfo />
      <RoundResults round={choosenRound} rounds={roundsData.rounds}/>
    </MainContainer>
  )
}

export default Results
