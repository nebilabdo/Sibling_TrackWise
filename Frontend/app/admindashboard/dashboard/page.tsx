import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, BookOpen, BarChart, Settings, ArrowRight, Shield, Zap, Globe } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">EduPlatform</span>
          </div>
          <Link href="/admindashboard">
            <Button>
              Go to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <Badge variant="secondary" className="mb-4">
          Admin Dashboard v2.0
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Educational Platform
          <span className="text-blue-600 block">Admin Dashboard</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Manage users, content, analytics, and system settings from one powerful dashboard. Built for educators,
          administrators, and platform managers.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/admindashboard">
            <Button size="lg" className="w-full sm:w-auto">
              Access Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
            View Documentation
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need to manage your platform</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Comprehensive tools and insights to help you deliver the best educational experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="w-10 h-10 text-blue-600 mb-2" />
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage parent and child accounts, track user activity, and handle account permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Create parent/child accounts</li>
                <li>• Bulk user operations</li>
                <li>• Activity monitoring</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BookOpen className="w-10 h-10 text-green-600 mb-2" />
              <CardTitle>Content Manager</CardTitle>
              <CardDescription>
                Upload, organize, and manage educational content, courses, and learning materials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Course creation & editing</li>
                <li>• File management</li>
                <li>• Content organization</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BarChart className="w-10 h-10 text-purple-600 mb-2" />
              <CardTitle>Analytics & Reports</CardTitle>
              <CardDescription>
                Track learning progress, quiz performance, and generate detailed reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Learning analytics</li>
                <li>• Performance tracking</li>
                <li>• Custom reports</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Settings className="w-10 h-10 text-orange-600 mb-2" />
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                Configure platform settings, manage integrations, and customize the user experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Platform configuration</li>
                <li>• Integration management</li>
                <li>• User experience settings</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Shield className="w-10 h-10 text-red-600 mb-2" />
              <CardTitle>Security & Compliance</CardTitle>
              <CardDescription>
                Ensure data security, manage permissions, and maintain compliance standards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Role-based access</li>
                <li>• Data encryption</li>
                <li>• Audit logs</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Zap className="w-10 h-10 text-yellow-600 mb-2" />
              <CardTitle>Performance Monitoring</CardTitle>
              <CardDescription>
                Monitor system performance, track usage metrics, and optimize platform efficiency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Real-time monitoring</li>
                <li>• Usage analytics</li>
                <li>• Performance optimization</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardContent className="p-8 text-center">
            <Globe className="w-16 h-16 mx-auto mb-4 opacity-80" />
            <h3 className="text-2xl font-bold mb-4">Ready to get started?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Access your admin dashboard and start managing your educational platform with powerful tools and insights.
            </p>
            <Link href="/admindashboard">
              <Button size="lg" variant="secondary">
                Launch Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>&copy; 2024 EduPlatform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
