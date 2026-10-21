import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Passport LATAM | Nalytrace',
  description: 'Digital Identity & Product Verification Infrastructure on Stellar',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}