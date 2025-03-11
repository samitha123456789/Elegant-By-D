// ecommerce-platform/components/discount-banner.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TagIcon } from "lucide-react";
import Link from "next/link";
import { getDiscountBanner } from "@/lib/api/discountBanner";

export default function DiscountBanner() {
  const [loaded, setLoaded] = useState(false);
  const [banner, setBanner] = useState({
    text: "",
    backgroundColor: "#000000",
    backgroundImage: "",
    isActive: false,
  });

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const data = await getDiscountBanner();
        setBanner(data);
        setLoaded(true);
      } catch (error) {
        console.error("Failed to fetch discount banner:", error);
        setLoaded(true); // Still load with defaults if error
      }
    };
    fetchBanner();
  }, []);

  if (!loaded || !banner.isActive) {
    return null; // Don’t render if not loaded or inactive
  }

  return (
    <section
      className="py-6 text-white"
      style={{
        backgroundColor: banner.backgroundColor,
        backgroundImage: banner.backgroundImage ? `url(${banner.backgroundImage})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0"
        >
          <div className="flex items-center">
            <TagIcon className="mr-2 h-6 w-6" />
            <h3 className="text-lg font-semibold">{banner.text}</h3>
          </div>
          <div>
            <Link
              href="/products?sale=true"
              className="rounded-md border border-white px-4 py-2 text-sm font-medium transition-colors hover:bg-white hover:text-black"
            >
              Shop the Sale
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}