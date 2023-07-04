import React from 'react'
import MainContainer from '@/components/MainContainer'
import SamplesButtonList from '@/components/SamplesButtonLists'
import { useRouter } from 'next/router'
import Step1 from '@/components/steps/Step1'
import Step2 from '@/components/steps/Step2'
import Step3 from '@/components/steps/Step3'
import Sample from '@/components/Sample'
import StepsButtons from '@/components/StepsButtons'

export default function Step () {
  const router = useRouter()

  if (router.query.step.length === 1) {
    let stepInfo
    const step = router.query.step[0]
    switch (step) {
      case '1':
        stepInfo = <Step1 />
        break
      case '2':
        stepInfo = <Step2 />
        break
      case '3':
        stepInfo = <Step3 />
        break
    }

    return (
      <MainContainer title={`Step ${step}`}>
        {stepInfo}
        <SamplesButtonList step={step} />
        <StepsButtons step={step} />
      </MainContainer>
    )
  } else if (router.query.step.length === 2) {
    const step = router.query.step[0]
    const sample = router.query.step[1]
    return (
      <MainContainer title={`Sample ${sample} | Step ${step}`}>
        <Sample step={step} sample={sample} />
        <SamplesButtonList step={step} sample={sample} />
        <StepsButtons step={step} />
      </MainContainer>
    )
  }
}
