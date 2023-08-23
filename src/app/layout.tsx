import '@/styles/global.scss'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Spin App',
  description: 'Spin App Description',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="px-10 py-5">{children}</body>
    </html>
  )
}
