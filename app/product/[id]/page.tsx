"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "../../components/auth-provider"
import { useCart } from "../../components/cart-provider"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"
import Image from "next/image"

type Product = {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: {
    rate: number
    count: number
  }
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { addToCart } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://fakestoreapi.com/products/${id}`)
        if (!response.ok) throw new Error("Failed to fetch product")
        const data = await response.json()
        setProduct(data)
      } catch (error) {
        console.error("Error fetching product:", error)
        toast("Failed to load product details")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [id, user, toast])

  const handleAddToCart = () => {
    if (product) {
      addToCart(product)
      toast( `${product.title} has been added to your cart`)
    }
  }

  if (!user) return null

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square bg-muted animate-pulse rounded-lg" />
            <div className="space-y-4">
              <div className="h-8 bg-muted animate-pulse rounded w-3/4" />
              <div className="h-4 bg-muted animate-pulse rounded w-1/4" />
              <div className="h-4 bg-muted animate-pulse rounded" />
              <div className="h-4 bg-muted animate-pulse rounded" />
              <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Button onClick={() => router.push("/")}>Back to Products</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-4xl mx-auto p-6">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative aspect-square">
            <Image src={product.image || "/placeholder.svg"} alt={product.title} fill className="object-contain" />
          </div>
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">{product.title}</h1>
              <p className="text-sm text-muted-foreground mt-1">Category: {product.category}</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(product.rating.rate)
                        ? "fill-primary text-primary"
                        : "fill-muted text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.rating.rate}) {product.rating.count} reviews
              </span>
            </div>

            <div className="text-3xl font-bold">${product.price.toFixed(2)}</div>

            <p className="text-muted-foreground">{product.description}</p>

            <Button size="lg" onClick={handleAddToCart}>
              Add to Cart
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
