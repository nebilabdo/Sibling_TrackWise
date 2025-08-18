"use client"

import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
  Download,
  RefreshCw,
  CreditCard,
  DollarSign,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"

// Types
type PaymentStatus = "Confirmed" | "Pending" | "Overdue"
type PaymentMethod = "Credit Card" | "PayPal" | "Bank Transfer" | "Stripe"
type PaymentType = "Monthly" | "One-time"

type Child = {
  id: string
  name: string
  grade: string
  monthlyRate: number
}

type PaymentRecord = {
  id: string
  parentName: string
  parentEmail: string
  children: Child[]
  paymentType: PaymentType
  paymentMethod: PaymentMethod
  amountPaid: number
  calculatedAmount: number
  paymentDate: string
  status: PaymentStatus
  dueDate?: string
}

// Grade-based pricing structure
const GRADE_PRICING = {
  "Grade 1": 25,
  "Grade 2": 25,
  "Grade 3": 30,
  "Grade 4": 30,
  "Grade 5": 35,
  "Grade 6": 35,
  "Grade 7": 40,
  "Grade 8": 40,
  "Grade 9": 45,
  "Grade 10": 45,
  "Grade 11": 50,
  "Grade 12": 50,
}

const initialPayments: PaymentRecord[] = [
  {
    id: "p1",
    parentName: "John Smith",
    parentEmail: "john.smith@email.com",
    children: [
      { id: "c1", name: "Emma Smith", grade: "Grade 3", monthlyRate: 30 },
      { id: "c2", name: "Liam Smith", grade: "Grade 1", monthlyRate: 25 },
    ],
    paymentType: "Monthly",
    paymentMethod: "Credit Card",
    amountPaid: 55,
    calculatedAmount: 55,
    paymentDate: "2024-01-15",
    status: "Confirmed",
  },
  {
    id: "p2",
    parentName: "Sarah Johnson",
    parentEmail: "sarah.johnson@email.com",
    children: [{ id: "c3", name: "Olivia Johnson", grade: "Grade 5", monthlyRate: 35 }],
    paymentType: "One-time",
    paymentMethod: "PayPal",
    amountPaid: 300,
    calculatedAmount: 350,
    paymentDate: "2024-01-10",
    status: "Overdue",
    dueDate: "2024-01-20",
  },
  {
    id: "p3",
    parentName: "Michael Brown",
    parentEmail: "michael.brown@email.com",
    children: [
      { id: "c4", name: "Noah Brown", grade: "Grade 7", monthlyRate: 40 },
      { id: "c5", name: "Ava Brown", grade: "Grade 4", monthlyRate: 30 },
      { id: "c6", name: "Ethan Brown", grade: "Grade 2", monthlyRate: 25 },
    ],
    paymentType: "Monthly",
    paymentMethod: "Bank Transfer",
    amountPaid: 95,
    calculatedAmount: 95,
    paymentDate: "2024-01-12",
    status: "Confirmed",
  },
  {
    id: "p4",
    parentName: "Emily Davis",
    parentEmail: "emily.davis@email.com",
    children: [
      { id: "c7", name: "Sophia Davis", grade: "Grade 6", monthlyRate: 35 },
      { id: "c8", name: "Mason Davis", grade: "Grade 8", monthlyRate: 40 },
    ],
    paymentType: "Monthly",
    paymentMethod: "Stripe",
    amountPaid: 70,
    calculatedAmount: 75,
    paymentDate: "2024-01-08",
    status: "Pending",
  },
  {
    id: "p5",
    parentName: "David Wilson",
    parentEmail: "david.wilson@email.com",
    children: [{ id: "c9", name: "Isabella Wilson", grade: "Grade 10", monthlyRate: 45 }],
    paymentType: "One-time",
    paymentMethod: "Credit Card",
    amountPaid: 400,
    calculatedAmount: 450,
    paymentDate: "2024-01-05",
    status: "Overdue",
    dueDate: "2024-01-25",
  },
]

export default function PaymentsPage() {
  const { toast } = useToast()
  const [payments, setPayments] = useState<PaymentRecord[]>(initialPayments)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showInsufficientDialog, setShowInsufficientDialog] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Calculate statistics
  const totalRevenue = payments.filter((p) => p.status === "Confirmed").reduce((sum, p) => sum + p.amountPaid, 0)

  const confirmedCount = payments.filter((p) => p.status === "Confirmed").length
  const pendingCount = payments.filter((p) => p.status === "Pending").length
  const overdueCount = payments.filter((p) => p.status === "Overdue").length

  // Filter payments
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.parentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.children.some(
        (child) =>
          child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          child.grade.toLowerCase().includes(searchTerm.toLowerCase()),
      )

    const matchesStatus = statusFilter === "all" || payment.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Calculate if payment is sufficient
  const isPaymentSufficient = (payment: PaymentRecord): boolean => {
    return payment.amountPaid >= payment.calculatedAmount
  }

  // Get shortfall amount
  const getShortfall = (payment: PaymentRecord): number => {
    return Math.max(0, payment.calculatedAmount - payment.amountPaid)
  }

  // Handle payment verification
  const handleVerifyPayment = (payment: PaymentRecord) => {
    setIsLoading(true)

    setTimeout(() => {
      if (isPaymentSufficient(payment)) {
        // Payment is sufficient - confirm it
        setPayments(payments.map((p) => (p.id === payment.id ? { ...p, status: "Confirmed" as PaymentStatus } : p)))

        toast({
          title: "Payment Confirmed!",
          description: `${payment.parentName}'s account has been activated. Payment of $${payment.amountPaid} confirmed.`,
        })
      } else {
        // Payment is insufficient - show dialog
        setSelectedPayment(payment)
        setShowInsufficientDialog(true)
      }
      setIsLoading(false)
    }, 1000)
  }

  // Handle insufficient payment
  const handleInsufficientPayment = () => {
    if (selectedPayment) {
      const shortfall = getShortfall(selectedPayment)

      // Mark as overdue and request repayment
      setPayments(
        payments.map((p) =>
          p.id === selectedPayment.id
            ? {
                ...p,
                status: "Overdue" as PaymentStatus,
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              }
            : p,
        ),
      )

      toast({
        title: "Repayment Required",
        description: `${selectedPayment.parentName} needs to pay an additional $${shortfall}. Family has been notified.`,
        variant: "destructive",
      })
    }

    setShowInsufficientDialog(false)
    setSelectedPayment(null)
  }

  // Handle refund
  const handleRefund = (payment: PaymentRecord) => {
    if (window.confirm(`Are you sure you want to refund $${payment.amountPaid} to ${payment.parentName}?`)) {
      setPayments(payments.map((p) => (p.id === payment.id ? { ...p, status: "Pending" as PaymentStatus } : p)))

      toast({
        title: "Refund Processed",
        description: `$${payment.amountPaid} refund initiated for ${payment.parentName}.`,
      })
    }
  }

  // Export to PDF
  const exportToPDF = (payment: PaymentRecord) => {
    // Create PDF content
    const pdfContent = `
      PAYMENT REPORT
      ==============
      
      Family Information:
      - Parent: ${payment.parentName}
      - Email: ${payment.parentEmail}
      
      Children & Grades:
      ${payment.children.map((child) => `- ${child.name} (${child.grade}) - $${child.monthlyRate}/month`).join("\n")}
      
      Payment Details:
      - Type: ${payment.paymentType}
      - Method: ${payment.paymentMethod}
      - Date: ${payment.paymentDate}
      - Status: ${payment.status}
      
      Financial Summary:
      - Amount Paid: $${payment.amountPaid}
      - Required Amount: $${payment.calculatedAmount}
      - Status: ${isPaymentSufficient(payment) ? "Sufficient" : `Shortfall: $${getShortfall(payment)}`}
      
      Generated on: ${new Date().toLocaleDateString()}
    `

    // Create and download blob
    const blob = new Blob([pdfContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `payment-report-${payment.parentName.replace(/\s+/g, "-")}-${payment.id}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Report Exported",
      description: `Payment report for ${payment.parentName} has been downloaded.`,
    })
  }

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Overdue":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case "Confirmed":
        return <CheckCircle className="h-4 w-4" />
      case "Pending":
        return <Clock className="h-4 w-4" />
      case "Overdue":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Payment Management
            </h1>
            <p className="text-gray-600 mt-1">Monitor and manage family payments with automatic calculations</p>
          </div>
        </div>

        {/* Statistics Cards */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <Card className="rounded-2xl border-0 bg-[#E6FDEE] text-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 h-full min-h-[180px]">
    <CardContent className="p-6 h-full flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-green-800 text-sm font-medium">Total Revenue</p>
          <p className="text-3xl font-bold text-green-900">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white/20 p-3 rounded-xl transition-transform duration-300 hover:scale-110">
          <DollarSign className="h-8 w-8 text-green-800" />
        </div>
      </div>
      <div className="mt-4 text-green-700 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Total revenue from all confirmed payments
      </div>
    </CardContent>
  </Card>

  <Card className="rounded-2xl border-0 bg-[#E3EFFE] text-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 h-full min-h-[180px]">
    <CardContent className="p-6 h-full flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-blue-800 text-sm font-medium">Confirmed Payments</p>
          <p className="text-3xl font-bold text-blue-900">{confirmedCount}</p>
        </div>
        <div className="bg-white/20 p-3 rounded-xl transition-transform duration-300 hover:scale-110">
          <CheckCircle className="h-8 w-8 text-blue-800" />
        </div>
      </div>
      <div className="mt-4 text-blue-700 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Payments successfully processed and confirmed
      </div>
    </CardContent>
  </Card>

  <Card className="rounded-2xl border-0 bg-[#FFF2E0] text-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 h-full min-h-[180px]">
    <CardContent className="p-6 h-full flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-yellow-800 text-sm font-medium">Pending Payments</p>
          <p className="text-3xl font-bold text-yellow-900">{pendingCount}</p>
        </div>
        <div className="bg-white/20 p-3 rounded-xl transition-transform duration-300 hover:scale-110">
          <Clock className="h-8 w-8 text-yellow-800" />
        </div>
      </div>
      <div className="mt-4 text-yellow-700 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Payments awaiting confirmation or processing
      </div>
    </CardContent>
  </Card>

  <Card className="rounded-2xl border-0 bg-[#FEE9E9] text-white shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 h-full min-h-[180px]">
    <CardContent className="p-6 h-full flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-red-800 text-sm font-medium">Overdue Payments</p>
          <p className="text-3xl font-bold text-red-900">{overdueCount}</p>
        </div>
        <div className="bg-white/20 p-3 rounded-xl transition-transform duration-300 hover:scale-110">
          <AlertTriangle className="h-8 w-8 text-red-800" />
        </div>
      </div>
      <div className="mt-4 text-red-700 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Payments past their due date
      </div>
    </CardContent>
  </Card>
</div>

        {/* Main Content Card */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <CardTitle className="text-xl font-semibold text-gray-800">Payment Records</CardTitle>
            <CardDescription className="text-gray-600">
              Manage family payments with automatic grade-based calculations
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {/* Search and Filter Section */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 mb-6">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search families, emails, children, or grades..."
                  className="w-full rounded-xl bg-gray-50 border-gray-200 pl-10 h-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px] h-12 rounded-xl border-gray-200 bg-gray-50">
                    <Filter className="h-4 w-4 mr-2 text-gray-400" />
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Confirmed">Confirmed</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Payments Table */}
            <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200">
                    <TableHead className="font-semibold text-gray-700 w-[200px]">Family Details</TableHead>
                    <TableHead className="font-semibold text-gray-700 w-[250px]">Children & Grades</TableHead>
                    <TableHead className="font-semibold text-gray-700 w-[120px]">Payment Info</TableHead>
                    <TableHead className="font-semibold text-gray-700 w-[150px]">Amount</TableHead>
                    <TableHead className="font-semibold text-gray-700 w-[100px]">Status</TableHead>
                    <TableHead className="text-right font-semibold text-gray-700 w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-12">
                        <div className="flex flex-col items-center gap-2">
                          <CreditCard className="h-12 w-12 text-gray-300" />
                          <p className="text-lg font-medium">No payments found</p>
                          <p className="text-sm">Try adjusting your search criteria</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPayments.map((payment) => (
                      <TableRow key={payment.id} className="hover:bg-gray-50/50 transition-colors">
                        <TableCell className="py-4">
                          <div className="space-y-1">
                            <p className="font-medium text-gray-800">{payment.parentName}</p>
                            <p className="text-sm text-gray-600">{payment.parentEmail}</p>
                            <p className="text-xs text-gray-500">{payment.paymentDate}</p>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="space-y-1">
                            {payment.children.map((child) => (
                              <div key={child.id} className="flex items-center justify-between text-sm">
                                <span className="text-gray-800">{child.name}</span>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant="outline"
                                    className="text-xs rounded-full bg-blue-50 text-blue-700 border-blue-200"
                                  >
                                    {child.grade}
                                  </Badge>
                                  <span className="text-xs text-gray-600">${child.monthlyRate}/mo</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="space-y-1">
                            <Badge
                              variant="outline"
                              className="text-xs rounded-full bg-purple-50 text-purple-700 border-purple-200"
                            >
                              {payment.paymentType}
                            </Badge>
                            <p className="text-xs text-gray-600">{payment.paymentMethod}</p>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-800">${payment.amountPaid}</span>
                              {!isPaymentSufficient(payment) && <AlertTriangle className="h-4 w-4 text-red-500" />}
                            </div>
                            <p className="text-xs text-gray-600">Required: ${payment.calculatedAmount}</p>
                            {!isPaymentSufficient(payment) && (
                              <p className="text-xs text-red-600 font-medium">Shortfall: ${getShortfall(payment)}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge
                            variant="outline"
                            className={`rounded-full text-xs flex items-center gap-1 w-fit ${getStatusColor(payment.status)}`}
                          >
                            {getStatusIcon(payment.status)}
                            {payment.status}
                          </Badge>
                          {payment.dueDate && payment.status === "Overdue" && (
                            <p className="text-xs text-red-600 mt-1">Due: {payment.dueDate}</p>
                          )}
                        </TableCell>
                        <TableCell className="text-right py-4">
                          <div className="flex flex-col gap-2">
                            {payment.status === "Pending" && (
                              <Button
                                size="sm"
                                onClick={() => handleVerifyPayment(payment)}
                                disabled={isLoading}
                                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg text-xs h-8"
                              >
                                {isLoading ? (
                                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                )}
                                Verify
                              </Button>
                            )}
                            {payment.status === "Confirmed" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRefund(payment)}
                                className="rounded-lg text-xs h-8 text-orange-600 border-orange-200 hover:bg-orange-50"
                              >
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Refund
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => exportToPDF(payment)}
                              className="rounded-lg text-xs h-8 text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Export
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insufficient Payment Dialog */}
      <Dialog open={showInsufficientDialog} onOpenChange={setShowInsufficientDialog}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6" />
              Insufficient Payment
            </DialogTitle>
            <DialogDescription>The payment amount is less than the required amount for this family.</DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="py-4 space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <h4 className="font-semibold text-red-800 mb-2">Payment Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-red-700">Family:</span>
                    <span className="font-medium text-red-800">{selectedPayment.parentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-700">Amount Paid:</span>
                    <span className="font-medium text-red-800">${selectedPayment.amountPaid}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-700">Required Amount:</span>
                    <span className="font-medium text-red-800">${selectedPayment.calculatedAmount}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between">
                    <span className="text-red-700 font-semibold">Shortfall:</span>
                    <span className="font-bold text-red-800">${getShortfall(selectedPayment)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Children & Pricing</h4>
                <div className="space-y-2">
                  {selectedPayment.children.map((child) => (
                    <div key={child.id} className="flex justify-between text-sm">
                      <span className="text-blue-700">
                        {child.name} ({child.grade})
                      </span>
                      <span className="font-medium text-blue-800">${child.monthlyRate}/month</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowInsufficientDialog(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button
              onClick={handleInsufficientPayment}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl"
            >
              Request Repayment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
