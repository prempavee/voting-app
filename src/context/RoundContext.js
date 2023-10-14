import { createContext, useContext, useEffect, useState } from 'react'
import Loading from '@/components/Loading'
import { useRounds, useCurrentRound, useCreateRound, useMakeRoundCurrent } from '@/api/roundsApi' // Import GraphQL hooks
import { useAuth } from '@/context/AuthContext'

export const RoundContext = createContext({})
export const useRoundsContext = () => useContext(RoundContext)

function generateAlphabeticalLetters(count) {
  const letters = []
  let currentCharCode = 'A'.charCodeAt(0)

  for (let i = 0; i < count; i++) {
    letters.push(String.fromCharCode(currentCharCode))
    currentCharCode++
  }

  return letters
}

export const RoundContextProvider = ({ children }) => {
  const { token } = useAuth()

  const [currentRound, setCurrentRound] = useState()
  const [currentSamples, setCurrentSamples] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)

    try {
      const { data: currentRoundData } = await useCurrentRound(token)
      setCurrentRound(currentRoundData.currentRound)
      let samplesAmount = currentRoundData.currentRound?.samplesNumber ?? 10
      setCurrentSamples(generateAlphabeticalLetters(samplesAmount))
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [token])

  // ROUNDS
  const createRound = async ({ title, startDate, samplesNumber }) => {
    try {
      const { data } = await useCreateRound(token, title, startDate, samplesNumber)
      return data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const makeCurrent = async (newId) => {
    try {
      await useMakeRoundCurrent(token, newId)
      fetchData() // Refetch current round data
      return true
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const getAllRounds = async () => {
    try {
      const { data } = await useRounds(token)
      return data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const getSamplesForRound = (round) => {
    return generateAlphabeticalLetters(round.samplesNumber)
  }

  return (
    <RoundContext.Provider
      value={{
        getAllRounds,
        createRound,
        makeCurrent,
        currentRound,
        currentSamples,
        getSamplesForRound,
      }}
    >
      {loading ? <Loading /> : children}
    </RoundContext.Provider>
  )
}
