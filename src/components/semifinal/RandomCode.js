import { SEMIFINAL_CODE } from '@/apollo/semifinalCodesQueries'
import { useQuery } from '@apollo/client'
import Loading from '@/components/Loading'
import VoteReady from '@/components/semifinal/VoteReady'

const RandomCode = ({ code, sample }) => {
  const { loading, error, data } = useQuery(SEMIFINAL_CODE, { variables: { code } })

  if (loading) return <Loading />

  if (error) return (
    <div className='flex flex-col justify-center min-h-screen text-center'>
      Can't get info from server, try again later
    </div>
  )

  if (data?.semifinalCode === null || error) return (
    <div className='flex flex-col justify-center min-h-screen text-center'>
      Incorrect code
    </div>
  )

  if (data?.semifinalCode?.used) return (
    <div className='flex flex-col justify-center min-h-screen text-center'>
      This sample had been voted already
    </div>
  )

  if (!data?.semifinalCode?.used) return <VoteReady code={code} sample={sample} />
}

export default RandomCode
