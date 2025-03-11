// ecommerce-platform/lib/api/discountBanner.ts
interface DiscountBanner {
    _id?: string;
    text: string;
    backgroundColor: string;
    backgroundImage: string;
    isActive: boolean;
    updatedAt?: string;
  }
  
  export async function getDiscountBanner(): Promise<DiscountBanner> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const url = `${baseUrl}/api/discount-banner`;
  
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      throw new Error("Failed to fetch discount banner");
    }
  
    const { data } = await res.json();
    return data;
  }
  
  export async function updateDiscountBanner(
    banner: Omit<DiscountBanner, "_id" | "updatedAt">,
    imageFile: File | null
  ): Promise<DiscountBanner> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const url = `${baseUrl}/api/discount-banner`;
  
    const formData = new FormData();
    Object.entries(banner).forEach(([key, value]) => {
      formData.append(key, String(value));
    });
    if (imageFile) {
      formData.append("backgroundImage", imageFile);
    }
  
    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });
  
    if (!res.ok) {
      const { error } = await res.json();
      throw new Error(error || "Failed to update discount banner");
    }
  
    const { data } = await res.json();
    return data;
  }