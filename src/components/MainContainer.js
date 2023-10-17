import Head from 'next/head'
import Navbar from './Navbar'

function MainContainer ({ children, title = '' }) {
  return (
    <>
      <Head>
        <title>{`${title} | GanjaCup`}</title>
        <meta name='description' content='' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='keywords' content='ganja cup prempavee' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className='main min-h-screen'>
        <Navbar />
        <div className='container max-w-screen-md min-h-screen font-mono px-10'>
          {children}
        </div>
      </main>
    </>
  )
}

export default MainContainer
