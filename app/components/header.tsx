"use client"

import Link from "next/link"
import { useAuth } from "./auth-provider"
import { useCart } from "./cart-provider"
import { ShoppingCart, LogOut, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function Header() {
  const { user, logout } = useAuth()
  const { getCartCount } = useCart()
  const cartCount = getCartCount()

  if (!user) return null

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          FakeStore
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-1 hover:text-primary">
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
          <Link href="/cart" className="flex items-center gap-1 hover:text-primary relative">
            <ShoppingCart className="w-4 h-4" />
            <span>Cart</span>
            {cartCount > 0 && (
              <Badge variant="destructive" className="absolute -top-3 -right-3">
                {cartCount}
              </Badge>
            )}
          </Link>
          <Button variant="ghost" size="sm" onClick={logout} className="flex items-center gap-1">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
        </nav>
      </div>
    </header>
  )
}
