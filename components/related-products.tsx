// ecommerce-platform/components/related-products.tsx
import ProductCard from "@/components/product-card";
import { getProducts } from "@/lib/api/products";

export default async function RelatedProducts({
  categoryId,
  currentProductId,
}: {
  categoryId: string; // Expect "Clothing", "Electronics", etc.
  currentProductId: string;
}) {
  const products = await getProducts({
    category: categoryId,
    limit: 4,
  });

  const relatedProducts = products.filter((p) => p._id !== currentProductId);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">Related Products</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {relatedProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}