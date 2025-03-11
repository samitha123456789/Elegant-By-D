import { Suspense } from "react"
import Hero from "@/components/hero"
import FeaturedProducts from "@/components/featured-products"
import CategoryShowcase from "@/components/category-showcase"
import DiscountBanner from "@/components/discount-banner"
import ProductsLoading from "@/components/products-loading"

export default function Home() {
  return (
    <div className="overflow-hidden">
      <Hero />
      <DiscountBanner />
      <section className="container py-16">
        <h2 className="mb-8 text-center text-3xl font-bold tracking-tight md:text-4xl">Featured Products</h2>
        <Suspense fallback={<ProductsLoading />}>
          <FeaturedProducts />
        </Suspense>
      </section>
      <CategoryShowcase />
    </div>
  )
}

