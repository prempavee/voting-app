import { createContext, useContext, useEffect, useState } from 'react'
import Loading from '@/components/Loading'
import { postRound, getCurrentRound, getRounds, makeRoundCurrent } from '@/api/roundsApi'
import { useAuth } from '@/context/AuthContext'

export const RoundContext = createContext({})
export const useRounds = () => useContext(RoundContext)

function generateAlphabeticalLetters(count) {
  const letters = []
  let currentCharCode = 'A'.charCodeAt(0) // Get the character code of 'A'

  for (let i = 0; i < count; i++) {
    letters.push(String.fromCharCode(currentCharCode)) // Convert character code to letter
    currentCharCode++ // Increment to the next character code
  }

  return letters
}

export const RoundContextProvider = ({
  children
}) => {
  const { token } = useAuth()

  const [currentRound, setCurrentRound] = useState()
  const [currentSamples, setCurrentSamples] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = () => {
    setLoading(true)

    if (token) {
      getCurrentRound(token)
        .then(currentRoundResponse => {
          setCurrentRound(currentRoundResponse.data)
          let samplesAmount = currentRoundResponse.data.samplesNumber ?? 10
          setCurrentSamples(generateAlphabeticalLetters(samplesAmount))
        })
        .catch(error => {
          console.log(error)
        })
        .finally(() => {
          setLoading(false)
        })
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [token])

  // ROUNDS
  const createRound = async ({ title, startDate, samplesNumber }) => {
    return await postRound(token, title, startDate, samplesNumber)
  }

  const makeCurrent = async (newId) => {
    await makeRoundCurrent(token, newId)

    const currentRoundResponse = await getCurrentRound(token)
    setCurrentRound(currentRoundResponse.data)

    return true
  }

  const getAllRounds = async () => {
    return await getRounds(token)
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

        getSamplesForRound
      }}
    >
      {loading ? <Loading /> : children}
    </RoundContext.Provider>
  )
}
