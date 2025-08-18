"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

type AddCourseFormProps = {
  onAddCourse: (courseData: {
    title: string
    gradeLevel: string
    description: string
  }) => void
}

export function AddCourseForm({ onAddCourse }: AddCourseFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    title: "",
    gradeLevel: "",
    description: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Basic validation
    if (!formData.title || !formData.gradeLevel || !formData.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    onAddCourse(formData)

    // Reset form
    setFormData({
      title: "",
      gradeLevel: "",
      description: "",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="title">Course Title (e.g., "Introduction to Algebra")</Label>
        <Input id="title" placeholder="Enter course title" value={formData.title} onChange={handleChange} required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="gradeLevel">Grade Level</Label>
        <Select value={formData.gradeLevel} onValueChange={(value) => handleSelectChange("gradeLevel", value)} required>
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
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Provide a brief description of the course"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
        Add Course
      </Button>
    </form>
  )
}
