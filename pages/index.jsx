import Head from 'next/head'
import Image from 'next/image'

const Home = () => {
  return (
    <div className="">
      <Head>
        <title>Little Hearts</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center"></main>
    </div>
  )
}

export default Home
