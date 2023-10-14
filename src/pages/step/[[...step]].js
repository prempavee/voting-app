import React, { useEffect, useState } from 'react'
import MainContainer from '@/components/MainContainer'
import SamplesButtonList from '@/components/SamplesButtonLists'
import { useRouter } from 'next/router'
import Step1 from '@/components/steps/Step1'
import Step2 from '@/components/steps/Step2'
import Sample from '@/components/Sample'
import StepsButtons from '@/components/StepsButtons'
import SamplesInfo from '@/components/SamplesInfo'
import { useQuery } from '@apollo/client'
import { CURRENT_ROUND } from '@/apollo/roundsQueries'
import Loading from '@/components/Loading'
import generateAlphabeticalLetters from '@/utils/generateAlphabeticalLetters'

export default function Step () {
  const router = useRouter()

  const [samples, setSamples] = useState([])

  const { loading, error, data } = useQuery(CURRENT_ROUND)

  useEffect(() => {
    if (!loading && !error && data && data.currentRound) {
      setSamples(generateAlphabeticalLetters(data.currentRound.samplesNumber))
    }
  }, [loading, data, error])

  if (loading) return <Loading />

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
    }

    return (
      <MainContainer title={`Step ${step}`}>
        {stepInfo}

        <SamplesInfo samples={samples} />
        <SamplesButtonList samples={samples} step={step} />
        <StepsButtons step={step} />
      </MainContainer>
    )
  } else if (router.query.step.length === 2) {
    const step = router.query.step[0]
    const sample = router.query.step[1]
    return (
      <MainContainer title={`Sample ${sample} | Step ${step}`}>
        <Sample step={step} sample={sample} key={router.asPath} currentRound={data.currentRound} />
        <SamplesButtonList step={step} samples={samples} sample={sample} />
        <StepsButtons step={step} />
      </MainContainer>
    )
  }
}
