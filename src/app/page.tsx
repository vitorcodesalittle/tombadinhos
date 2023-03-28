import Image from 'next/image'
import { Inter } from 'next/font/google'
import HomeView from '@/components/views/HomeView'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main style={{border: '1px solid black', display: 'flex', flexDirection: 'column', alignItems: 'center',}}>
      <HomeView/>
    </main>
  )
}
