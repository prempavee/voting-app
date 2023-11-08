import React from 'react'
import { useRouter } from 'next/router'

export default function Step1 () {
  const { locale } = useRouter()

  return (
    <div className='my-14 text-sm'>
      <h4 className='text-xl my-5 font-bold text-center'>{content[locale].TITLE}</h4>
      <p className='my-3'>{content[locale].LINE1}</p>
      <p className='my-3'>{content[locale].LINE2}</p>
      <p className='my-3 italic'>{content[locale].LINE3}</p>
    </div>
  )
}

const content = {
  th: {
    TITLE: 'ขั้นตอนที่ 1 ตรวจสอบช่อดอก',

    LINE1: 'ก่อนเริ่ม ให้ท่านปิดตาและเปิดถุงดมตัวอย่างทีละสายพันธุ์ กลิ่นเป็นยังไงบ้าง? มีกลิ่นเทอร์ปีนไหนชัดเจนบ้าง? แล้วจดคะแนนของแต่ละดอกลงไปในส่วน "TERPENE PROFILE"',
    LINE2: 'นำช่อดอกออกจากถุงทั้งหมด * ระวังอย่าให้สลับกัน และเริ่มให้คะแนนจากจากรูปลักษณ์ภายนอกเท่านั้น กรอกคะแนน 0-100 ไปในส่วน “BEFORE” โดยให้คะแนนตั้งแต่ 0 ถึง 100 เรียงจาก 0 ต่ำที่สุด และ 100 สูงที่สุด ',
    LINE3: `คะแนนต่ำกว่า 59 ถือว่าไม่ผ่านเกณฑ์กลาง
            คะแนนต่ำกว่า 49 หากคุณภาพแย่มากและอาจเป็นอันตรายต่อสุขภาพ
            หากคะแนนต่ำกว่า 30 ให้โปรดระบุเหตุผล
            `
  },
  en: {
    TITLE: 'STEP 1. BEFORE TEST',
    LINE1: 'Keep your eyes closed and just smell, one by one, all the samples, closing the bag immediately after. How is the scent? Is nice or not? What remember to you? TAKE NOTE ONE BY ONE ON THE SECTION “TERPENE PROFILE”.',
    LINE2: 'Now take them all Out. Be very careful: do not messing up with their respective letters! Now evaluate them only from the outlook answering to the 10 Questions of the section “BEFORE” giving a score from 0 to 100 where 0 is the worst and 100 the best.',
    LINE3: "(Please give less than 59 only if you really don’t like and less than 49 only if you think is so bad that can even be hazardous for health. If you will give less than 30 you will have to justify the reason with some notes)"
  }
}
