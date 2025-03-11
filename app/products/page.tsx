import { Suspense } from "react"
import ProductList from "@/components/product-list"
import ProductsLoading from "@/components/products-loading"
import ProductsFilter from "@/components/products-filter"

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; sale?: string; search?: string }
}) {
  return (
    <div className="container py-12">
      <h1 className="mb-8 text-3xl font-bold">All Products</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[240px_1fr]">
        <ProductsFilter />

        <div>
          <Suspense fallback={<ProductsLoading />}>
            <ProductList
              category={searchParams.category}
              sale={searchParams.sale === "true"}
              search={searchParams.search}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

