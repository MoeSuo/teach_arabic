import Image from 'next/image'
import { Inter } from 'next/font/google'
import Letters from '../components/letters'
import Head from 'next/head'

const inter = Inter({ subsets: ['latin'] })

export default function Pricing() {
  return (<>
    <Head><title>Pricing</title></Head>
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
        <h1>Pricing Page</h1>
        <Letters />
    </main>
    </>
  )
}
