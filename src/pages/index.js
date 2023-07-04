import React, { useEffect, useState } from 'react'
import Ready from '@/components/Ready'
import Loading from '@/components/Loading'
import { useSnackbar } from 'notistack'
import Introduction from '@/components/Introduction'
import { getJudgeByUid } from '@/api/judgesApi'
import { useAuth } from '@/context/AuthContext'

export default function Home () {
  const { enqueueSnackbar } = useSnackbar()
  const { user, token } = useAuth()
  const [judge, setJudge] = useState()
  const [loading, setLoading] = useState(true)

  const fetchData = () => {
    getJudgeByUid(token, user.uid)
      .then(result => {
        setJudge(result.data)
      })
      .catch(error => {
        console.log(error)
        enqueueSnackbar('Error while getting data...', { variant: 'error' })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    setLoading(true)
    if (token && user) {
      fetchData()
    }
  }, [user, token])

  if (loading) {
    return <Loading />
  }

  if (!judge) {
    return (
      <Introduction fetchData={fetchData} />
    )
  } else {
    return (
      <Ready judge={judge} />
    )
  }
}
