"use client"

import { useEffect, useState } from "react"
import { useAuth } from "./auth-provider"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCart } from "./cart-provider"
import { toast } from "sonner"
import Image from "next/image"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Product = {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
}

export default function ProductListing() {
  const { user } = useAuth()
  const { addToCart } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchProducts = async () => {
      try {
        const response = await fetch("https://fakestoreapi.com/products")
        if (!response.ok) throw new Error("Failed to fetch products")
        const data = await response.json()
        setProducts(data)
        setFilteredProducts(data)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching products:", error)
        setIsLoading(false)
      }
    }

    const fetchCategories = async () => {
      try {
        const response = await fetch("https://fakestoreapi.com/products/categories")
        if (!response.ok) throw new Error("Failed to fetch categories")
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }

    fetchProducts()
    fetchCategories()
  }, [user])

  useEffect(() => {
    if (products.length === 0) return

    let result = [...products]

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter((product) => product.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (product) => product.title.toLowerCase().includes(query) || product.description.toLowerCase().includes(query),
      )
    }

    setFilteredProducts(result)
  }, [selectedCategory, searchQuery, products])

  const handleAddToCart = (product: Product) => {
    addToCart(product)
    toast(`${product.title} has been added to your cart`)
  }

  if (!user) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <h1 className="text-3xl font-bold">Products</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64"
          />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="aspect-square bg-muted animate-pulse" />
              <CardContent className="p-4">
                <div className="h-4 bg-muted animate-pulse rounded mb-2" />
                <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden flex flex-col">
              <div className="p-4 flex-1">
                <div className="aspect-square relative mb-4">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.title}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="space-y-2">
                  <h2 className="font-semibold line-clamp-1">{product.title}</h2>
                  <p className="font-bold">${product.price.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                </div>
              </div>
              <CardFooter className="border-t p-4 flex gap-2">
                <Button variant="outline" className="flex-1" asChild>
                  <Link href={`/product/${product.id}`}>View Details</Link>
                </Button>
                <Button className="flex-1" onClick={() => handleAddToCart(product)}>
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
