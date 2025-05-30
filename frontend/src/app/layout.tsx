import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { CartProvider } from "@/contexts/cart-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FlowerShop - Цветочный магазин",
  description: "Свежие цветы и букеты с доставкой по городу",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Toaster />
        </CartProvider>
      </body>
    </html>
  )
}
