// app/admin/page.tsx
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AdminDashboard from "@/components/admin/admin-dashboard";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/login?callbackUrl=/admin");
  }

  return <AdminDashboard />;
}