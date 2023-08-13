import React, { useState, useEffect } from 'react'
import MainContainer from '@/components/MainContainer'
import { useRounds } from '@/context/RoundContext'
import { useSnackbar } from 'notistack'
import Loading from '@/components/Loading'
import ResultsRounds from '@/components/ResultsRounds'
import RoundResults from '@/components/RoundResults'
import CurrentRoundInfo from '@/components/CurrentRoundInfo'
import SamplesInfo from '@/components/SamplesInfo'

const Results = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(true)
  const { getAllRounds } = useRounds()

  const [rounds, setRounds] = useState([])

  const [choosenRound, setChoosenRound] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    if (!loading) {
      setLoading(true)
    }
    try {
      const response = await getAllRounds()
      setRounds(response.data) 
    } catch (error) {
      console.log(error)
      enqueueSnackbar('Error while fetching data', { variant: 'error' })
    }
    setLoading(false)
  }
  const handleClickRound = async (id) => {
    setChoosenRound(id)
  }

  if (loading) return <Loading />

  return (
    <MainContainer title='Results'>
      <SamplesInfo />
      <ResultsRounds rounds={rounds} handleClickRound={handleClickRound} />
      <CurrentRoundInfo />
      <RoundResults round={choosenRound} rounds={rounds}/>
    </MainContainer>
  )
}

export default Results
