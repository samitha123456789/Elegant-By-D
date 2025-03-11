import ProductCard from "@/components/product-card"
import { getProducts } from "@/lib/api/products"

export default async function ProductList({
  category,
  sale,
  search,
}: {
  category?: string
  sale?: boolean
  search?: string
}) {
  const products = await getProducts({
    category,
    sale,
    search,
  })

  if (products.length === 0) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-lg border bg-card p-8 text-center">
        <div>
          <h3 className="mb-2 text-lg font-semibold">No products found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search term.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  )
}

