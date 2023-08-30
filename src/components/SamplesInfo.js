import { useRounds } from '@/context/RoundContext'

const SamplesInfo = () => {
  const { currentSamples } = useRounds()

  if (currentSamples && currentSamples.length > 0) {
    return null
  } else {
    return <p className='text-sm text-red-500 my-5'>... no samples yet or there's a network problem</p>
  }
}

export default SamplesInfo
