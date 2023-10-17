import Image from 'next/image'
import { Inter } from 'next/font/google'
import Letters from '../components/letters'
import Head from 'next/head'

const inter = Inter({ subsets: ['latin'] })

export default function Projects() {
  return (<>
    <Head><title>Projects</title></Head>
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
        <h1>Projects Page</h1>
        <Letters />
    </main>
    </>
  )
}
