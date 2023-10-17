import { useState } from 'react'
import UserInfo from '@/components/semifinal/UserInfo'
import Vote from '@/components/semifinal/Vote'
import Loading from '@/components/Loading'

const VoteReady = ({ code, sample }) => {
  const [email, setEmail] = useState()

  const submitEmail = (_email) => {
    setEmail(_email)
  }

  console.log('email', email)

  return (
    <div className='flex flex-col justify-center min-h-screen'>
      {email
        ? <Vote email={email} code={code} sample={sample} />
        : <UserInfo submitEmail={submitEmail} />
      }
    </div>
  )
}

export default VoteReady
