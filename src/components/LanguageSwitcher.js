import { useRouter } from 'next/router'

export default function LanguageSwitcher({ locale }) {
  const router = useRouter()

  const handleClick = e => {
    e.preventDefault()
    router.push(
      {
        pathname: router.pathname,
        query: router.query,
      },
      null,
      { locale: locale === 'th' ? 'en' : 'th' }
    )
  }
  
  return (
    <button
      type='button'
      className='flex text-sm focus:outline-none' 
      id='logout-button'
      onClick={handleClick}
    >
      <span className='text-white px-3 py-2 text-lg font-medium uppercase'>
        {locale === 'th' ? 'en' : 'th'}
      </span>
    </button>
  )
}
