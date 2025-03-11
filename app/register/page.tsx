"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import bcrypt from "bcryptjs";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hashedPassword = bcrypt.hashSync(password, 10);
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password: hashedPassword, role: "customer" }),
    });
    if (!res.ok) {
      const { error } = await res.json();
      setError(error || "Registration failed");
    } else {
      router.push("/login");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat p-4"
      style={{
        backgroundImage: `url('https://images.pexels.com/photos/206863/pexels-photo-206863.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')`,
      }}
    >
      <Card className="w-full max-w-md shadow-xl animate-fade-in bg-white/90 backdrop-blur-sm">
        <CardHeader className="bg-primary bg-violet-900 text-primary-foreground rounded-t-lg">
          <CardTitle className="text-3xl font-bold text-center">Join Us</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 w-full border-gray-300 focus:ring-primary focus:border-primary transition-all"
              />
            </div>
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
                placeholder="Create a password"
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
              Register
            </Button>
          </form>
          <p className="mt-4 text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Login here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}