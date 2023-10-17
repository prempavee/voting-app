import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import MainContainer from '@/components/MainContainer'
import UserInfo from '@/components/semifinal/UserInfo'
import Vote from '@/components/semifinal/Vote'
import { SEMIFINAL_CODE, USE_SEMIFINAL_CODE } from '@/apollo/semifinalCodesQueries'
import { useMutation, useLazyQuery } from '@apollo/client'
import Loading from '@/components/Loading'

const Semifinal = () => {
  return (
  <MainContainer title='Semifinal'>
    <div className='flex flex-col justify-center min-h-screen text-center'>
      Incorrect link
    </div>
  </MainContainer>
  )
}

export default Semifinal
