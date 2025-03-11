// ecommerce-platform/app/products/[id]/page.tsx
import Image from "next/image";
import { getProductById } from "@/lib/api/products";
import AddToCartButton from "@/components/add-to-cart-button";
import { Suspense } from "react";

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="container py-10">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              width={500}
              height={500}
              className="w-full object-cover rounded-lg"
            />
          </div>
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-lg text-muted-foreground">{product.description}</p>
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold">LKR {product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  LKR {product.originalPrice.toFixed(2)}
                </span>
              )}
              {product.discount && (
                <span className="text-sm text-primary">Save {product.discount}%</span>
              )}
            </div>
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </Suspense>
  );
}