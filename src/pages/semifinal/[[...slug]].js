import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import MainContainer from '@/components/MainContainer'
import RandomCode from '@/components/semifinal/RandomCode'
import Vote from '@/components/semifinal/Vote'
import { SEMIFINAL_CODE, USE_SEMIFINAL_CODE } from '@/apollo/semifinalCodesQueries'
import { useMutation, useLazyQuery } from '@apollo/client'
import Loading from '@/components/Loading'

const Semifinal = () => {
  const router = useRouter()

  return (
    <MainContainer title='Semifinal'>
      {!router.isReady && <Loading />}
      {(router?.query?.slug?.length !== 2)
        ? (<div className='flex flex-col justify-center min-h-screen text-center'>
          Incorrect link
        </div>)
        : (<RandomCode
          code={router.query.slug[0]}
          sample={router.query.slug[1]} 
        />)
      }
    </MainContainer>
  )
}

export default Semifinal

// https://www.theganjacup.com/semifinal/N9ZF6CVVZG/a
// http://localhost:3000/semifinal/N9ZF6CVVZG/a
