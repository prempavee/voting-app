import React from 'react'
import MainContainer from '@/components/MainContainer'
import StepsButtons from './StepsButtons'
import { useRouter } from 'next/router'

export default function Ready ({ judge }) {
  const { locale } = useRouter()

  return (
    <MainContainer title='Home'>
      <div className='my-14 text-sm'>
        <h4 className='text-xl my-5 font-bold text-center'>{content[locale].TITLE} {judge.name}!</h4>
        {content[locale].INSTRUCTIONS_LIST.map((item, key) => <p className='my-3' key={key}>
          {item}
        </p>)}
      </div>

      <StepsButtons />
    </MainContainer>
  )
}

const content = {
  th: {
    TITLE: 'Hey,',
    INSTRUCTIONS_LIST: [
      'ทุกท่านจะได้รับ Grove Bags ทั้งหมด 10 ใบที่มีตัวอย่างช่อดอกจากแต่ละผู้แข่งขัน (แต่ละถุงจะมีตัวอักษรภาษาอังกฤษระบุ) คุณมีเวลา 10 วันในการให้คะแนนและฟีดแบคจากสายพันธุ์ทั้งหมด',
      'ท่านใดที่สามารถทำส่วนตรงนี้ได้ดีจะมีโอกาสถูกเลือกเป็นคณะกรรมการในรอบชิงชนะเลิศ พร้อมลุ้นรับของรางวัลเป็นที่ตอบแทน',
      'โปรเจคนี้สร้างขึ้นมาเพื่อคอมมิวนิตี้ หากท่านเห็นส่วนไหนควรมีการปรับปรุง สามารถยื่นคำแนะนำให้กับคณะกรรมการเพื่อพัฒนาโปรเจคนี้ได้เสมอ',
      'กรุณางดแชร์การให้คะแนนช่อดอกของตนเองกับกรรมการท่านอื่นก่อนจบทัวร์นาเมนต์',
      'คุณสามารถทำการทดลองช่อดอกคนเดียวหรือร่วมกับเพื่อนที่เข้าใจระบบการให้คะแนนของพวกเรา'
    ]
  },
  en: {
    TITLE: 'Hey,',
    INSTRUCTIONS_LIST: [
      'OK, you have received 10 Grove Bags containing the Samples. Each bag contains a different strain.',
      'You have 10 days to examine them and give your feedback. If you will do this well you will be rewarded. The best jury members can be called to Judge during the finals can win Prizes and Gifts. Your contribution will be recognized.',
      'This is like an Open-Source Project. If you notice something that can be improved, write down your point and share in the private groups for Jury Members.',
      "Please don't share any information about the Samples that can influence other Jury members before the end of the tournament.",
      'You can do the Judgment alone or with trusted friends to who you have explained how it works and they are really interested to give the best contribution.'
    ]
  }
}
