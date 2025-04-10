"use client"

import { useState } from "react"
import { useAuth } from "../components/auth-provider"
import { useCart } from "../components/cart-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash, Plus, Minus, ShoppingBag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function CartPage() {
  const { user } = useAuth()
  const { items, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart()
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleCheckout = () => {
    setShowConfirmation(true)

    // Auto-close the confirmation after 4 seconds
    setTimeout(() => {
      setShowConfirmation(false)
      clearCart()
    }, 4000)
  }

  if (!user) return null

  return (
    <>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Your Cart</h1>
          {items.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearCart}>
              Clear Cart
            </Button>
          )}
        </div>

        {items.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                <ShoppingBag className="w-12 h-12 text-muted-foreground" />
                <h2 className="text-2xl font-semibold">Your cart is empty</h2>
                <p className="text-muted-foreground">Looks like you havent added anything to your cart yet.</p>
                <Button asChild>
                  <Link href="/">Browse Products</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium line-clamp-1">{item.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">${item.price.toFixed(2)} each</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                            <span className="sr-only">Decrease quantity</span>
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                            <span className="sr-only">Increase quantity</span>
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Remove item</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between font-bold">
                    <span>Total</span>
                    <span>${getCartTotal().toFixed(2)}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" size="lg" onClick={handleCheckout}>
                    Checkout
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Order placed successfully!</AlertDialogTitle>
            <AlertDialogDescription>Thank you for your order. Your items will be shipped soon.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
