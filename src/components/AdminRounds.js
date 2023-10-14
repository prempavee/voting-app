import { useSnackbar } from 'notistack'
import { ROUNDS, MAKE_ROUND_CURRENT, CURRENT_ROUND } from '@/apollo/roundsQueries'
import { useMutation, useQuery } from '@apollo/client'
import Loading from '@/components/Loading'
import CurrentRoundInfo from '@/components/CurrentRoundInfo'
import CreateRound from '@/components/CreateRound'

const AdminRounds = () => {
  const { enqueueSnackbar } = useSnackbar()
  const { loading, error: roundsError, data: roundsData } = useQuery(ROUNDS)
  const [makeRoundCurrent] = useMutation(MAKE_ROUND_CURRENT)

  const setCurrent = async (id) => {
    try {
      await makeRoundCurrent({
        variables: { id },
        refetchQueries: [
          { query: ROUNDS },
          { query: CURRENT_ROUND }
        ]
      })
      enqueueSnackbar('Current round is changed', { variant: 'success' })
    } catch (error) {
      console.log(error)
      enqueueSnackbar('Something went wrong', { variant: 'error' }) 
    }
  }

  if (loading) {
    return (
      <Loading />
    )
  }

  return (
    <div className='my-20'>
      <h2 className='text-xl my-5 font-bold text-center'>Rounds</h2>

      {roundsData && roundsData.rounds.length > 0
        ? (
          <ul className='flex flex-col'>
            {roundsData.rounds.map(item => {
              return (
                <li
                  key={item.id}
                  className={item.current ? 'bg-green-400 px-3 py-1.5 my-1' : 'bg-indigo-400 px-3 py-1.5 my-1'}
                >
                  <div className='flex flex-row'>
                    <div className='flex-1'>
                    {item.title} / {item.start} / {item.samplesNumber} samples
                    </div>
                    
                    <input
                      type='checkbox'
                      name='current'
                      className='ml-3'
                      checked={item.current}
                      onChange={() => setCurrent(item.id)}
                      disabled={item.current}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        )
        : (
          <p className='text-sm'>... no rounds yet</p>
        )
      }

      <CurrentRoundInfo />
      <CreateRound />
    </div>
  )
}

export default AdminRounds
