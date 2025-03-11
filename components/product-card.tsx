"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  product: {
    _id: string
    name: string
    price: number
    originalPrice?: number
    image: string
    discount?: number
  }
  className?: string
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleAddToCart = () => {
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    })
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  return (
    <div className={cn("product-card group rounded-lg border bg-card", className)}>
      <Link href={`/products/${product._id}`} className="relative block overflow-hidden">
        <div className="relative aspect-square">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={cn(
              "object-cover transition-all duration-300 group-hover:scale-105",
              isImageLoaded ? "opacity-100" : "opacity-0",
            )}
            onLoad={() => setIsImageLoaded(true)}
          />
          {!isImageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          )}
        </div>
        {product.discount && (
          <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
            Save {product.discount}%
          </span>
        )}
      </Link>
      <div className="p-4">
        <Link href={`/products/${product._id}`}>
          <h3 className="mb-1 line-clamp-1 text-lg font-semibold transition-colors group-hover:text-primary">
            {product.name}
          </h3>
        </Link>
        <div className="mb-4 flex items-center">
          <span className="text-lg font-bold">LKR {product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="ml-2 text-sm text-muted-foreground line-through">LKR {product.originalPrice.toFixed(2)}</span>
          )}
        </div>
        <Button onClick={handleAddToCart} className="w-full transition-all group-hover:bg-primary">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </div>
    </div>
  )
}

