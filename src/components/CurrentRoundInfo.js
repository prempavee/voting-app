import { CURRENT_ROUND } from '@/apollo/roundsQueries'
import { useQuery } from '@apollo/client'

const CurrentRoundInfo = () => {
  const { loading: loading, error: error, data: data } = useQuery(CURRENT_ROUND)
  
  if (!data) return null
  return(
    <div className='my-8'>
      <h3 className='font-bold mb-2'>Current round</h3>
      {data.currentRound
        ? <p className='text-green-500'>{data.currentRound.title} / {data.currentRound.start} </p>
        : <p className='text-red-500'>NO ANY CURRENT ROUND!</p>
      }
    </div>
  )
}

export default CurrentRoundInfo