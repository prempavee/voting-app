import { useState } from 'react'
import MainContainer from '@/components/MainContainer'
import { useSnackbar } from 'notistack'
import Loading from '@/components/Loading'
import ResultsRounds from '@/components/RoundsListForResults'
import RoundResults from '@/components/RoundResults'
import CurrentRoundInfo from '@/components/CurrentRoundInfo'
// import SamplesInfo from '@/components/SamplesInfo'
import { ROUNDS } from '@/apollo/roundsQueries'
import { useQuery } from '@apollo/client'

const Results = () => {
  const { enqueueSnackbar } = useSnackbar()
  // const [loading, setLoading] = useState(true)

  const { loading, error: roundsError, data: roundsData } = useQuery(ROUNDS)

  const [choosenRound, setChoosenRound] = useState(null)

  const handleClickRound = async (id) => {
    setChoosenRound(id)
  }

  if (loading) return <Loading />

  return (
    <MainContainer title='Results'>
      {/* <SamplesInfo /> */}
      <ResultsRounds rounds={roundsData.rounds} handleClickRound={handleClickRound} />
      <CurrentRoundInfo />
      <RoundResults round={choosenRound} rounds={roundsData.rounds}/>
    </MainContainer>
  )
}

export default Results
