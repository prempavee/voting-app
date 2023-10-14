import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

const SuperCup = () => {
  const router = useRouter()
  const [step, setStep] = useState()
  const [sample, setSample] = useState()

  useEffect(() => {
    if (router.query.step.length === 2) {
      setStep(router.query.step[0])
      setSample(router.query.step[1])
    } else {
      setStep(null)
      setSample(null)
    }
  }, [router.query.slug])
}

export default SuperCup
