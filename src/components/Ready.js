import React from 'react'
import MainContainer from '@/components/MainContainer'
import { useRounds } from '@/context/RoundContext'
import StepsButtons from './StepsButtons'

export default function Ready ({ judge }) {
  const { samples } = useRounds()

  return (
    <MainContainer title='Home'>
      <div className='my-14 text-sm'>
        <h4 className='text-xl my-5 font-bold text-center'>Hey, {judge.name}!</h4>
        <p className='my-3'>OK, you have received 10 Grove Bags containing the Samples. Each bag contains a different strain.</p>
        <p className='my-3'>You have 10 days to examine them and give your feedback. If you will do this well you will be rewarded. The best jury members can be called to Judge during the finals can win Prizes and Gifts. Your contribution will be recognized.</p>
        <p className='my-3'>This is like an Open-Source Project. If you notice something that can be improved, write down your point and share in the private groups for Jury Members.</p>
        <p className='my-3'>Please don’t share any information about the Samples that can influence other Jury members before the end of the tournament.</p>
        <p className='my-3'>You can do the Judgment alone or with trusted friends to who you have explained how it works and they are really interested to give the best contribution.</p>
      </div>

      <StepsButtons />
    </MainContainer>
  )
}
