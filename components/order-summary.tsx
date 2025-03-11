"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/components/cart-provider"
import { formatCurrency } from "@/lib/utils"

export default function OrderSummary() {
  const { items, getTotalPrice } = useCart()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="animate-pulse h-40 bg-muted rounded-lg"></div>
  }

  return (
    <div className="rounded-lg border bg-card">
      <div className="p-6">
        <h2 className="mb-4 text-lg font-medium">Order Summary</h2>

        <div className="max-h-80 overflow-auto space-y-4 pr-2">
          {items.map((item) => (
            <div key={item.id} className="flex">
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="ml-4 flex flex-1 flex-col">
                <div className="flex justify-between">
                  <h3 className="text-sm font-medium">{item.name}</h3>
                  <p className="text-sm font-medium">{formatCurrency(item.price * item.quantity)}</p>
                </div>
                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        <div className="space-y-2">
          <div className="flex justify-between">
            <p className="text-sm text-muted-foreground">Subtotal</p>
            <p className="text-sm font-medium">{formatCurrency(getTotalPrice())}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-sm text-muted-foreground">Shipping</p>
            <p className="text-sm font-medium">Free</p>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between">
            <p className="font-medium">Total</p>
            <p className="font-bold">{formatCurrency(getTotalPrice())}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

