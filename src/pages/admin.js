import React from 'react'
import MainContainer from '@/components/MainContainer'
import AdminSamples from '@/components/AdminSamples'
import AdminRounds from '@/components/AdminRounds'

const Admin = () => {
  return (
    <MainContainer title='Admin'>
      <AdminRounds />
      <AdminSamples />
    </MainContainer>
  )
}

export default Admin
