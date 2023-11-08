import React from 'react'
import { useRouter } from 'next/router'

export default function Step2 () {
  const { locale } = useRouter()

  return (
    <div className='my-14 text-sm'>
      <h4 className='text-xl my-5 font-bold text-center'>{content[locale].TITLE}</h4>
      {content[locale].INSTRUCTIONS_LIST.map((item, key) => <p className='my-3' key={key}>
        {item}
      </p>)}
    </div>
  )
}

const content = {
  th: {
    TITLE: 'ขั้นตอนที่ 2 การทดลองสูบ',
    INSTRUCTIONS_LIST: [
      'คุณมีเวลาประมาณหนึ่งวันต่อหนึ่งตัวอย่างสายพันธุ์ สิ่งทีสำคัญที่สุดคือคุณใช้เวลากับแต่ละสายพันธุ์เพื่อเข้าใจแอฟเฟกและอาการเฉพาะและทิ้งเวลามากพอที่ร่างกายจะสร่างเพื่อลองสายพันธุ์ต่อไป',
      'โปรดเลือกทดลองสูบช่อดอกตามพิจารณา มิจำเป็นที่จะต้องสูบทุกตัวหากบางตัวไม่อาจเป็นอันตรายต่อสุขภาพ',
      'กรรมการทุกท่านสามารถเลือกวิธีสูบแบบไหนขึ้นอยู่กับคุณ เราไม่สามารถสร้างกฎตายตัวในการให้คะแนนในส่วน “METHOD OF INTAKE AND EFFECTS” จึงขอให้ท่านพยายามสังเกตการเปลี่ยนแปลงของจิตใจและร่างกายของคุณมากกว่าวิธีการสูบ และอย่าลืมให้คะแนนเพิ่มเติมในส่วนของ “TERPENE PROFILE DURING USE”',
      'หลังจากสูบแล้วให้กรอกคะแนน 0-100 ไปในส่วน “AFTER” โดยให้คะแนนตั้งแต่ 0 ถึง 100 เรียงจาก 0 ต่ำที่สุด และ 100 สูงที่สุด',
      'คะแนนต่ำกว่า 59 ถือว่าไม่ผ่านเกณฑ์กลาง',
      'คะแนนต่ำกว่า 49 หากคุณภาพแย่มากและอาจเป็นอันตรายต่อสุขภาพ',
      'หากคะแนนต่ำกว่า 30 ให้โปรดระบุเหตุผล',
      'การทดลองตัวอย่างที่เพียวไม่ผสมจะได้ความเม่นยำที่สุด',
      '*โปรดระบุในกระดาษคะแนนหากคุณผสมบุหรี่ สมุนไพรหรือยาเส้นอื่น ๆ'

    ]
  },
  en: {
    TITLE: 'STEP 2. AFTER TEST',
    INSTRUCTIONS_LIST: [
      "Is time to try them. Only the one you feel. <b>Ganja is a medicine and you don’t have to try all of them.</b>",
      "You have about one day for each Sample. Don’t need to rush. The best is that you take the time and give space from one test to another to clean the body from the previous high.",
      'How to do is up to you. Every individual is different. We cannot make fixed rules about the use.',
      'Try to be scientific and observe your mind and body changes than fill the section “METHOD OF INTAKE AND EFFECTS”',
      'Add some new information to the section “TERPENE PROFILE DURING USE”',
      'Give an answer to the 10 questions with a score from 0 to 100 on the section “AFTER”',
      "(Please give less than 59 only if you really don’t like and less than 49 only if you think is so bad that can even be hazardous for health. If you will give less than 30 you will have to justify the reason with some notes)",
      'Test the Ganja using the method that you are used too.',
      'If you mix with Tabak, alcohol or other substances mention them in your review.',
      'If you will test the samples pure will be much more accurate.'
    ]
  }
}
