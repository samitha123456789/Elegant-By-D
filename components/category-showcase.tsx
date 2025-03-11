// ecommerce-platform/components/category-showcase.tsx
import Link from "next/link";
import Image from "next/image";
import { getProducts } from "@/lib/api/products";

const categories = [
  { _id: "1", name: "Clothing", slug: "clothing", image: "/categories/clothing.jpg" },
  { _id: "2", name: "Electronics", slug: "electronics", image: "/categories/electronics.jpg" },
  { _id: "3", name: "Accessories", slug: "accessories", image: "/categories/accessories.jpg" },
  { _id: "4", name: "Footwear", slug: "footwear", image: "/categories/footwear.jpg" },
];

export default async function CategoryShowcase() {
  let categoryCounts;
  try {
    categoryCounts = await Promise.all(
      categories.map(async (category) => {
        const products = await getProducts({ category: category.name });
        if (!Array.isArray(products)) throw new Error(`Invalid data for ${category.name}`);
        return { ...category, productCount: products.length };
      })
    );
  } catch (error) {
    console.error("Failed to fetch category counts:", error);
    categoryCounts = categories.map((category) => ({ ...category, productCount: 0 }));
  }

  return (
    <section className="container py-16">
      <h2 className="mb-8 text-center text-3xl font-bold tracking-tight md:text-4xl">Shop by Category</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {categoryCounts.map((category) => (
          <Link
            key={category._id}
            href={`/products?category=${category.name}`}
            className="group relative overflow-hidden rounded-lg"
          >
            <Image
              src={category.image || "/placeholder.svg"}
              alt={category.name}
              width={500}
              height={300}
              className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4">
              <h3 className="text-xl font-bold text-white">{category.name}</h3>
              <p className="text-sm text-white/80">{category.productCount} Products</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}