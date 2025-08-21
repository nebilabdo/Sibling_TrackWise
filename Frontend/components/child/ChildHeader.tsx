"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useTimer } from "@/contexts/TimerContext"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, User, Settings, LogOut, Clock, ChevronDown } from 'lucide-react'

export function ChildHeader() {
  const { user, logout } = useAuth()
  const { dailyTime, formatTime, isRunning } = useTimer()
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearchResults, setShowSearchResults] = useState(false)
  const router = useRouter()

  const handleLogout = () => logout()

  const searchData = [
    { type: "subject", title: "Mathematics", path: "/child/subjects/math" },
    { type: "subject", title: "Science", path: "/child/subjects/science" }, // Fixed: Removed duplicate 'title'
    { type: "subject", title: "English", path: "/child/subjects/english" },
    { type: "subject", title: "History", path: "/child/subjects/history" },
    { type: "chapter", title: "Algebra Basics", path: "/child/subjects/math/chapters/chapter-1" },
    { type: "chapter", title: "Geometry", path: "/child/subjects/math/chapters/chapter-2" },
    { type: "chapter", title: "Physics Laws", path: "/child/subjects/science/chapters/chapter-1" },
    { type: "chapter", title: "Chemistry Elements", path: "/child/subjects/science/chapters/chapter-2" },
    { type: "topic", title: "Quadratic Equations", path: "/child/subjects/math/chapters/chapter-1" },
    { type: "topic", title: "Newton's Laws", path: "/child/subjects/science/chapters/chapter-1" },
    { type: "exam", title: "Math Practice Test", path: "/child/practice-exams" },
    { type: "exam", title: "Science Quiz", path: "/child/practice-exams" },
  ]

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setShowSearchResults(query.length > 0)
  }

  const filteredResults = searchData.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSearchResultClick = (path: string) => {
    setSearchQuery("")
    setShowSearchResults(false)
    router.push(path)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "subject":
        return "📚"
      case "chapter":
        return "📖"
      case "topic":
        return "📝"
      case "exam":
        return "🎯"
      default:
        return "📄"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "subject":
        return "bg-indigo-100 text-indigo-800"
      case "chapter":
        return "bg-emerald-100 text-emerald-800"
      case "topic":
        return "bg-purple-100 text-purple-800"
      case "exam":
        return "bg-amber-100 text-amber-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  return (
    <header className="bg-[#9BA8AB] px-4 py-3 sm:px-6 sm:py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Search */}
        <div className="flex-1 w-full md:max-w-md relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-4 h-4" />
            <Input
              placeholder="Search lessons, subjects, or topics..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 bg-white/10 border-none text-white placeholder:text-gray-300 rounded-xl shadow-md focus:ring-2 focus:ring-white"
              onFocus={() => searchQuery.length > 0 && setShowSearchResults(true)}
            />
          </div>
          {showSearchResults && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white/90 border border-[#A3ADB7] rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto backdrop-blur-sm">
              {filteredResults.length > 0 ? (
                <div className="py-2">
                  {filteredResults.map((result, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearchResultClick(result.path)}
                      className="w-full px-4 py-3 text-left hover:bg-[#E0E6ED] flex items-center gap-3 border-b border-[#D0D8E0] last:border-b-0 transition-colors"
                    >
                      <span className="text-lg">{getTypeIcon(result.type)}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-[#3F4F5E]">{result.title}</span>
                          <Badge className={`text-xs ${getTypeColor(result.type)}`}>{result.type}</Badge>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-6 text-center text-[#5C6B78]">
                  <Search className="w-8 h-8 mx-auto mb-2 text-[#A3ADB7]" />
                  <p>No results found for "{searchQuery}"</p>
                  <p className="text-sm">Try searching for subjects, chapters, or topics</p>
                </div>
              )}
            </div>
          )}
          {showSearchResults && <div className="fixed inset-0 z-40" onClick={() => setShowSearchResults(false)} />}
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Timer */}
          <div className="hidden md:flex items-center space-x-3 bg-gradient-to-r from-[#4A5B6E] to-[#6D7A88] rounded-xl px-3 py-2 sm:px-4 sm:py-2.5 border border-[#3D4A58] shadow-md">
            <Clock className="w-4 h-4 text-white" />
            <span className="text-sm font-mono font-semibold text-white">{formatTime(dailyTime)}</span>
            <Badge
              className={`text-xs border-0 px-2 py-1 ${isRunning ? "bg-emerald-500 text-white" : "bg-[#A3ADB7] text-white"}`}
            >
              {isRunning ? "Active" : "Paused"}
            </Badge>
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center space-x-2 text-white hover:text-gray-100 hover:bg-white/10 px-2 py-1.5 sm:px-3 sm:py-2"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-[#5C6B78] to-[#4A5B6E] rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">{user?.name?.split(" ").map((n) => n[0]).join("") || "U"}</span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">{user?.name || "User"}</p>
                  <p className="text-xs text-gray-300">Grade {user?.grade || "N/A"}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white border border-[#A3ADB7] shadow-lg">
              <DropdownMenuLabel className="text-[#3F4F5E] font-medium">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#A3ADB7]" />
              <DropdownMenuItem
                onClick={() => router.push("/child/profile")}
                className="text-[#3F4F5E] hover:bg-[#E0E6ED] hover:text-[#2D3748] cursor-pointer"
              >
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#A3ADB7]" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
