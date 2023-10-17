import Image from 'next/image'
import { Inter } from 'next/font/google'
import Letters from '../components/letters'
import Head from 'next/head'

const inter = Inter({ subsets: ['latin'] })

export default function Dashboard() {
  return (<>
    <Head><title>Dashboard</title></Head>
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
        <h1>Dashboard Page</h1>
        <Letters />
    </main>
    </>
  )
}
