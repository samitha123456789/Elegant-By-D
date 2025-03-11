// app/login/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/checkout";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });
    if (res?.error) {
      setError("Invalid email or password");
    } else {
      router.push(callbackUrl); // Redirects to /admin or /checkout based on origin
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat p-4"
      style={{
        backgroundImage: `url('https://images.pexels.com/photos/2918462/pexels-photo-2918462.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')`,
      }}
    >
      <Card className="w-full max-w-md shadow-xl animate-fade-in bg-white/90 backdrop-blur-sm">
        <CardHeader className="bg-primary bg-violet-900 text-primary-foreground rounded-t-lg">
          <CardTitle className="text-3xl font-bold text-center">Welcome Back</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full border-gray-300 focus:ring-primary focus:border-primary transition-all"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full border-gray-300 focus:ring-primary focus:border-primary transition-all"
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm text-center animate-pulse">{error}</p>
            )}
            <Button
              type="submit"
              className="w-full bg-primary bg-violet-900 hover:bg-primary/90 text-white font-semibold py-2 rounded-lg transition-all"
            >
              Login
            </Button>
          </form>
          <p className="mt-4 text-sm text-center text-gray-600">
            Don’t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline font-medium">
              Register here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}