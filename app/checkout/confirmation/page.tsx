"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CheckCircle, Box } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ConfirmationPage() {
  const searchParams = useSearchParams()
  const trackingNumber = searchParams.get("tracking") || "N/A"
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="container py-10 animate-pulse"></div>
  }

  return (
    <div className="container py-16 text-center">
      <div className="mx-auto max-w-md">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-4 text-3xl font-bold">Order Confirmed!</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Thank you for your purchase. Your order has been confirmed.
        </p>

        <div className="mt-6 rounded-lg border bg-card p-6 text-left">
          <h2 className="mb-4 text-lg font-medium">Order Details</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tracking Number</span>
              <span className="font-medium">{trackingNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Method</span>
              <span className="font-medium">Cash on Delivery</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estimated Delivery</span>
              <span className="font-medium">3-5 Business Days</span>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <Link href="/account/orders">
            <Button className="w-full">
              <Box className="mr-2 h-4 w-4" /> Track Your Order
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="outline" className="w-full">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

