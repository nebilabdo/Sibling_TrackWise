"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, CheckCircle, Archive, MessageSquare, Search } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

type Ticket = {
  id: string
  subject: string
  user: string
  type: "Payment Issue" | "Feature Request" | "Account Issue" | "Bug Report" | "General Inquiry"
  status: "Open" | "In Progress" | "Resolved" | "Archived"
  date: string
  description: string
  adminNotes?: string
}

const initialTickets: Ticket[] = [
  {
    id: "t1",
    subject: "Cannot upload reading file",
    user: "parent@example.com",
    type: "Bug Report",
    status: "Open",
    date: "2024-07-29",
    description: "When trying to upload a PDF, the system shows an error message 'File type not supported'.",
  },
  {
    id: "t2",
    subject: "Feature request: Dark mode",
    user: "child@example.com",
    type: "Feature Request", // Changed type
    status: "In Progress",
    date: "2024-07-28",
    description: "It would be great to have a dark mode option for the app.",
    adminNotes: "Forwarded to product team. Investigating feasibility.",
  },
  {
    id: "t3",
    subject: "Account activation issue",
    user: "newuser@example.com",
    type: "Account Issue", // Changed type
    status: "Resolved", // Changed status to Resolved
    date: "2024-07-27",
    description: "My account is still pending payment after 24 hours.",
    adminNotes: "Manually activated account and sent confirmation email.",
  },
  {
    id: "t4",
    subject: "Quiz question is incorrect",
    user: "teacher@example.com",
    type: "Bug Report",
    status: "Open",
    date: "2024-07-26",
    description: "Question 5 in 'Basic Math' quiz has the wrong answer marked.",
  },
  {
    id: "t5",
    subject: "Subscription payment failed",
    user: "parent2@example.com",
    type: "Payment Issue", // New type
    status: "Open",
    date: "2024-07-30",
    description: "My monthly subscription payment did not go through.",
  },
  {
    id: "t6",
    subject: "Old feedback about UI",
    user: "olduser@example.com",
    type: "General Inquiry", // New type
    status: "Archived", // New status
    date: "2024-07-01",
    description: "The old UI was a bit clunky, glad for the update!",
  },
]

export default function FeedbackSupportPage() {
  const { toast } = useToast()
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewingTicket, setViewingTicket] = useState<Ticket | null>(null)
  const [replyContent, setReplyContent] = useState("")

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.status !== "Resolved" && // Exclude resolved tickets
      ticket.status !== "Archived" && // Exclude archived tickets
      (ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleUpdateStatus = (id: string, newStatus: Ticket["status"]) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) => (ticket.id === id ? { ...ticket, status: newStatus } : ticket)),
    )
    toast({
      title: "Ticket Status Updated!",
      description: `Ticket #${id} status changed to ${newStatus}.`,
    })
  }

  const handleReply = () => {
    if (viewingTicket && replyContent.trim()) {
      // In a real app, this would send the reply to the user and update backend
      toast({
        title: "Reply Sent!",
        description: `Reply sent to ${viewingTicket.user} for ticket #${viewingTicket.id}.`,
      })
      setReplyContent("")
      setViewingTicket(null) // Close dialog after replying
    } else {
      toast({
        title: "Reply Failed",
        description: "Reply content cannot be empty.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-bold">Feedback & Support Tickets</h1>

      <Card>
        <CardHeader>
          <CardTitle>All Tickets</CardTitle>
          <CardDescription>Manage user feedback, bug reports, and support requests.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tickets..."
              className="w-full rounded-lg bg-muted pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No tickets found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-medium">{ticket.subject}</TableCell>
                    <TableCell>{ticket.user}</TableCell>
                    <TableCell>{ticket.type}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          ticket.status === "Open"
                            ? "destructive"
                            : ticket.status === "In Progress"
                              ? "secondary"
                              : "default"
                        }
                      >
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{ticket.date}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => setViewingTicket(ticket)}>
                            <MessageSquare className="h-4 w-4 mr-2" /> View & Reply
                          </DropdownMenuItem>
                          {ticket.status !== "Resolved" && ticket.status !== "Archived" && (
                            <DropdownMenuItem onClick={() => handleUpdateStatus(ticket.id, "Resolved")}>
                              <CheckCircle className="h-4 w-4 mr-2" /> Mark as Resolved
                            </DropdownMenuItem>
                          )}
                          {ticket.status !== "Archived" && ticket.status !== "Resolved" && (
                            <DropdownMenuItem onClick={() => handleUpdateStatus(ticket.id, "Archived")}>
                              <Archive className="h-4 w-4 mr-2" /> Archive
                            </DropdownMenuItem>
                          )}
                          {(ticket.status === "Resolved" || ticket.status === "Archived") && <DropdownMenuSeparator />}
                          {ticket.status !== "Resolved" &&
                            ticket.status !== "Archived" && ( // Only allow delete for non-resolved/non-archived
                              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                            )}
                          {/* Optionally, you could add a "View All Tickets" button or filter to see resolved/archived */}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {viewingTicket && (
        <Dialog open={!!viewingTicket} onOpenChange={() => setViewingTicket(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                Ticket #{viewingTicket.id}: {viewingTicket.subject}
              </DialogTitle>
              <DialogDescription>
                From: {viewingTicket.user} | Type: {viewingTicket.type}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <h3 className="font-semibold mb-2">Description:</h3>
                <p className="text-muted-foreground">{viewingTicket.description}</p>
              </div>
              {viewingTicket.adminNotes && (
                <div>
                  <h3 className="font-semibold mb-2">Admin Notes:</h3>
                  <p className="text-muted-foreground">{viewingTicket.adminNotes}</p>
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="replyContent">Reply to User</Label>
                <Textarea
                  id="replyContent"
                  placeholder="Type your reply here..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setViewingTicket(null)} variant="outline">
                Cancel
              </Button>
              <Button onClick={handleReply} className="bg-primary text-primary-foreground hover:bg-primary/90">
                Send Reply
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
