// ecommerce-platform/components/products-filter.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function ProductsFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [showSale, setShowSale] = useState(searchParams.get("sale") === "true");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get("category"));

  const categories = [
    { id: "Clothing", name: "Clothing" },
    { id: "Electronics", name: "Electronics" },
    { id: "Accessories", name: "Accessories" },
    { id: "Footwear", name: "Footwear" },
  ];

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (search) {
      params.set("search", search);
    }

    if (showSale) {
      params.set("sale", "true");
    }

    if (selectedCategory) {
      params.set("category", selectedCategory); // Use capitalized names
    }

    const queryString = params.toString();
    router.push(`/products${queryString ? `?${queryString}` : ""}`);
  };

  const resetFilters = () => {
    setSearch("");
    setShowSale(false);
    setSelectedCategory(null);
    router.push("/products");
  };

  return (
    <div className="sticky top-20 space-y-4">
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            applyFilters();
          }}
        >
          <div className="relative">
            <Input
              placeholder="Search products..."
              className="pr-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button type="submit" variant="ghost" className="absolute right-0 top-0 h-full px-3">
              <span className="sr-only">Search</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </Button>
          </div>
        </form>
      </div>

      <Accordion type="single" collapsible defaultValue="category">
        <AccordionItem value="category">
          <AccordionTrigger>Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategory === category.id}
                    onCheckedChange={() => {
                      setSelectedCategory(selectedCategory === category.id ? null : category.id);
                    }}
                  />
                  <label
                    htmlFor={`category-${category.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="filters">
          <AccordionTrigger>Filters</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="filter-sale" checked={showSale} onCheckedChange={(checked) => setShowSale(!!checked)} />
                <label
                  htmlFor="filter-sale"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  On Sale
                </label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex flex-col space-y-2">
        <Button onClick={applyFilters}>Apply Filters</Button>
        <Button variant="outline" onClick={resetFilters}>
          Reset Filters
        </Button>
      </div>
    </div>
  );
}