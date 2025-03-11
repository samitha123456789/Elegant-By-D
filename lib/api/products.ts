// ecommerce-platform/lib/api/products.ts
import { getBaseUrl } from "@/lib/utils";

interface Size {
  size: string;
  stock: number;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  discount?: number;
  featured?: boolean;
  stock: number;
  sizes?: Size[];
  createdAt: string;
}

interface GetProductsOptions {
  category?: string;
  featured?: boolean;
  sale?: boolean;
  limit?: number;
  search?: string;
}

export async function getProducts(options: GetProductsOptions = {}) {
  const queryParams = new URLSearchParams();
  if (options.category) queryParams.append("category", options.category);
  if (options.featured) queryParams.append("featured", String(options.featured));
  if (options.sale) queryParams.append("sale", String(options.sale));
  if (options.limit) queryParams.append("limit", String(options.limit));
  if (options.search) queryParams.append("search", options.search);

  const url = `${getBaseUrl()}/api/products?${queryParams.toString()}`;
  console.log("Fetching products from:", url); // Debug log

  try {
    const res = await fetch(url, {
      cache: "force-cache", // Optimize for static generation
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      console.error(`Fetch failed: ${res.status} ${res.statusText}`);
      const text = await res.text(); // Log raw response for debugging
      console.error("Response body:", text.slice(0, 100)); // Limit for readability
      throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    if (!data.success || !Array.isArray(data.data)) {
      console.error("Invalid API response:", data);
      return []; // Fallback to empty array
    }

    return data.data as Product[];
  } catch (error) {
    console.error(`Error fetching products from ${url}:`, error);
    return []; // Fallback to empty array during build
  }
}

export async function getProductById(id: string) {
  const url = `${getBaseUrl()}/api/products/${id}`;
  try {
    const res = await fetch(url, { cache: "force-cache" });
    if (!res.ok) {
      throw new Error(`Product with ID ${id} not found: ${res.status} ${res.statusText}`);
    }
    const { data } = await res.json();
    return data as Product;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error; // Let caller handle this
  }
}

export async function createProduct(
  product: Omit<Product, "_id" | "createdAt" | "image"> & { imageUrl?: string },
  imageFile: File | null
) {
  const url = `${getBaseUrl()}/api/products`;
  const formData = new FormData();
  Object.entries(product).forEach(([key, value]) => {
    if (value !== undefined) {
      if (key === "sizes" && Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    }
  });
  if (imageFile) {
    formData.append("image", imageFile);
  }

  const res = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error || `Failed to create product: ${res.status} ${res.statusText}`);
  }

  const { data } = await res.json();
  return data as Product;
}

export async function updateProduct(
  id: string,
  product: Omit<Product, "_id" | "createdAt" | "image"> & { imageUrl?: string },
  imageFile: File | null
) {
  const url = `${getBaseUrl()}/api/products/${id}`;
  const formData = new FormData();
  Object.entries(product).forEach(([key, value]) => {
    if (value !== undefined) {
      if (key === "sizes" && Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    }
  });
  if (imageFile) {
    formData.append("image", imageFile);
  }

  const res = await fetch(url, {
    method: "PUT",
    body: formData,
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error || `Failed to update product: ${res.status} ${res.statusText}`);
  }

  const { data } = await res.json();
  return data as Product;
}

export async function deleteProduct(id: string) {
  const url = `${getBaseUrl()}/api/products/${id}`;
  const res = await fetch(url, {
    method: "DELETE",
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error || `Failed to delete product: ${res.status} ${res.statusText}`);
  }

  return true;
}