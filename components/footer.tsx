import Link from "next/link"
import { Facebook, Instagram, Music2,  } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-medium">Elegant By D</h3>
            <p className="text-sm text-muted-foreground">
              Shop with style and comfort at Elegant By D. We bring you the latest trends with exceptional quality.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-medium">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="text-muted-foreground transition-colors hover:text-foreground">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-muted-foreground transition-colors hover:text-foreground">
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/products?sale=true"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Sale Items
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-medium">Account</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/account" className="text-muted-foreground transition-colors hover:text-foreground">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="text-muted-foreground transition-colors hover:text-foreground">
                  Order History
                </Link>
              </li>
              <li>
                <Link
                  href="/account/tracking"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Track Order
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-medium">Connect</h3>
            <div className="flex space-x-4">
              <Link
                href="https://www.facebook.com/share/12JGruQhy6J/?mibextid=wwXIfr"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <Facebook className="h-6 w-6" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <Instagram className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="https://www.tiktok.com/@elegant.by.d4?_t=ZS-8uRsWleVtdS&_r=1"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                <Music2 className="h-6 w-6" />
                <span className="sr-only">Tiktok</span>
              </Link>
            </div>
            <div className="mt-4">
              <h4 className="mb-2 text-sm font-medium">Subscribe to our newsletter</h4>
              <div className="flex w-full max-w-sm items-center space-x-2">
                <input
                  type="email"
                  placeholder="Email"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
                <button className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Elegant By D. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

