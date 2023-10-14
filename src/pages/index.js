import React from 'react'
import Ready from '@/components/Ready'
import Loading from '@/components/Loading'
import { useSnackbar } from 'notistack'
import Introduction from '@/components/Introduction'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import { JUDGE } from '@/apollo/judgesQueries'

export default function Home () {
  const { enqueueSnackbar } = useSnackbar()
  const { user, admin } = useAuth()
  const router = useRouter()

  const { loading, error, data } = useQuery(JUDGE, {
    variables: { uid: user.uid}
  })

  if (error) {
    console.log(error)
    enqueueSnackbar('Error while getting data...', { variant: 'error' })
  }

  if (loading) {
    return <Loading />
  }

  if (admin) {
    router.push('/admin')
  }

  if (!data || !data.judge || !data.judge.accepted) {
    return (
      <Introduction />
    )
  } else {
    return (
      <Ready judge={data.judge}/>
    )
  }
}
