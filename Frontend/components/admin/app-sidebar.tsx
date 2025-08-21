"use client"

import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3,
  Users,
  BookOpen,
  DollarSign,
  MessageSquare,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
} from "lucide-react"
import { useState, useEffect, useRef } from "react"

const navigation = [
  {
    name: "Dashboard",
    href: "/admindashboard",
    icon: BarChart3,
  },
  {
    name: "User Management",
    href: "/admindashboard/users",
    icon: Users,
  },
  {
    name: "Content Manager",
    href: "/admindashboard/content",
    icon: BookOpen,
  },
  {
    name: "Payments",
    href: "/admindashboard/payments",
    icon: DollarSign,
  },
  {
    name: "Feedback & Support",
    href: "/admindashboard/feedback",
    icon: MessageSquare,
    badge: "New",
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [clickedItem, setClickedItem] = useState<string | null>(null) // Track clicked item
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
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

  useEffect(() => {
    setIsNavOpen(false)
  }, [pathname])

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen)
  }

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  const handleNavClick = (href: string) => {
    setClickedItem(href) // Set the clicked item
    router.push(href)
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden md:flex h-full flex-col bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 border-r border-gray-200/50 dark:border-gray-800/50 transition-all duration-300",
          isSidebarCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex h-16 items-center border-b border-gray-200/50 dark:border-gray-800/50 px-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
          <div
            className={cn(
              "flex items-center w-full",
              isSidebarCollapsed ? "justify-center" : "gap-3 px-2"
            )}
          >
            <div
              className={cn(
                "rounded-xl bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 dark:from-gray-600 dark:via-gray-700 dark:to-gray-800 flex items-center justify-center shadow-lg transition-all duration-300",
                isSidebarCollapsed
                  ? "h-12 w-12 ring-2 ring-gray-400/50 dark:ring-gray-500/50"
                  : "h-10 w-10 ring-1 ring-gray-900/10 dark:ring-gray-100/10"
              )}
            >
              <span className="text-white font-bold text-lg">EA</span>
            </div>
            {!isSidebarCollapsed && (
              <div className="flex flex-col leading-tight">
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 dark:from-gray-100 dark:via-gray-200 dark:to-gray-300 bg-clip-text text-transparent">
                  EduAdmin Pro
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Admin Dashboard
                </p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            className={cn(
              "h-8 w-8 p-0 transition-all duration-300",
              isSidebarCollapsed ? "absolute top-4 right-2" : "ml-auto"
            )}
            onClick={toggleSidebar}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            )}
          </Button>
        </div>

        <div className="flex-1 px-4 py-6">
          <nav className="space-y-2">
            {!isSidebarCollapsed && (
              <div className="px-2 mb-4">
                <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Navigation
                </h2>
              </div>
            )}
            {navigation.map((item) => {
              const isActive = clickedItem === item.href; // Active only if clicked

              return (
                <Button
                  key={item.name}
                  variant="ghost"
                  className={cn(
                    "w-full h-12 px-4 font-medium transition-all duration-300 rounded-xl group relative",
                    isSidebarCollapsed ? "justify-center" : "justify-start gap-4",
                    isActive
                      ? "bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 text-gray-900 dark:text-gray-100"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                  )}
                  onClick={() => handleNavClick(item.href)}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 transition-all duration-300",
                      isActive
                        ? "text-gray-900 dark:text-gray-100"
                        : "text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100",
                      isSidebarCollapsed ? "mx-auto" : ""
                    )}
                  />
                  {!isSidebarCollapsed && (
                    <>
                      <span className="flex-1 truncate text-left">{item.name}</span>
                      <div className="flex items-center">
                        {item.badge && (
                          <Badge className="ml-2 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                            {item.badge}
                          </Badge>
                        )}
                        {isActive && (
                          <ChevronRight className="ml-2 h-4 w-4 flex-shrink-0 text-gray-900 dark:text-gray-100" />
                        )}
                      </div>
                    </>
                  )}
                </Button>
              )
            })}
          </nav>
        </div>

        <div
          className={cn(
            "p-4 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm border-t border-gray-200/50 dark:border-gray-800/50",
            isSidebarCollapsed ? "text-center" : ""
          )}
        >
          <div className="text-center">
            <p
              className={cn(
                "text-xs text-gray-500 dark:text-gray-400",
                isSidebarCollapsed ? "text-[10px]" : ""
              )}
            >
              {isSidebarCollapsed ? "© 2024" : "© 2024 EduAdmin Pro"}
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-sm h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "h-10 w-10 rounded-xl flex items-center justify-center",
              isNavOpen
                ? "bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 dark:from-gray-600 dark:via-gray-700 dark:to-gray-800 shadow-lg ring-1 ring-gray-900/10 dark:ring-gray-100/10"
                : "bg-transparent"
            )}
          >
            <span
              className={cn(
                "font-bold text-lg",
                isNavOpen ? "text-white" : "text-gray-600 dark:text-gray-400"
              )}
            >
              EA
            </span>
          </div>
          {isNavOpen && (
            <h1 className="text-lg font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 dark:from-gray-100 dark:via-gray-200 dark:to-gray-300 bg-clip-text text-transparent">
              EduAdmin Pro
            </h1>
          )}
        </div>

        <Button
          ref={menuButtonRef}
          variant="ghost"
          className="h-9 w-9 p-0"
          onClick={toggleNav}
        >
          {isNavOpen ? (
            <X className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          ) : (
            <Menu className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          )}
        </Button>
      </div>

      {/* Mobile Popup Navigation */}
      {isNavOpen && (
        <div
          ref={popupRef}
          className="md:hidden fixed z-50 top-20 right-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-800/50 w-56 py-2"
        >
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = clickedItem === item.href; // Active only if clicked

              return (
                <Button
                  key={item.name}
                  variant="ghost"
                  className={cn(
                    "w-full justify-between h-12 px-4 font-medium transition-all duration-300 rounded-lg mx-2",
                    isActive
                      ? "bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 text-gray-900 dark:text-gray-100"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                  onClick={() => handleNavClick(item.href)}
                >
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={cn(
                        "h-5 w-5 flex-shrink-0",
                        isActive
                          ? "text-gray-900 dark:text-gray-100"
                          : "text-gray-500 dark:text-gray-400"
                      )}
                    />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <Badge className="ml-2 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
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