import React, { useState } from 'react'
import { useSnackbar } from 'notistack'
import MainContainer from '@/components/MainContainer'
import LoadingButton from '@/components/LoadingButton'
import { useAuth } from '@/context/AuthContext'
import { useMutation } from '@apollo/client'
import { POST_JUDGE, JUDGE } from '@/apollo/judgesQueries'
import { useRouter } from 'next/router'

export default function Introduction () {
  const [isChecked, setIsChecked] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const [formData, setFormData] = useState({ name: '', surname: '' })
  const { user, token } = useAuth()
  const [loadingButton, setLoadingButton] = useState(false)
  const { locale } = useRouter()

  const [postJudge] = useMutation(POST_JUDGE)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    
    setLoadingButton(true)

    try {
      const input = {
        uid: user.uid,
        email: user.email,
        name: formData.name,
        surname: formData.surname,
        accepted: isChecked,
      }
      await postJudge({
        variables: { input },
        refetchQueries: [{ query: JUDGE, variables: { uid: user.uid } }]
      })
    } catch (error) {
      console.log(error)
      enqueueSnackbar(content[locale].SB_ERROR, { variant: 'error' })
    } finally {
      setLoadingButton(false)
    } 
  }

  return (
    <MainContainer title='Home'>
      <h1 className='text-4xl text-center my-14 font-bold'>{content[locale].INTRO_TITLE}</h1>
      <h4 className='text-xl font-bold my-5'>
        {content[locale].INTRO_SUB_TITLE} 
      </h4>

      <div className='my-14'>
        <h4 className='text-xl my-5 font-bold text-center uppercase'>{content[locale].INSTRUCTIONS_TITLE}</h4>
        <ol className='list-decimal'>
          {content[locale].INSTRUCTIONS_LIST.map((item, key) => <li className='my-3' key={key}>
            {item}
          </li>)}
        </ol>
      </div>

      <form className='my-14 space-y-3' onSubmit={handleSubmit}>
        <h4 className='text-xl my-5 font-bold text-center uppercase'>{content[locale].FORM_TITLE}</h4>

        <div className=''>
          <label htmlFor='name' className='block text-sm font-medium leading-6'>
            {content[locale].FORM_NAME}
          </label>
          <input
            id='name'
            name='name'
            required
            value={formData.name}
            onChange={handleChange}
            className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3'
          />
        </div>

        <div className=''>
          <label htmlFor='surname' className='block text-sm font-medium leading-6'>
            {content[locale].FORM_SURNAME}
          </label>
          <input
            id='surname'
            name='surname'
            required
            value={formData.surname}
            onChange={handleChange}
            className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3'
          />
        </div>

        <div className='flex flex-row'>
          <input
            type='checkbox'
            name='acceptCheckbox'
            className='mr-3'
            checked={isChecked}
            required
            onChange={() => setIsChecked((prev) => !prev)}
          />
          <label htmlFor='acceptCheckbox' className='block text-sm font-medium leading-6 text-gray-400'>
            {content[locale].FORM_ACCEPT}
          </label>
        </div>
        
        <button
          type='submit'
          className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          disabled={loadingButton}
        >
          <LoadingButton loadingButton={loadingButton} />
          {content[locale].FORM_BUTTON}
        </button>
      </form>
    </MainContainer>
  )
}

const content = {
  th: {
    INTRO_TITLE: '1st Ganja Cup Thailand',
    INTRO_SUB_TITLE: 'ยินดีต้อนรับท่านสู่คณะกรรมการ',
    INSTRUCTIONS_TITLE: 'คำแนะนำในการเทสช่อดอก',
    INSTRUCTIONS_LIST: [
      'แบ่งเวลาไว้อย่างน้อย 1 ชั่วโมงในแต่ละครั้งเพื่อสำรวจช่อดอกและทำการทดลองสูบ',
      'อยู่เลือกสถานที่สะอาด มีแสงสว่างเพียงพอ ทำบนมีโต๊ะหรือพื้นเรียบ หลีกเลี่ยงสถานการณ์ที่มีลมแรงบุคคลอื่นหรือสัตว์ที่อาจก่อเกิดการรบกวน',
      'ใช้คอมพิวเตอร์หรือมือถือของคุณ กระดาษ ดินสอหรือปากกา (เครื่องชั่งถ้าคุณมี) เครื่องบดสมุนไพร ไฟแช็ก กระดาษแข็งสำหรับตัวกรอง กระดาษมวน บ้องหรือบุหรี่ไฟฟ้า แก้วและน้ำเปล่า'
    ],

    FORM_TITLE: 'Ready?',
    FORM_NAME: 'ชื่อจริง',
    FORM_SURNAME: 'นามสกุล',
    FORM_ACCEPT: 'ฉันเข้าใจและยอมรับคำแนะนำเบื้องต้น',
    FORM_BUTTON: "Let's go",

    SB_ERROR: 'Oops, something went wrong'
  },
  en: {
    INTRO_TITLE: '1st Ganja Cup Thailand',
    INTRO_SUB_TITLE: 'Welcome to the Jury panel',
    INSTRUCTIONS_TITLE: 'Instructions',
    INSTRUCTIONS_LIST: [
      'Take some free time to understand how it works. Around an hour will be enough for the first time, at least an hour and the feeling that is the right moment to focus on the task. If is not just wait and set up the right moment for later.',
      'Be in a place clean, well illuminated, with a table or a flat surface in front of you. Avoid windy situations other people or animals that they may generate disturbances',
      'Your computer or mobile, some paper, a pencil or a pen, a scale if you have, a metal grinder, lighter, cardboard for filters, your rolling papers or bong or vape, a glass and some fresh water.'
    ],

    FORM_TITLE: 'Ready?',
    FORM_NAME: 'Name',
    FORM_SURNAME: 'Surname',
    FORM_ACCEPT: 'I understand and accept instructions',
    FORM_BUTTON: "Let's go",

    SB_ERROR: 'Oops, something went wrong'
  }
}
