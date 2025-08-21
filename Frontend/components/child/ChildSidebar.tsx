"use client"

import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  BookOpen,
  FileText,
  Target,
  ChevronRight,
  Menu,
  X,
} from "lucide-react"
import { useState, useEffect, useRef } from "react"

const navigation = [
  {
    name: "Dashboard",
    href: "/child/dashboard",
    icon: Home,
    current: false,
  },
  {
    name: "Subjects",
    href: "/child/subjects",
    icon: BookOpen,
    current: false,
  },
  {
    name: "Mixed Questions",
    href: "/child/mixed-questions",
    icon: FileText,
    current: false,
    badge: "New",
  },
  {
    name: "Practice Exams",
    href: "/child/practice-exams",
    icon: Target,
    current: false,
  },
]

export function ChildSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isNavOpen, setIsNavOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node) &&
          menuButtonRef.current && !menuButtonRef.current.contains(event.target as Node)) {
        setIsNavOpen(false)
      }
    }

    if (isNavOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isNavOpen])

  // Close popup on route change
  useEffect(() => {
    setIsNavOpen(false)
  }, [pathname])

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen)
  }

  return (
    <>
      {/* Desktop Sidebar (unchanged) */}
      <div className="hidden md:flex h-full flex-col bg-gradient-to-br from-[#4B5563] via-[#9CA3AF] to-[#E5E7EB] border-r border-[#D1D5DB] shadow-[0_4px_20px_rgba(0,0,0,0.05)] w-64 space-y-6">
        <div className="flex items-center p-6 shadow-inner bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#4FACFE] via-[#00F2FE] to-[#43E97B] flex items-center justify-center shadow-md">
              <BookOpen className="w-5 h-5 text-white drop-shadow-sm" />
            </div>
            <div className="flex flex-col leading-tight">
              <h1
                className="text-[28px] font-extrabold tracking-wide"
                style={{
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "1px 1px 3px rgba(0, 0, 0, 0.15)",
                }}
              >
                LOGO
              </h1>
              <p className="text-[11px] font-medium text-gray-400">Learning Made Easy</p>
            </div>
          </div>
        </div>

        <div className="flex-1 px-4 py-6">
          <nav className="space-y-2">
            <div className="px-2 mb-4">
              <h2 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Navigation
              </h2>
            </div>
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <Button
                  key={item.name}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start h-10 px-3 text-left font-medium transition-all duration-200",
                    isActive
                      ? "bg-white/10 text-white shadow-md"
                      : "text-gray-200 hover:text-white hover:bg-[#6D7A88]",
                    "flex flex-row items-center"
                  )}
                  onClick={() => router.push(item.href)}
                >
                  <item.icon className="mr-3 h-4 w-4 flex-shrink-0" />
                  <span className="flex-1 truncate">{item.name}</span>
                  {item.badge && (
                    <Badge className="ml-2 text-xs bg-[#E0E6ED] text-[#4A5B6E] border-[#B0B8C1]">
                      {item.badge}
                    </Badge>
                  )}
                  {isActive && (
                    <ChevronRight className="ml-2 h-4 w-4 flex-shrink-0" />
                  )}
                </Button>
              )
            })}
          </nav>
        </div>

        <div className="p-4 bg-[#5D6674] ">
          <div className="text-center">
            <p className="text-xs bg-gradient-to-r from-gray-400 via-gray-500 to-gray-400 bg-clip-text text-transparent">
              © 2024 EduPlatform
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Header with Menu Button */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white shadow-sm h-16 px-4 flex items-center justify-between">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#4FACFE] via-[#00F2FE] to-[#43E97B] flex items-center justify-center shadow-md">
          <BookOpen className="w-5 h-5 text-white drop-shadow-sm" />
        </div>
        
        <Button
          ref={menuButtonRef}
          variant="ghost"
          className="h-9 w-9 p-0"
          onClick={toggleNav}
        >
          {isNavOpen ? (
            <X className="h-6 w-6 text-gray-600" />
          ) : (
            <Menu className="h-6 w-6 text-gray-600" />
          )}
        </Button>
      </div>

      {/* Mobile Popup Navigation */}
      {isNavOpen && (
        <div
          ref={popupRef}
          className="md:hidden fixed z-50 top-20 right-4 bg-white rounded-lg shadow-xl border border-gray-200 w-56 py-2"
        >
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <Button
                  key={item.name}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start h-10 px-3 text-left font-medium transition-all duration-200",
                    isActive
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-700 hover:bg-gray-50",
                    "flex flex-row items-center"
                  )}
                  onClick={() => router.push(item.href)}
                >
                  <item.icon className="mr-3 h-4 w-4 flex-shrink-0" />
                  <span className="flex-1 truncate">{item.name}</span>
                  {item.badge && (
                    <Badge className="ml-2 text-xs bg-blue-100 text-blue-800">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              )
            })}
          </nav>
        </div>
      )}
    </>
  )
}