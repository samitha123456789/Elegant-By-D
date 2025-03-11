// ecommerce-platform/components/featured-products.tsx
import ProductCard from "@/components/product-card";
import { getProducts } from "@/lib/api/products";

export default async function FeaturedProducts() {
  let products;
  try {
    products = await getProducts({ featured: true });
    if (!Array.isArray(products)) throw new Error("Invalid products data");
  } catch (error) {
    console.error("Failed to fetch featured products:", error);
    products = []; // Fallback to empty array
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {products.length > 0 ? (
        products.map((product) => <ProductCard key={product._id} product={product} />)
      ) : (
        <p>No featured products available.</p>
      )}
    </div>
  );
}