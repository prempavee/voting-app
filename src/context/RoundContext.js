import { createContext, useContext, useEffect, useState } from 'react'
import Loading from '@/components/Loading'
import { postSample, getSamples } from '@/api/samplesApi'
import { postRound, getCurrentRound, getRounds, makeRoundCurrent } from '@/api/roundsApi'
import { useAuth } from '@/context/AuthContext'

export const RoundContext = createContext({})
export const useRounds = () => useContext(RoundContext)

export const RoundContextProvider = ({
  children
}) => {
  const { token } = useAuth()

  const [currentRound, setCurrentRound] = useState()
  const [samples, setSamples] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = () => {
    setLoading(true)

    if (token) {
      Promise.all([getSamples(token), getCurrentRound(token)])
        .then(([samplesResponse, currentRoundResponse]) => {
          setSamples(samplesResponse.data)
          setCurrentRound(currentRoundResponse.data)
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
  const createRound = async ({ title, startDate }) => {
    return await postRound(token, title, startDate)
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

  // SAMPLES
  const createSample = async (newSample) => {
    return await postSample(token, newSample)
  }

  return (
    <RoundContext.Provider
      value={{
        getAllRounds,
        createRound,
        makeCurrent,

        currentRound,

        samples,
        createSample
      }}
    >
      {loading ? <Loading /> : children}
    </RoundContext.Provider>
  )
}
