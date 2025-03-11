// ecommerce-platform/app/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import ProfileForm from "@/components/profile-form";
import OrderHistory from "@/components/order-history";
import { Button } from "@/components/ui/button";
import { getBaseUrl } from "@/lib/utils";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session) {
      fetchOrders();
    }
  }, [session, status, router]);

  const fetchOrders = async () => {
    const res = await fetch(`${getBaseUrl()}/api/orders?userId=${session?.user.id}`);
    const { data } = await res.json();
    setOrders(data || []);
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  if (status === "loading") {
    return <div className="container py-10 animate-pulse">Loading...</div>;
  }

  if (!session) return null;

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
      <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
        <ProfileForm />
        <OrderHistory orders={orders} />
      </div>
    </div>
  );
}