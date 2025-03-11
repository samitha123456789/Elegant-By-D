// ecommerce-platform/components/cart.tsx
"use client";

import { useCart } from "@/components/cart-provider";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import Link from "next/link";

export default function Cart() {
  const { items, removeItem, updateQuantity, updateSize, getTotalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="container py-10 text-center">
        <h1 className="text-2xl font-bold">Your Cart is Empty</h1>
        <p className="text-muted-foreground">Add some items to get started!</p>
        <Link href="/products">
          <Button className="mt-4">Shop Now</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={`${item.id}-${item.size}`} className="flex items-center justify-between border p-4 rounded-lg">
            <div className="flex items-center space-x-4">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                {item.size && (
                  <select
                    value={item.size}
                    onChange={(e) => updateSize(item.id, e.target.value)}
                    className="border p-1 mt-1"
                  >
                    {item.size && <option value={item.size}>{item.size}</option>}
                    {/* Fetch available sizes from product if needed */}
                  </select>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  -
                </Button>
                <span className="w-12 text-center">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </Button>
              </div>
              <p className="font-bold">LKR {(item.price * item.quantity).toFixed(2)}</p>
              <Button variant="destructive" size="icon" onClick={() => removeItem(item.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-right">
        <p className="text-xl font-bold">Total: LKR {getTotalPrice().toFixed(2)}</p>
        <Link href="/checkout">
          <Button className="mt-4">Proceed to Checkout</Button>
        </Link>
      </div>
    </div>
  );
}