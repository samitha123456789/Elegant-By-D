// ecommerce-platform/app/checkout/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart-provider";
import { Button } from "@/components/ui/button";
import CheckoutForm from "@/components/checkout-form";
import OrderSummary from "@/components/order-summary";
import { generateTrackingNumber, getBaseUrl } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

async function updateProductStock(cartItems: any[]) {
  try {
    const response = await fetch(`${getBaseUrl()}/api/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cartItems }),
    });
    if (!response.ok) {
      const { error } = await response.json();
      throw new Error(error || "Failed to update stock");
    }
    console.log("Stock updated successfully");
  } catch (error) {
    console.error("Error updating product stock:", error);
    throw error;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, clearCart, getTotalPrice } = useCart();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    if (!session) {
      router.push("/login");
    }
  }, [session, router]);

  useEffect(() => {
    if (mounted && items.length === 0) {
      router.push("/cart");
    }
  }, [mounted, items, router]);

  const handlePlaceOrder = async (formData: any) => {
    try {
      const trackingNumber = generateTrackingNumber();

      await updateProductStock(items);

      const orderResponse = await fetch(`${getBaseUrl()}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session?.user.id,
          items,
          total: getTotalPrice(),
          trackingNumber,
          status: "Pending",
          shippingDetails: formData,
        }),
      });

      if (!orderResponse.ok) throw new Error("Failed to save order");

      await fetch(`${getBaseUrl()}/api/notifications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "new_order", trackingNumber }),
      });

      clearCart();
      toast({
        title: "Order placed successfully!",
        description: `Your tracking number is ${trackingNumber}`,
      });
      router.push(`/checkout/confirmation?tracking=${trackingNumber}`);
    } catch (error) {
      setError("Failed to place order. Please try again.");
      toast({
        title: "Error",
        description: "Failed to process your order. Please try again.",
        variant: "destructive",
      });
      console.error("Checkout error:", error);
    }
  };

  if (!mounted || !session) {
    return <div className="container py-10 animate-pulse"></div>;
  }

  return (
    <div className="container py-10">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid gap-8 md:grid-cols-[1fr_350px]">
        <div>
          <CheckoutForm onSubmit={handlePlaceOrder} />
        </div>
        <div className="space-y-6">
          <OrderSummary />
          <div className="rounded-lg border bg-card p-4">
            <h3 className="mb-2 font-medium">Payment Method</h3>
            <p className="text-sm text-muted-foreground">Only Cash on Delivery (COD) is available at this time.</p>
          </div>
          <Button form="checkout-form" type="submit" className="w-full" size="lg">
            Place Order
          </Button>
        </div>
      </div>
    </div>
  );
}