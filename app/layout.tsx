import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Spendwise - Expense Management',
  description: 'Smart expense tracking and management for individuals and groups',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
