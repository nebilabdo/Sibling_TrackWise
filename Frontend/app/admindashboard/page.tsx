"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  BookOpen,
  TrendingUp,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
} from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your platform today.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-600 border-green-200">
            <Activity className="w-3 h-3 mr-1" />
            All Systems Operational
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  <Card className="bg-[#F47980]/10 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-[#F47980]">Total Users</CardTitle>
      <Users className="h-4 w-4 text-[#F47980] opacity-80 transition-transform duration-300 group-hover:scale-125" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-[#F47980]">2,847</div>
      <p className="text-xs text-[#F47980]/80">
        <span className="text-green-600 flex items-center">
          <ArrowUpRight className="w-3 h-3 mr-1" />
          +12.5%
        </span>
        from last month
      </p>
    </CardContent>
  </Card>

  <Card className="bg-[#E7FDEE] transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-[#00A76F]">Active Courses</CardTitle>
      <BookOpen className="h-4 w-4 text-[#00A76F] opacity-80 transition-transform duration-300 group-hover:scale-125" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-[#00A76F]">156</div>
      <p className="text-xs text-[#00A76F]/80">
        <span className="text-green-600 flex items-center">
          <ArrowUpRight className="w-3 h-3 mr-1" />
          +8.2%
        </span>
        from last month
      </p>
    </CardContent>
  </Card>

  <Card className="bg-[#FFF4E5] transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-[#FFAB00]">Quiz Completion Rate</CardTitle>
      <TrendingUp className="h-4 w-4 text-[#FFAB00] opacity-80 transition-transform duration-300 group-hover:scale-125" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-[#FFAB00]">87.3%</div>
      <p className="text-xs text-[#FFAB00]/80">
        <span className="text-red-600 flex items-center">
          <ArrowDownRight className="w-3 h-3 mr-1" />
          -2.1%
        </span>
        from last month
      </p>
    </CardContent>
  </Card>

  <Card className="bg-[#FEECEC] transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-[#FF5630]">Monthly Revenue</CardTitle>
      <DollarSign className="h-4 w-4 text-[#FF5630] opacity-80 transition-transform duration-300 group-hover:scale-125" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-[#FF5630]">$24,567</div>
      <p className="text-xs text-[#FF5630]/80">
        <span className="text-green-600 flex items-center">
          <ArrowUpRight className="w-3 h-3 mr-1" />
          +15.3%
        </span>
        from last month
      </p>
    </CardContent>
  </Card>
</div>



      {/* Main Content Grid */}
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        {/* Recent Activity */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest user interactions and system events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  user: "Sarah Johnson",
                  action: "completed Chapter 5 Quiz",
                  course: "Advanced Mathematics",
                  time: "2 minutes ago",
                  score: "95%",
                },
                {
                  user: "Mike Chen",
                  action: "started new course",
                  course: "Physics Fundamentals",
                  time: "15 minutes ago",
                  score: null,
                },
                {
                  user: "Emma Davis",
                  action: "submitted assignment",
                  course: "English Literature",
                  time: "1 hour ago",
                  score: "88%",
                },
                {
                  user: "Alex Rodriguez",
                  action: "completed final exam",
                  course: "Chemistry Basics",
                  time: "2 hours ago",
                  score: "92%",
                },
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">
                      <span className="text-blue-600">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.course} • {activity.time}
                    </p>
                  </div>
                  {activity.score && (
                    <Badge variant="secondary" className="text-green-600">
                      {activity.score}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current platform health metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Server Uptime</span>
                <span className="text-sm text-green-600">99.9%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full" 
                  style={{ width: `${99.9}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Database Performance</span>
                <span className="text-sm text-green-600">Excellent</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full" 
                  style={{ width: `${95}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">API Response Time</span>
                <span className="text-sm text-yellow-600">Good</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full" 
                  style={{ width: `${78}%` }}
                ></div>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>All services operational</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>Last backup: 2 hours ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions - Full Width */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Quick Actions</CardTitle>
          <CardDescription className="text-gray-600">Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 grid-cols-2 md:grid-cols-4 w-full">
            {/* Add New User */}
            <div className="group cursor-pointer w-full">
              <div className="flex flex-col items-center p-6 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 hover:border-orange-200 transition-all duration-200 hover:shadow-md w-full h-full">
                <div className="w-12 h-12 mb-4 flex items-center justify-center rounded-lg bg-gray-100 group-hover:bg-orange-100 transition-colors duration-200">
                  <Users className="w-6 h-6 text-gray-600 group-hover:text-orange-600 transition-colors duration-200" />
                </div>
                <span className="text-sm font-medium text-gray-900 text-center">Add New User</span>
              </div>
            </div>

            {/* Create Course */}
            <div className="group cursor-pointer w-full">
              <div className="flex flex-col items-center p-6 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 hover:border-orange-200 transition-all duration-200 hover:shadow-md w-full h-full">
                <div className="w-12 h-12 mb-4 flex items-center justify-center rounded-lg bg-gray-100 group-hover:bg-orange-100 transition-colors duration-200">
                  <BookOpen className="w-6 h-6 text-gray-600 group-hover:text-orange-600 transition-colors duration-200" />
                </div>
                <span className="text-sm font-medium text-gray-900 text-center">Create Course</span>
              </div>
            </div>

            {/* View Analytics */}
            <div className="group cursor-pointer w-full">
              <div className="flex flex-col items-center p-6 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 hover:border-orange-200 transition-all duration-200 hover:shadow-md w-full h-full">
                <div className="w-12 h-12 mb-4 flex items-center justify-center rounded-lg bg-gray-100 group-hover:bg-orange-100 transition-colors duration-200">
                  <TrendingUp className="w-6 h-6 text-gray-600 group-hover:text-orange-600 transition-colors duration-200" />
                </div>
                <span className="text-sm font-medium text-gray-900 text-center">View Analytics</span>
              </div>
            </div>

            {/* Payment Reports */}
            <div className="group cursor-pointer w-full">
              <div className="flex flex-col items-center p-6 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 hover:border-orange-200 transition-all duration-200 hover:shadow-md w-full h-full">
                <div className="w-12 h-12 mb-4 flex items-center justify-center rounded-lg bg-gray-100 group-hover:bg-orange-100 transition-colors duration-200">
                  <DollarSign className="w-6 h-6 text-gray-600 group-hover:text-orange-600 transition-colors duration-200" />
                </div>
                <span className="text-sm font-medium text-gray-900 text-center">Payment Reports</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}