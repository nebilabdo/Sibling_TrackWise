"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

type Course = {
  id: string
  title: string
  gradeLevel: string
  subject: string
  totalPages: number
  status: "Published" | "Draft" | "Archived"
  thumbnailUrl: string
  documentUrl?: string
  chapters?: any[]
}

type EditCourseMetadataDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  course: Course | null
  onSave: (updatedCourse: Course) => void
}

export function EditCourseMetadataDialog({ open, onOpenChange, course, onSave }: EditCourseMetadataDialogProps) {
  const [formData, setFormData] = useState<Course | null>(course)

  useEffect(() => {
    setFormData(course)
  }, [course])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => (prev ? { ...prev, [id]: value } : null))
  }

  const handleSelectChange = (id: keyof Course, value: string) => {
    setFormData((prev) => (prev ? { ...prev, [id]: value } : null))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData) {
      onSave(formData)
      onOpenChange(false)
    }
  }

  if (!formData) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Course Metadata</DialogTitle>
          <DialogDescription>Make changes to &quot;{formData.title}&quot; details.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Course Title</Label>
            <Input id="title" value={formData.title} onChange={handleChange} required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="gradeLevel">Grade Level</Label>
            <Select
              value={formData.gradeLevel}
              onValueChange={(value) => handleSelectChange("gradeLevel", value)}
              required
            >
              <SelectTrigger id="gradeLevel">
                <SelectValue placeholder="Select grade level" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 8 }, (_, i) => (
                  <SelectItem key={i + 1} value={`Grade ${i + 1}`}>
                    Grade {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="subject">Subject</Label>
            <Select value={formData.subject} onValueChange={(value) => handleSelectChange("subject", value)} required>
              <SelectTrigger id="subject">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Math">Math</SelectItem>
                <SelectItem value="Science">Science</SelectItem>
                <SelectItem value="History">History</SelectItem>
                <SelectItem value="Art">Art</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="totalPages">Total Pages (Auto-calculated from chapters)</Label>
            <Input
              id="totalPages"
              type="number"
              value={formData.totalPages}
              onChange={(e) => setFormData((prev) => (prev ? { ...prev, totalPages: Number(e.target.value) } : null))}
              disabled // This should ideally be auto-calculated from chapters
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "Published" | "Draft" | "Archived") => handleSelectChange("status", value)}
              required
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Published">Published</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
