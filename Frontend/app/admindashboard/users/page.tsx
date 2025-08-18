"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Users,
  Plus,
  Search,
  Filter,
  Download,
  UserPlus,
  Baby,
  Eye,
  EyeOff,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  Loader2,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  XCircle,
  GraduationCap,
  Calendar,
  Mail,
  CreditCard,
  UserCheck,
  UserX,
  CheckCircle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data
const mockParents = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    childrenCount: 2,
    createdAt: "2024-01-15",
    status: "active",
    paymentStatus: "paid",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 234-5678",
    childrenCount: 1,
    createdAt: "2024-01-20",
    status: "active",
    paymentStatus: "overdue",
  },
  {
    id: "3",
    name: "Michael Davis",
    email: "michael.davis@email.com",
    phone: "+1 (555) 345-6789",
    childrenCount: 3,
    createdAt: "2024-02-01",
    status: "suspended",
    paymentStatus: "overdue",
  },
]

const mockChildren = [
  {
    id: "c1",
    name: "Emma Smith",
    email: "emma.smith@email.com",
    parentId: "1",
    parentName: "John Smith",
    grade: "Grade 5",
    createdAt: "2024-01-15",
    status: "active",
    lastLogin: "2024-01-20",
  },
  {
    id: "c2",
    name: "Liam Smith",
    email: "liam.smith@email.com",
    parentId: "1",
    parentName: "John Smith",
    grade: "Grade 3",
    createdAt: "2024-01-15",
    status: "active",
    lastLogin: "2024-01-19",
  },
  {
    id: "c3",
    name: "Olivia Johnson",
    email: "olivia.johnson@email.com",
    parentId: "2",
    parentName: "Sarah Johnson",
    grade: "Grade 7",
    createdAt: "2024-01-20",
    status: "active",
    lastLogin: "2024-01-18",
  },
]

interface Parent {
  id: string
  name: string
  email: string
  phone?: string
  childrenCount: number
  createdAt: string
  status: "active" | "suspended"
  paymentStatus: "paid" | "overdue" | "pending"
}

interface Child {
  id: string
  name: string
  email: string
  parentId: string
  parentName: string
  grade: string
  createdAt: string
  status: "active" | "suspended"
  lastLogin: string
}

interface ChildForm {
  name: string
  email: string
  grade: string
  password: string
  autoGenerate: boolean
}

interface UserCredentials {
  email: string
  password: string
  type: "parent" | "child"
  name: string
  children?: Array<{
    name: string
    email: string
    password: string
    grade: string
  }>
}

export default function UsersPage() {
  const [mounted, setMounted] = useState(false)
  const [parents, setParents] = useState<Parent[]>([])
  const [children, setChildren] = useState<Child[]>([])
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isCredentialsOpen, setIsCredentialsOpen] = useState(false)
  const [userCredentials, setUserCredentials] = useState<UserCredentials | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editingUser, setEditingUser] = useState<Parent | Child | null>(null)

  // Parent form state
  const [parentForm, setParentForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    autoGenerate: true,
  })

  // Children forms for parent creation
  const [childrenForms, setChildrenForms] = useState<ChildForm[]>([
    { name: "", email: "", grade: "", password: "", autoGenerate: true },
  ])

  // Single child form state
  const [childForm, setChildForm] = useState({
    name: "",
    email: "",
    parentId: "",
    grade: "",
    password: "",
    autoGenerate: true,
  })

  const [addUserType, setAddUserType] = useState<"parent" | "child">("parent")
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
    setParents(mockParents)
    setChildren(mockChildren)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const toggleUserExpansion = (userId: string) => {
    const newExpanded = new Set(expandedUsers)
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId)
    } else {
      newExpanded.add(userId)
    }
    setExpandedUsers(newExpanded)
  }

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
    let password = ""
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const isEmailUnique = (email: string, excludeId?: string) => {
    const allEmails = [
      ...parents.filter((p) => p.id !== excludeId).map((p) => p.email),
      ...children.map((c) => c.email),
    ]
    return !allEmails.includes(email)
  }

  const addChildForm = () => {
    setChildrenForms([...childrenForms, { name: "", email: "", grade: "", password: "", autoGenerate: true }])
  }

  const removeChildForm = (index: number) => {
    if (childrenForms.length > 1) {
      setChildrenForms(childrenForms.filter((_, i) => i !== index))
    }
  }

  const updateChildForm = (index: number, field: keyof ChildForm, value: string | boolean) => {
    const updated = [...childrenForms]
    updated[index] = { ...updated[index], [field]: value }

    // Auto-generate password if enabled
    if (field === "autoGenerate" && value === true) {
      updated[index].password = generatePassword()
    }

    setChildrenForms(updated)
  }

  const handleUserUpdate = (updatedUser: Parent | Child, isChild = false, parentId?: string) => {
    if (isChild && parentId) {
      setChildren((prevChildren) =>
        prevChildren.map((child) => (child.id === updatedUser.id ? { ...child, ...updatedUser } : child)),
      )
    } else if (!isChild) {
      setParents((prevParents) =>
        prevParents.map((parent) => (parent.id === updatedUser.id ? { ...parent, ...updatedUser } : parent)),
      )
    }
  }

  const handleAddParent = async () => {
    // Validate parent form
    if (!parentForm.name || !parentForm.email) {
      toast({
        title: "Error",
        description: "Please fill in all required parent fields",
        variant: "destructive",
      })
      return
    }

    if (!validateEmail(parentForm.email)) {
      toast({
        title: "Error",
        description: "Please enter a valid parent email address",
        variant: "destructive",
      })
      return
    }

    if (!isEmailUnique(parentForm.email)) {
      toast({
        title: "Error",
        description: "Parent email address is already in use",
        variant: "destructive",
      })
      return
    }

    if (!parentForm.autoGenerate && !parentForm.password) {
      toast({
        title: "Error",
        description: "Please enter a password for the parent or enable auto-generation",
        variant: "destructive",
      })
      return
    }

    // Validate children forms (only filled ones)
    const validChildren = childrenForms.filter((child) => child.name || child.email)

    for (let i = 0; i < validChildren.length; i++) {
      const child = validChildren[i]
      if (!child.name || !child.email || !child.grade) {
        toast({
          title: "Error",
          description: `Please fill in all required fields for child ${i + 1}`,
          variant: "destructive",
        })
        return
      }

      if (!validateEmail(child.email)) {
        toast({
          title: "Error",
          description: `Please enter a valid email address for child ${i + 1}`,
          variant: "destructive",
        })
        return
      }

      if (!isEmailUnique(child.email)) {
        toast({
          title: "Error",
          description: `Email address for child ${i + 1} is already in use`,
          variant: "destructive",
        })
        return
      }

      if (!child.autoGenerate && !child.password) {
        toast({
          title: "Error",
          description: `Please enter a password for child ${i + 1} or enable auto-generation`,
          variant: "destructive",
        })
        return
      }
    }

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const parentPassword = parentForm.autoGenerate ? generatePassword() : parentForm.password

    const newParent: Parent = {
      id: Date.now().toString(),
      name: parentForm.name,
      email: parentForm.email,
      phone: parentForm.phone,
      childrenCount: validChildren.length,
      createdAt: new Date().toISOString().split("T")[0],
      status: "active",
      paymentStatus: "pending",
    }

    // Create children
    const newChildren: Child[] = validChildren.map((child, index) => ({
      id: `${Date.now()}_${index}`,
      name: child.name,
      email: child.email,
      parentId: newParent.id,
      parentName: newParent.name,
      grade: child.grade,
      createdAt: new Date().toISOString().split("T")[0],
      status: "active",
      lastLogin: "Never",
    }))

    setParents((prev) => [...prev, newParent])
    setChildren((prev) => [...prev, ...newChildren])

    // Prepare credentials
    const childrenCredentials = validChildren.map((child) => ({
      name: child.name,
      email: child.email,
      password: child.autoGenerate ? generatePassword() : child.password,
      grade: child.grade,
    }))

    setUserCredentials({
      email: parentForm.email,
      password: parentPassword,
      type: "parent",
      name: parentForm.name,
      children: childrenCredentials,
    })

    // Reset forms
    setParentForm({ name: "", email: "", phone: "", password: "", autoGenerate: true })
    setChildrenForms([{ name: "", email: "", grade: "", password: "", autoGenerate: true }])
    setIsAddUserOpen(false)
    setIsCredentialsOpen(true)
    setIsLoading(false)

    toast({
      title: "Success",
      description: `Parent account created with ${validChildren.length} children`,
    })
  }

  const handleAddChild = async () => {
    if (!childForm.name || !childForm.email || !childForm.parentId || !childForm.grade) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (!validateEmail(childForm.email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }

    if (!isEmailUnique(childForm.email)) {
      toast({
        title: "Error",
        description: "This email address is already in use",
        variant: "destructive",
      })
      return
    }

    if (!childForm.autoGenerate && !childForm.password) {
      toast({
        title: "Error",
        description: "Please enter a password or enable auto-generation",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const parent = parents.find((p) => p.id === childForm.parentId)
    if (!parent) return

    const newChild: Child = {
      id: Date.now().toString(),
      name: childForm.name,
      email: childForm.email,
      parentId: childForm.parentId,
      parentName: parent.name,
      grade: childForm.grade,
      createdAt: new Date().toISOString().split("T")[0],
      status: "active",
      lastLogin: "Never",
    }

    const password = childForm.autoGenerate ? generatePassword() : childForm.password

    setChildren((prev) => [...prev, newChild])
    setParents((prev) =>
      prev.map((p) => (p.id === childForm.parentId ? { ...p, childrenCount: p.childrenCount + 1 } : p)),
    )

    setUserCredentials({
      email: childForm.email,
      password,
      type: "child",
      name: childForm.name,
    })

    setChildForm({ name: "", email: "", parentId: "", grade: "", password: "", autoGenerate: true })
    setIsAddUserOpen(false)
    setIsCredentialsOpen(true)
    setIsLoading(false)

    toast({
      title: "Success",
      description: "Child account created successfully",
    })
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: "Copied!",
        description: "Credentials copied to clipboard",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const exportToPDF = () => {
    // Create a new window for PDF generation
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    // Generate HTML content for PDF
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>User Management Report</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #3b82f6;
          padding-bottom: 20px;
        }
        .header h1 {
          color: #1e40af;
          margin: 0;
        }
        .header p {
          color: #6b7280;
          margin: 5px 0 0 0;
        }
        .stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }
        .stat-card {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 15px;
          text-align: center;
        }
        .stat-card h3 {
          margin: 0 0 5px 0;
          font-size: 24px;
          color: #1f2937;
        }
        .stat-card p {
          margin: 0;
          color: #6b7280;
          font-size: 14px;
        }
        .section {
          margin-bottom: 40px;
        }
        .section h2 {
          color: #1e40af;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        .user-card {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          margin-bottom: 20px;
          overflow: hidden;
        }
        .user-header {
          background-color: #f8fafc;
          padding: 15px;
          border-bottom: 1px solid #e5e7eb;
        }
        .user-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .user-details h3 {
          margin: 0 0 5px 0;
          color: #1f2937;
        }
        .user-details p {
          margin: 0;
          color: #6b7280;
          font-size: 14px;
        }
        .badges {
          display: flex;
          gap: 10px;
        }
        .badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }
        .badge-active {
          background-color: #dcfce7;
          color: #166534;
        }
        .badge-suspended {
          background-color: #fecaca;
          color: #991b1b;
        }
        .badge-paid {
          background-color: #dcfce7;
          color: #166534;
        }
        .badge-overdue {
          background-color: #fecaca;
          color: #991b1b;
        }
        .badge-pending {
          background-color: #fef3c7;
          color: #92400e;
        }
        .children-section {
          padding: 15px;
          background-color: #fafafa;
        }
        .children-section h4 {
          margin: 0 0 15px 0;
          color: #374151;
        }
        .child-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          background-color: white;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          margin-bottom: 10px;
        }
        .child-item:last-child {
          margin-bottom: 0;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          color: #6b7280;
          font-size: 12px;
          border-top: 1px solid #e5e7eb;
          padding-top: 20px;
        }
        @media print {
          body { margin: 0; }
          .user-card { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>User Management Report</h1>
        <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
      </div>

      <div class="stats">
        <div class="stat-card">
          <h3>${parents.length}</h3>
          <p>Total Parents</p>
        </div>
        <div class="stat-card">
          <h3>${children.length}</h3>
          <p>Total Children</p>
        </div>
        <div class="stat-card">
          <h3>${parents.filter((u) => u.status === "active").length}</h3>
          <p>Active Accounts</p>
        </div>
        <div class="stat-card">
          <h3>${parents.filter((u) => u.paymentStatus === "overdue").length}</h3>
          <p>Payment Issues</p>
        </div>
      </div>

      <div class="section">
        <h2>Parent Accounts (${parents.length})</h2>
        ${parents
          .map((parent) => {
            const parentChildren = children.filter((child) => child.parentId === parent.id)
            return `
            <div class="user-card">
              <div class="user-header">
                <div class="user-info">
                  <div class="user-details">
                    <h3>${parent.name}</h3>
                    <p>${parent.email} • ${parent.phone || "No phone"} • Joined ${parent.createdAt}</p>
                  </div>
                  <div class="badges">
                    <span class="badge badge-${parent.status}">${parent.status.toUpperCase()}</span>
                    <span class="badge badge-${parent.paymentStatus}">${parent.paymentStatus.toUpperCase()}</span>
                  </div>
                </div>
              </div>
              ${
                parentChildren.length > 0
                  ? `
                <div class="children-section">
                  <h4>Children (${parentChildren.length})</h4>
                  ${parentChildren
                    .map(
                      (child) => `
                    <div class="child-item">
                      <div class="user-details">
                        <h3>${child.name}</h3>
                        <p>${child.email} • ${child.grade} • Last login: ${child.lastLogin}</p>
                      </div>
                      <div class="badges">
                        <span class="badge badge-${child.status}">${child.status.toUpperCase()}</span>
                      </div>
                    </div>
                  `,
                    )
                    .join("")}
                </div>
              `
                  : `
                <div class="children-section">
                  <p style="color: #6b7280; text-align: center; margin: 0;">No children accounts</p>
                </div>
              `
              }
            </div>
          `
          })
          .join("")}
      </div>

      <div class="footer">
        <p>This report contains ${parents.length} parent accounts and ${children.length} child accounts.</p>
        <p>© 2024 EduPlatform - User Management System</p>
      </div>
    </body>
    </html>
  `

    // Write content to new window and trigger print
    printWindow.document.write(htmlContent)
    printWindow.document.close()

    // Wait for content to load then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 250)
    }

    toast({
      title: "PDF Export",
      description: "PDF export dialog opened. Please save or print the document.",
    })
  }

  const filteredParents = parents.filter((parent) => {
    const matchesSearch =
      parent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      parent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      children
        .filter((child) => child.parentId === parent.id)
        .some((child) => child.name.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || parent.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage parent and child accounts for your educational platform</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <CardContent className="p-6 ">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Parents</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{parents.length}</p>
              </div>
              <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 h-40 shadow-sm bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Total Children</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">{children.length}</p>
              </div>
              <div className="h-12 w-12 bg-green-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Active Accounts</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  {parents.filter((u) => u.status === "active").length}
                </p>
              </div>
              <div className="h-12 w-12 bg-orange-600 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">Payment Issues</p>
                <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                  {parents.filter((u) => u.paymentStatus === "overdue").length}
                </p>
              </div>
              <div className="h-12 w-12 bg-red-600 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Actions */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by name, email, or child name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48 border-slate-200 dark:border-slate-700">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="suspended">Suspended Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={exportToPDF}
                variant="outline"
                className="border-slate-200 dark:border-slate-700 bg-transparent"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-gradient-to-br from-[#D2B48C] via-[#F3E5AB] to-[#FFF8E1] hover:from-[#C2A678] hover:via-[#E6D08F] hover:to-[#FDF2C8] text-white">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add New User
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      setAddUserType("parent")
                      setIsAddUserOpen(true)
                    }}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Parent Account
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setAddUserType("child")
                      setIsAddUserOpen(true)
                    }}
                  >
                    <Baby className="w-4 h-4 mr-2" />
                    Add Child to Parent
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Cards */}
      <div className="space-y-4">
        {filteredParents.map((parent) => {
          const parentChildren = children.filter((child) => child.parentId === parent.id)
          return (
            <Card key={parent.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                {/* Parent Account Header */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleUserExpansion(parent.id)}
                        className="p-1 h-8 w-8"
                      >
                        {expandedUsers.has(parent.id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-semibold">
                          {parent.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">{parent.name}</h3>
                          <Badge
                            variant={parent.status === "active" ? "default" : "destructive"}
                            className={
                              parent.status === "active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : ""
                            }
                          >
                            {parent.status === "active" ? (
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                            ) : (
                              <XCircle className="h-3 w-3 mr-1" />
                            )}
                            {parent.status}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={
                              parent.paymentStatus === "paid"
                                ? "border-green-200 text-green-700 dark:border-green-800 dark:text-green-300"
                                : parent.paymentStatus === "overdue"
                                  ? "border-red-200 text-red-700 dark:border-red-800 dark:text-red-300"
                                  : "border-orange-200 text-orange-700 dark:border-orange-800 dark:text-orange-300"
                            }
                          >
                            <CreditCard className="h-3 w-3 mr-1" />
                            {parent.paymentStatus}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {parent.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Joined {parent.createdAt}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {parent.childrenCount} children
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Edit3 className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Parent Account</DialogTitle>
                            <DialogDescription>Update parent account information</DialogDescription>
                          </DialogHeader>
                          <EditUserForm
                            user={parent}
                            onClose={() => setEditingUser(null)}
                            onUpdate={(updatedUser) => handleUserUpdate(updatedUser, false)}
                          />
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant={parent.status === "active" ? "destructive" : "default"}
                        size="sm"
                        onClick={() =>
                          handleUserUpdate(
                            { ...parent, status: parent.status === "active" ? "suspended" : "active" },
                            false,
                          )
                        }
                      >
                        {parent.status === "active" ? (
                          <>
                            <UserX className="h-4 w-4 mr-2" />
                            Suspend
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-4 w-4 mr-2" />
                            Activate
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Children Accounts */}
                {expandedUsers.has(parent.id) && (
                  <div className="p-6 bg-slate-50 dark:bg-slate-900/50">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <GraduationCap className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                        <h4 className="font-medium text-slate-900 dark:text-slate-100">Children Accounts</h4>
                      </div>
                      {parentChildren.length === 0 ? (
                        <p className="text-slate-500 dark:text-slate-400 text-center py-8">
                          No children accounts found
                        </p>
                      ) : (
                        <div className="grid gap-4">
                          {parentChildren.map((child) => (
                            <div
                              key={child.id}
                              className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                            >
                              <div className="flex items-center gap-4">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 font-semibold">
                                    {child.name.substring(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-3">
                                    <h5 className="font-medium text-slate-900 dark:text-slate-100">{child.name}</h5>
                                    <Badge
                                      variant={child.status === "active" ? "default" : "destructive"}
                                      className={
                                        child.status === "active"
                                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                          : ""
                                      }
                                    >
                                      {child.status}
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                                    >
                                      <GraduationCap className="h-3 w-3 mr-1" />
                                      {child.grade}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Last login: {child.lastLogin}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      <Edit3 className="h-4 w-4 mr-2" />
                                      Edit
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Edit Child Account</DialogTitle>
                                      <DialogDescription>Update child account information</DialogDescription>
                                    </DialogHeader>
                                    <EditUserForm
                                      user={child}
                                      onClose={() => setEditingUser(null)}
                                      onUpdate={(updatedUser) => handleUserUpdate(updatedUser, true, parent.id)}
                                    />
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  variant={child.status === "active" ? "destructive" : "default"}
                                  size="sm"
                                  onClick={() =>
                                    handleUserUpdate(
                                      { ...child, status: child.status === "active" ? "suspended" : "active" },
                                      true,
                                      parent.id,
                                    )
                                  }
                                >
                                  {child.status === "active" ? (
                                    <>
                                      <UserX className="h-4 w-4 mr-2" />
                                      Suspend
                                    </>
                                  ) : (
                                    <>
                                      <UserCheck className="h-4 w-4 mr-2" />
                                      Activate
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Add User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {addUserType === "parent" ? "Add Parent Account with Children" : "Add Child Account"}
            </DialogTitle>
            <DialogDescription>
              {addUserType === "parent"
                ? "Create a new parent account and optionally add their children. Passwords can be auto-generated or set manually."
                : "Add a child to an existing parent account. Password can be auto-generated or set manually."}
            </DialogDescription>
          </DialogHeader>

          {addUserType === "parent" ? (
            <div className="grid gap-6 py-4">
              {/* Parent Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Parent Information</h3>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="parent-name">Full Name *</Label>
                    <Input
                      id="parent-name"
                      value={parentForm.name}
                      onChange={(e) => setParentForm((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter parent's full name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="parent-email">Email Address *</Label>
                    <Input
                      id="parent-email"
                      type="email"
                      value={parentForm.email}
                      onChange={(e) => setParentForm((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="parent-phone">Phone Number</Label>
                    <Input
                      id="parent-phone"
                      value={parentForm.phone}
                      onChange={(e) => setParentForm((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter phone number (optional)"
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="parent-auto-password"
                        checked={parentForm.autoGenerate}
                        onCheckedChange={(checked) =>
                          setParentForm((prev) => ({
                            ...prev,
                            autoGenerate: checked as boolean,
                            password: checked ? generatePassword() : "",
                          }))
                        }
                      />
                      <Label htmlFor="parent-auto-password">Auto-generate secure password</Label>
                    </div>
                    {!parentForm.autoGenerate && (
                      <div className="grid gap-2">
                        <Label htmlFor="parent-password">Password *</Label>
                        <Input
                          id="parent-password"
                          type="password"
                          value={parentForm.password}
                          onChange={(e) => setParentForm((prev) => ({ ...prev, password: e.target.value }))}
                          placeholder="Enter password"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Children Information */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Children Information (Optional)</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addChildForm}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Child
                  </Button>
                </div>

                {childrenForms.map((child, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Child {index + 1}</h4>
                      {childrenForms.length > 1 && (
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeChildForm(index)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label>Child's Full Name</Label>
                        <Input
                          value={child.name}
                          onChange={(e) => updateChildForm(index, "name", e.target.value)}
                          placeholder="Enter child's full name"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Child's Email Address</Label>
                        <Input
                          type="email"
                          value={child.email}
                          onChange={(e) => updateChildForm(index, "email", e.target.value)}
                          placeholder="Enter child's email address"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Grade Level</Label>
                        <Select value={child.grade} onValueChange={(value) => updateChildForm(index, "grade", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select grade level" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => (
                              <SelectItem key={i + 1} value={`Grade ${i + 1}`}>
                                Grade {i + 1}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`child-auto-password-${index}`}
                            checked={child.autoGenerate}
                            onCheckedChange={(checked) => updateChildForm(index, "autoGenerate", checked as boolean)}
                          />
                          <Label htmlFor={`child-auto-password-${index}`}>Auto-generate secure password</Label>
                        </div>
                        {!child.autoGenerate && (
                          <div className="grid gap-2">
                            <Label>Password</Label>
                            <Input
                              type="password"
                              value={child.password}
                              onChange={(e) => updateChildForm(index, "password", e.target.value)}
                              placeholder="Enter password"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="child-name">Child's Full Name *</Label>
                <Input
                  id="child-name"
                  value={childForm.name}
                  onChange={(e) => setChildForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter child's full name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="child-email">Child's Email Address *</Label>
                <Input
                  id="child-email"
                  type="email"
                  value={childForm.email}
                  onChange={(e) => setChildForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter child's email address"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="parent-select">Select Parent *</Label>
                <Select
                  value={childForm.parentId}
                  onValueChange={(value) => setChildForm((prev) => ({ ...prev, parentId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a parent account" />
                  </SelectTrigger>
                  <SelectContent>
                    {parents.map((parent) => (
                      <SelectItem key={parent.id} value={parent.id}>
                        {parent.name} ({parent.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="grade-select">Grade Level *</Label>
                <Select
                  value={childForm.grade}
                  onValueChange={(value) => setChildForm((prev) => ({ ...prev, grade: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade level" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i + 1} value={`Grade ${i + 1}`}>
                        Grade {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="child-auto-password"
                    checked={childForm.autoGenerate}
                    onCheckedChange={(checked) =>
                      setChildForm((prev) => ({
                        ...prev,
                        autoGenerate: checked as boolean,
                        password: checked ? generatePassword() : "",
                      }))
                    }
                  />
                  <Label htmlFor="child-auto-password">Auto-generate secure password</Label>
                </div>
                {!childForm.autoGenerate && (
                  <div className="grid gap-2">
                    <Label htmlFor="child-password">Password *</Label>
                    <Input
                      id="child-password"
                      type="password"
                      value={childForm.password}
                      onChange={(e) => setChildForm((prev) => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter password"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={addUserType === "parent" ? handleAddParent : handleAddChild}
              disabled={isLoading}
              className="bg-gradient-to-br from-[#D2B48C] via-[#F3E5AB] to-[#FFF8E1] hover:from-[#C2A678] hover:via-[#E6D08F] hover:to-[#FDF2C8]"
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {addUserType === "parent" ? "Create Parent & Children" : "Create Child Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Credentials Dialog */}
      <Dialog open={isCredentialsOpen} onOpenChange={setIsCredentialsOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Accounts Created Successfully!</DialogTitle>
            <DialogDescription>
              Please save these login credentials securely. The passwords will not be shown again.
            </DialogDescription>
          </DialogHeader>

          {userCredentials && (
            <div className="grid gap-4 py-4">
              {/* Parent Credentials */}
              <div className="p-4 bg-muted rounded-lg space-y-3">
                <h3 className="font-semibold">Parent Account</h3>
                <div>
                  <Label className="text-sm font-medium">Name</Label>
                  <p className="text-sm">{userCredentials.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm font-mono">{userCredentials.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Password</Label>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-mono flex-1">
                      {showPassword ? userCredentials.password : "••••••••••••"}
                    </p>
                    <Button variant="ghost" size="sm" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Children Credentials */}
              {userCredentials.children && userCredentials.children.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold">Children Accounts</h3>
                  {userCredentials.children.map((child, index) => (
                    <div key={index} className="p-4 bg-muted rounded-lg space-y-3">
                      <h4 className="font-medium">Child {index + 1}</h4>
                      <div>
                        <Label className="text-sm font-medium">Name</Label>
                        <p className="text-sm">{child.name}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Email</Label>
                        <p className="text-sm font-mono">{child.email}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Grade</Label>
                        <p className="text-sm">{child.grade}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Password</Label>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-mono flex-1">{showPassword ? child.password : "••••••••••••"}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Button
                variant="outline"
                onClick={() => {
                  let credentialsText = `Parent Account:\nEmail: ${userCredentials.email}\nPassword: ${userCredentials.password}\n`

                  if (userCredentials.children && userCredentials.children.length > 0) {
                    credentialsText += "\nChildren Accounts:\n"
                    userCredentials.children.forEach((child, index) => {
                      credentialsText += `Child ${index + 1} (${child.name}):\nEmail: ${child.email}\nPassword: ${child.password}\nGrade: ${child.grade}\n\n`
                    })
                  }

                  copyToClipboard(credentialsText)
                }}
                className="w-full"
              >
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? "Copied!" : "Copy All Credentials"}
              </Button>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setIsCredentialsOpen(false)}>I've Saved the Credentials</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Edit User Form Component
function EditUserForm({
  user,
  onClose,
  onUpdate,
}: {
  user: Parent | Child
  onClose: () => void
  onUpdate: (updatedUser: Parent | Child) => void
}) {
  const [formData, setFormData] = useState({
    name: user.name,
    password: "",
    confirmPassword: "",
    email: user.email,
    phone: "phone" in user ? user.phone : "",
    grade: "grade" in user ? user.grade : "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showSuccess, setShowSuccess] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    } else if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters"
    }

    if (formData.password && formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!formData.email.includes("@") || !formData.email.includes(".")) {
      newErrors.email = "Please enter a valid email address"
    }

    if (formData.phone && !/^\+?[\d\s\-()]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number"
    }

    if ("grade" in user && !formData.grade) {
      newErrors.grade = "Grade level is required for child accounts"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const updatedUser = {
        ...user,
        name: formData.name,
        email: formData.email,
        ...("phone" in user && { phone: formData.phone }),
        ...("grade" in user && { grade: formData.grade }),
        ...(formData.password && { password: formData.password }),
        lastUpdated: new Date().toISOString(),
      }

      onUpdate(updatedUser)
      setShowSuccess(true)

      setTimeout(() => {
        onClose()
      }, 1000)
    } catch (error) {
      console.error("Failed to update user:", error)
      setErrors({ submit: "Failed to update user. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
        <h3 className="text-lg font-medium text-green-700 mb-2">Update Successful!</h3>
        <p className="text-sm text-muted-foreground">User information has been updated.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-name">Full Name *</Label>
          <Input
            id="edit-name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={errors.name ? "border-red-500" : ""}
            placeholder="Enter full name"
            required
          />
          {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
        </div>

        <div>
          <Label htmlFor="edit-email">Email Address *</Label>
          <Input
            id="edit-email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={errors.email ? "border-red-500" : ""}
            placeholder="Enter email address"
            required
          />
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-phone">Phone Number</Label>
          <Input
            id="edit-phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className={errors.phone ? "border-red-500" : ""}
            placeholder="Enter phone number"
          />
          {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
        </div>

        {"grade" in user && (
          <div>
            <Label htmlFor="edit-grade">Grade Level *</Label>
            <Select value={formData.grade} onValueChange={(value) => setFormData({ ...formData, grade: value })}>
              <SelectTrigger className={errors.grade ? "border-red-500" : ""}>
                <SelectValue placeholder="Select grade" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i + 1} value={`Grade ${i + 1}`}>
                    Grade {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.grade && <p className="text-sm text-red-500 mt-1">{errors.grade}</p>}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-password">New Password</Label>
          <Input
            id="edit-password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Leave blank to keep current"
            className={errors.password ? "border-red-500" : ""}
          />
          {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
        </div>

        <div>
          <Label htmlFor="edit-confirm-password">Confirm Password</Label>
          <Input
            id="edit-confirm-password"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            placeholder="Confirm new password"
            className={errors.confirmPassword ? "border-red-500" : ""}
          />
          {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>}
        </div>
      </div>

      {errors.submit && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{errors.submit}</p>
        </div>
      )}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-br from-[#D2B48C] via-[#F3E5AB] to-[#FFF8E1] hover:from-[#C2A678] hover:via-[#E6D08F] hover:to-[#FDF2C8]"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Updating...
            </>
          ) : (
            "Update User"
          )}
        </Button>
      </DialogFooter>
    </form>
  )
}
