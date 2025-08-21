import { SidebarProvider } from "@/components/ui/sidebar"
import DashboardLayout from "@/components/admin/header"
import type React from "react"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </SidebarProvider>
  )
}
