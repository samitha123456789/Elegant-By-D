// This is a mock API that would normally connect to MongoDB
// In a real application, you would use a MongoDB client

interface Category {
  _id: string
  name: string
  description: string
  slug: string
  image: string
  productCount: number
}

const mockCategories: Category[] = [
  {
    _id: "cat_001",
    name: "Clothing",
    description: "Fashion and apparel for all occasions",
    slug: "clothing",
    image: "/placeholder.svg?height=400&width=600",
    productCount: 42,
  },
  {
    _id: "cat_002",
    name: "Electronics",
    description: "Gadgets and electronic devices",
    slug: "electronics",
    image: "/placeholder.svg?height=400&width=600",
    productCount: 38,
  },
  {
    _id: "cat_003",
    name: "Accessories",
    description: "Complete your look with our accessories",
    slug: "accessories",
    image: "/placeholder.svg?height=400&width=600",
    productCount: 27,
  },
  {
    _id: "cat_004",
    name: "Footwear",
    description: "Shoes and footwear for all occasions",
    slug: "footwear",
    image: "/placeholder.svg?height=400&width=600",
    productCount: 19,
  },
]

export async function getCategories() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  return mockCategories
}

export async function getCategoryBySlug(slug: string) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200))

  const category = mockCategories.find((c) => c.slug === slug)

  if (!category) {
    throw new Error(`Category with slug ${slug} not found`)
  }

  return category
}

