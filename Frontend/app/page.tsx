"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, TrendingUp, ArrowRight, Star, Clock, Target } from "lucide-react"

export default function HomePage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated && user) {
      router.push("/child/dashboard")
    }
  }, [isAuthenticated, user, router])

  // If authenticated, don't render anything, just redirect immediately
  if (isAuthenticated && user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EduPlatform
              </span>
            </div>
            <Button
              onClick={() => router.push("/auth/login")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-blue-200 mb-4">
              🎓 Smart Learning Platform
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Learn Smarter with
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                AI-Powered Education
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Experience personalized learning with our intelligent platform. Track progress, take interactive quizzes,
              and master subjects at your own pace with built-in study timers and AI assistance.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="lg"
              onClick={() => router.push("/auth/login")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-3"
            >
              Start Learning Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-blue-200 hover:bg-blue-50 text-lg px-8 py-3 bg-transparent"
            >
              View Demo Accounts
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Smart Timer System</CardTitle>
                <CardDescription>
                  Built-in study timers that automatically track your learning progress and ensure focused study
                  sessions.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Interactive Quizzes</CardTitle>
                <CardDescription>
                  Regular quizzes every 5 pages with instant feedback and detailed explanations to reinforce learning.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Progress Tracking</CardTitle>
                <CardDescription>
                  Comprehensive progress tracking with detailed analytics and achievement unlocking system.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Accounts Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Try Our Demo Accounts</h2>
            <p className="text-lg text-gray-600">Experience the platform with pre-configured student accounts</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-blue-800">Grade 5 Student</CardTitle>
                  <Badge className="bg-blue-200 text-blue-800">Beginner</Badge>
                </div>
                <CardDescription className="text-blue-700">
                  John Doe - Perfect for elementary level learning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-blue-700">
                    <Star className="w-4 h-4 mr-2" />
                    Username: student1
                  </div>
                  <div className="flex items-center text-sm text-blue-700">
                    <Star className="w-4 h-4 mr-2" />
                    Password: pass123
                  </div>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => router.push("/auth/login")}>
                  Try This Account
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-purple-800">Grade 6 Student</CardTitle>
                  <Badge className="bg-purple-200 text-purple-800">Intermediate</Badge>
                </div>
                <CardDescription className="text-purple-700">
                  Jane Smith - Ideal for middle school concepts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-purple-700">
                    <Star className="w-4 h-4 mr-2" />
                    Username: student2
                  </div>
                  <div className="flex items-center text-sm text-purple-700">
                    <Star className="w-4 h-4 mr-2" />
                    Password: pass456
                  </div>
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => router.push("/auth/login")}>
                  Try This Account
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-green-800">Grade 7 Student</CardTitle>
                  <Badge className="bg-green-200 text-green-800">Advanced</Badge>
                </div>
                <CardDescription className="text-green-700">Mike Johnson - Great for advanced topics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-green-700">
                    <Star className="w-4 h-4 mr-2" />
                    Username: student3
                  </div>
                  <div className="flex items-center text-sm text-green-700">
                    <Star className="w-4 h-4 mr-2" />
                    Password: pass789
                  </div>
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => router.push("/auth/login")}>
                  Try This Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-600">10+</div>
              <div className="text-gray-600">Subjects Available</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-purple-600">200+</div>
              <div className="text-gray-600">Interactive Lessons</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-green-600">1000+</div>
              <div className="text-gray-600">Practice Questions</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-orange-600">24/7</div>
              <div className="text-gray-600">AI Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-white/20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EduPlatform
              </span>
            </div>
            <div className="text-sm text-gray-600">© 2024 EduPlatform. Empowering students worldwide.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
