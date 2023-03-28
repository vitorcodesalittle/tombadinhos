import TopBar from '@/components/TopBar'
import './globals.css'
import ClientLayout from '@/components/ClientLayout'

export const metadata = {
  title: 'Tombadinhos',
  description: 'Explore edifícios tombados em Recife',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
          <ClientLayout>
          <TopBar />
          {children}
          </ClientLayout>
      </body>
    </html>
  )
}
