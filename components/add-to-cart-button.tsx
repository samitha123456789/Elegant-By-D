// ecommerce-platform/components/add-to-cart-button.tsx
"use client";

import { useState } from "react";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-provider";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface AddToCartButtonProps {
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
    stock: number;
    category: string;
    sizes?: { size: string; stock: number }[];
  };
  className?: string;
}

export default function AddToCartButton({ product, className }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { addItem } = useCart();
  const { toast } = useToast();

  const availableSizes = product.sizes?.filter((s) => s.stock > 0) || [];
  const maxStock = selectedSize
    ? product.sizes?.find((s) => s.size === selectedSize)?.stock || 0
    : product.stock;

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= maxStock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (availableSizes.length > 0 && !selectedSize) {
      toast({
        title: "Select a size",
        description: "Please select a size before adding to cart.",
        variant: "destructive",
      });
      return;
    }

    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      size: selectedSize || undefined,
    });

    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name}${selectedSize ? ` (Size: ${selectedSize})` : ""} has been added to your cart.`,
    });
  };

  return (
    <div className={cn("space-y-4", className)}>
      {availableSizes.length > 0 && (
        <div>
          <label className="block mb-2">Size:</label>
          <select
            value={selectedSize || ""}
            onChange={(e) => setSelectedSize(e.target.value || null)}
            className="border p-2 w-full"
          >
            <option value="">Select a size</option>
            {availableSizes.map((s) => (
              <option key={s.size} value={s.size}>
                {s.size} ({s.stock} in stock)
              </option>
            ))}
          </select>
          {selectedSize && (
            <p className="text-sm text-muted-foreground mt-1">
              {maxStock} in stock for size {selectedSize}
            </p>
          )}
        </div>
      )}
      <div className="flex items-center">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => handleQuantityChange(-1)}
          disabled={quantity <= 1}
        >
          <Minus className="h-4 w-4" />
          <span className="sr-only">Decrease quantity</span>
        </Button>
        <span className="w-12 text-center">{quantity}</span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => handleQuantityChange(1)}
          disabled={quantity >= maxStock}
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Increase quantity</span>
        </Button>
      </div>
      <Button
        type="button"
        size="lg"
        className="w-full"
        onClick={handleAddToCart}
        disabled={maxStock === 0}
      >
        <ShoppingCart className="mr-2 h-5 w-5" />
        Add to Cart
      </Button>
    </div>
  );
}