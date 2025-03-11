"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Hero() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
  }, [])

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background pt-16">
      <div className="container relative z-10 mx-auto flex min-h-[80vh] flex-col items-center justify-center px-4 py-16 text-center md:py-32">
        {loaded && (
          <>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
            >
              Elevate Your Style
              <span className="text-primary"> Effortlessly</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8 max-w-md text-lg text-muted-foreground md:text-xl"
            >
              Discover the latest fashion trends and shop premium quality products that define your unique style.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
            >
              <Link href="/products">
                <Button size="lg" className="px-8">
                  Shop Now
                </Button>
              </Link>
              <Link href="/categories">
                <Button size="lg" variant="outline" className="px-8">
                  Browse Categories
                </Button>
              </Link>
            </motion.div>
          </>
        )}
      </div>
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -right-10 -top-10 h-[500px] w-[500px] rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-[500px] w-[500px] rounded-full bg-primary/20 blur-3xl" />
      </div>
    </section>
  )
}

