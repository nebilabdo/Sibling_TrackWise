"use client"

import type React from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ChildSidebar } from "@/components/child/ChildSidebar"
import { ChildHeader } from "@/components/child/ChildHeader"

export default function ChildLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Give auth context time to initialize
    const timer = setTimeout(() => {
      if (!isAuthenticated || !user) {
        router.push("/auth/login")
      } else {
        setIsLoading(false)
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [isAuthenticated, user, router])



  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <ChildSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChildHeader />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
