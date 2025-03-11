"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/components/cart-provider";
import { formatCurrency } from "@/lib/utils";
import { getProductById } from "@/lib/api/products";
import AuthModal from "@/components/auth-modal";
import { useSession } from "next-auth/react";

export default function CartPage() {
  const router = useRouter();
  const { data: session, status } = useSession(); // Include status for loading state
  const { items, updateQuantity, updateSize, removeItem, getTotalPrice } = useCart();
  const [mounted, setMounted] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchProducts = async () => {
      const fetchedProducts = await Promise.all(
        items.map((item) => getProductById(item.id))
      );
      setProducts(fetchedProducts);
    };
    if (items.length > 0) fetchProducts();
  }, [items]);

  if (!mounted) {
    return <div className="container py-10 animate-pulse"></div>;
  }

  if (items.length === 0) {
    return (
      <div className="container flex flex-col items-center justify-center py-20 text-center">
        <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="mb-2 text-2xl font-bold">Your cart is empty</h1>
        <p className="mb-6 text-muted-foreground">You haven't added any products to your cart yet.</p>
        <Link href="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  const handleSizeChange = (itemId: string, newSize: string) => {
    updateSize(itemId, newSize);
  };

  const handleCheckout = () => {
    console.log("handleCheckout triggered");
    console.log("Session:", session);
    console.log("Session Status:", status);
    if (status === "loading") {
      console.log("Session still loading, opening auth modal as fallback");
      setIsAuthModalOpen(true); // Open modal during loading to avoid delay
    } else if (session?.user) {
      console.log("User is logged in, navigating to /checkout");
      router.push("/checkout");
    } else {
      console.log("User not logged in, opening auth modal");
      setIsAuthModalOpen(true);
    }
  };

  return (
    <div className="container py-10">
      <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>
      <div className="grid gap-8 md:grid-cols-[1fr_300px]">
        <div>
          <div className="rounded-lg border">
            <div className="p-4 md:p-6">
              <div className="flow-root">
                <ul className="-my-6 divide-y">
                  {items.map((item) => {
                    const product = products.find((p) => p._id === item.id);
                    const availableSizes = product?.sizes?.filter((s: any) => s.stock > 0) || [];
                    return (
                      <li key={`${item.id}-${item.size}`} className="flex py-6">
                        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        </div>
                        <div className="ml-4 flex flex-1 flex-col">
                          <div>
                            <div className="flex justify-between">
                              <Link href={`/products/${item.id}`} className="font-medium hover:text-primary">
                                {item.name}
                              </Link>
                              <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">LKR {item.price.toFixed(2)} per item</p>
                            {item.size && (
                              <div className="mt-2">
                                <label className="text-sm">Size:</label>
                                <select
                                  value={item.size}
                                  onChange={(e) => handleSizeChange(item.id, e.target.value)}
                                  className="ml-2 border p-1 rounded"
                                >
                                  {availableSizes.map((s: any) => (
                                    <option key={s.size} value={s.size}>
                                      {s.size} ({s.stock} in stock)
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-1 items-end justify-between">
                            <div className="flex items-center">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                                <span className="sr-only">Decrease quantity</span>
                              </Button>
                              <span className="mx-2 w-8 text-center">{item.quantity}</span>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                                <span className="sr-only">Increase quantity</span>
                              </Button>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-destructive"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Remove item</span>
                            </Button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="rounded-lg border bg-background p-6">
            <h2 className="mb-4 text-lg font-medium">Order Summary</h2>
            <div className="flow-root">
              <div className="py-4">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">Subtotal</p>
                  <p className="font-medium">{formatCurrency(getTotalPrice())}</p>
                </div>
                <div className="flex items-center justify-between py-2">
                  <p className="text-muted-foreground">Shipping</p>
                  <p className="font-medium">Free</p>
                </div>
              </div>
              <Separator />
              <div className="py-4">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-medium">Total</p>
                  <p className="text-lg font-bold">{formatCurrency(getTotalPrice())}</p>
                </div>
              </div>
            </div>
            <Button className="w-full" onClick={handleCheckout}>
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
      {isAuthModalOpen && (
        <AuthModal triggerText="" isOpen={isAuthModalOpen} setIsOpen={setIsAuthModalOpen}>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Please Login or Register</h2>
            <div className="space-y-4">
              <Button asChild className="w-full">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/register">Register</Link>
              </Button>
            </div>
          </div>
        </AuthModal>
      )}
    </div>
  );
}