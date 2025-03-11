import type { ReactNode } from "react"
import AdminSidebar from "@/components/admin/admin-sidebar"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr]">
      <AdminSidebar />
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  )
}

