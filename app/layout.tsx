import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "./components/header"
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "./components/auth-provider"
import { CartProvider } from "./components/cart-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "E-Commerce App",
  description: "E-Commerce App with Fake Store API",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
          <AuthProvider>
            <CartProvider>
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 container mx-auto py-6 px-4">{children}</main>
                <Toaster />
              </div>
            </CartProvider>
          </AuthProvider>
      </body>
    </html>
  )
}
