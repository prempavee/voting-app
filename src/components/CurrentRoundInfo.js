import { useRounds } from '@/context/RoundContext'

const CurrentRoundInfo = () => {
  const { currentRound } = useRounds()
  
  return(
    <div className='my-5'>
      <h3 className='font-bold mb-2'>Current round</h3>
      {currentRound
        ? <p className='text-green-500'>{currentRound.title} / {currentRound.start} </p>
        : <p className='text-red-500'>NO ANY CURRENT ROUND!</p>
      }
    </div>
  )
}

export default CurrentRoundInfo