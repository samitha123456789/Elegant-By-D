"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react"; // Replace useAuth with useSession
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-provider";

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession(); // Get session data
  const { items } = useCart();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">Elegant By D</span>
        </Link>
        <nav className="mx-6 hidden items-center space-x-6 md:flex">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors ${
              pathname === "/" ? "text-primary" : "text-foreground/60"
            } hover:text-primary`}
          >
            Home
          </Link>
          <Link
            href="/products"
            className={`text-sm font-medium transition-colors ${
              pathname === "/products" ? "text-primary" : "text-foreground/60"
            } hover:text-primary`}
          >
            Products
          </Link>
          <Link
            href="/about"
            className={`text-sm font-medium transition-colors ${
              pathname === "/categories" ? "text-primary" : "text-foreground/60"
            } hover:text-primary`}
          >
            About Us
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {items.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {items.length}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Button>
          </Link>
          {session?.user ? (
            <Link href="/profile">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button variant="default" size="sm">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}