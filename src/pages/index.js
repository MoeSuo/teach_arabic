import Image from 'next/image'
import { Inter } from 'next/font/google'
import Letters from '../components/letters'
import Head from 'next/head'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head><title>Home</title></Head>
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
      >
        <h1>Home Page</h1>
        <Letters />
    </main>
      </>
  )
}
