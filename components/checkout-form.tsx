"use client";

import type React from "react";
import { useState } from "react";
import { useSession } from "next-auth/react"; // Replace useAuth with useSession
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CheckoutFormProps {
  onSubmit: (data: any) => void;
}

export default function CheckoutForm({ onSubmit }: CheckoutFormProps) {
  const { data: session } = useSession(); // Use NextAuth's useSession

  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form id="checkout-form" onSubmit={handleSubmit}>
      <div className="rounded-lg border bg-card">
        <div className="p-6">
          <h2 className="mb-4 text-lg font-medium">Shipping Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" value={formData.address} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" value={formData.city} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" name="state" value={formData.state} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} required />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg border bg-card">
        <div className="p-6">
          <h2 className="mb-4 text-lg font-medium">Additional Information</h2>
          <div className="space-y-2">
            <Label htmlFor="notes">Order Notes (Optional)</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Special instructions for delivery"
              value={formData.notes}
              onChange={handleChange}
              className="min-h-[100px]"
            />
          </div>
        </div>
      </div>
    </form>
  );
}