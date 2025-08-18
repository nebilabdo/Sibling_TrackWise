"use client"

import type React from "react"
import { useState, useEffect } from "react" // Import useEffect
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
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { PlusCircle, XCircle } from "lucide-react"

type QuizSegmentFormData = {
  id: string // Temporary ID for UI management
  startPage: string
  endPage: string
  quizFile: File | null
}

type Course = {
  id: string
  title: string
  gradeLevel: string
  subject: string
  totalPages: number
  status: "Published" | "Draft" | "Archived"
  thumbnailUrl: string
  documentUrl?: string
  quizUrl?: string
  chapters?: any[] // Simplified for now, actual type from content/page.tsx
}

type AddChapterDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  courses: Course[]
  onAddChapter: (
    courseId: string,
    chapterData: {
      title: string
      description: string
      totalPages: number
      readingFile: File | null
      quizSegments: { startPage: number; endPage: number; quizFile: File | null }[]
      postChapterText: string
      chapterTestFile: File | null
    },
  ) => void
  initialCourseId?: string | null // New prop for pre-selecting course
}

export function AddChapterDialog({
  open,
  onOpenChange,
  courses,
  onAddChapter,
  initialCourseId,
}: AddChapterDialogProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    courseId: "",
    title: "",
    description: "",
    totalPages: "",
    readingFile: null as File | null,
    quizSegments: [] as QuizSegmentFormData[], // Array for multiple quiz segments
    postChapterText: "", // New field for post-chapter text
    chapterTestFile: null as File | null, // New field for chapter test file
  })

  // Effect to set initial course ID when dialog opens with a pre-selected course
  useEffect(() => {
    if (open && initialCourseId) {
      setFormData((prev) => ({ ...prev, courseId: initialCourseId }))
    } else if (!open) {
      // Reset form when dialog closes
      setFormData({
        courseId: "",
        title: "",
        description: "",
        totalPages: "",
        readingFile: null,
        quizSegments: [],
        postChapterText: "",
        chapterTestFile: null,
      })
    }
  }, [open, initialCourseId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, files } = e.target
    if (files && files.length > 0) {
      setFormData((prev) => ({ ...prev, [id]: files[0] }))
    }
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleAddQuizSegment = () => {
    const lastSegment = formData.quizSegments[formData.quizSegments.length - 1]
    const defaultStartPage = lastSegment ? Number(lastSegment.endPage) + 1 : 1
    const defaultEndPage = defaultStartPage + 4 // Default to 5 pages per quiz

    setFormData((prev) => ({
      ...prev,
      quizSegments: [
        ...prev.quizSegments,
        {
          id: crypto.randomUUID(),
          startPage: defaultStartPage.toString(),
          endPage: defaultEndPage.toString(),
          quizFile: null,
        },
      ],
    }))
  }

  const handleRemoveQuizSegment = (idToRemove: string) => {
    setFormData((prev) => ({
      ...prev.quizSegments,
      quizSegments: prev.quizSegments.filter((segment) => segment.id !== idToRemove),
    }))
  }

  const handleQuizSegmentChange = (id: string, field: keyof QuizSegmentFormData, value: string | File | null) => {
    setFormData((prev) => ({
      ...prev,
      quizSegments: prev.quizSegments.map((segment) => (segment.id === id ? { ...segment, [field]: value } : segment)),
    }))
  }

  const handleAutoGenerateQuizzes = () => {
    const totalPages = Number(formData.totalPages)
    if (isNaN(totalPages) || totalPages <= 0) {
      toast({
        title: "Invalid Total Pages",
        description: "Please enter a valid number of total pages for the chapter first.",
        variant: "destructive",
      })
      return
    }

    const newSegments: QuizSegmentFormData[] = []
    const quizInterval = 5 // Quizzes every 5 pages
    for (let i = 1; i <= totalPages; i += quizInterval) {
      const startPage = i
      const endPage = Math.min(i + quizInterval - 1, totalPages)
      newSegments.push({
        id: crypto.randomUUID(),
        startPage: startPage.toString(),
        endPage: endPage.toString(),
        quizFile: null, // User will need to upload files for these
      })
    }
    setFormData((prev) => ({ ...prev, quizSegments: newSegments }))
    toast({
      title: "Quiz Segments Generated",
      description: `Generated segments for every ${quizInterval} pages. Please upload quiz files for each.`,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.courseId || !formData.title || !formData.totalPages || !formData.readingFile) {
      toast({
        title: "Validation Error",
        description: "Please select a course, fill in chapter title, total pages, and upload a reading file.",
        variant: "destructive",
      })
      return
    }

    // Validate quiz segments
    for (const segment of formData.quizSegments) {
      if (!segment.startPage || !segment.endPage || !segment.quizFile) {
        toast({
          title: "Validation Error",
          description: "All quiz segments must have start page, end page, and a quiz file.",
          variant: "destructive",
        })
        return
      }
      if (Number(segment.startPage) >= Number(segment.endPage)) {
        toast({
          title: "Validation Error",
          description: "Quiz segment start page must be less than end page.",
          variant: "destructive",
        })
        return
      }
      if (Number(segment.startPage) < 1 || Number(segment.endPage) > Number(formData.totalPages)) {
        toast({
          title: "Validation Error",
          description: `Quiz segment pages must be within chapter total pages (1-${formData.totalPages}).`,
          variant: "destructive",
        })
        return
      }
    }

    onAddChapter(formData.courseId, {
      title: formData.title,
      description: formData.description,
      totalPages: Number(formData.totalPages),
      readingFile: formData.readingFile,
      quizSegments: formData.quizSegments.map((segment) => ({
        startPage: Number(segment.startPage),
        endPage: Number(segment.endPage),
        quizFile: segment.quizFile,
      })),
      postChapterText: formData.postChapterText,
      chapterTestFile: formData.chapterTestFile,
    })

    // Reset form is now handled by useEffect on dialog close
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Chapter</DialogTitle>
          <DialogDescription>
            Add a new chapter to an existing course and define specific quizzes for page ranges.
            <br />
            <span className="text-xs text-muted-foreground">
              (Note: Dynamic question generation from reading material requires backend AI/NLP processing.)
            </span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="courseId">Select Course</Label>
            <Select
              value={formData.courseId}
              onValueChange={(value) => handleSelectChange("courseId", value)}
              required
              disabled={!!initialCourseId}
            >
              <SelectTrigger id="courseId">
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title} ({course.gradeLevel})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="title">Chapter Title</Label>
            <Input
              id="title"
              placeholder="Enter chapter title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the chapter"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="totalPages">Total Pages in Chapter</Label>
            <Input
              id="totalPages"
              type="number"
              placeholder="e.g., 20"
              value={formData.totalPages}
              onChange={handleChange}
              required
              min="1"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="readingFile">Upload Chapter Reading File (PDF/DOCX)</Label>
            <Input id="readingFile" type="file" accept=".pdf,.docx" onChange={handleFileChange} required />
            {formData.readingFile && (
              <p className="text-sm text-muted-foreground">Selected: {formData.readingFile.name}</p>
            )}
          </div>

          <div className="space-y-4 mt-6 p-4 border rounded-md">
            <h3 className="text-lg font-semibold">Quiz Segments</h3>
            {formData.quizSegments.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Add quiz segments to define quizzes for specific page ranges.
              </p>
            )}
            {formData.quizSegments.map((segment, index) => (
              <div
                key={segment.id}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end border-t pt-4 first:border-t-0 first:pt-0"
              >
                <div className="grid gap-2">
                  <Label htmlFor={`startPage-${segment.id}`}>Start Page</Label>
                  <Input
                    id={`startPage-${segment.id}`}
                    type="number"
                    value={segment.startPage}
                    onChange={(e) => handleQuizSegmentChange(segment.id, "startPage", e.target.value)}
                    min="1"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`endPage-${segment.id}`}>End Page</Label>
                  <Input
                    id={`endPage-${segment.id}`}
                    type="number"
                    value={segment.endPage}
                    onChange={(e) => handleQuizSegmentChange(segment.id, "endPage", e.target.value)}
                    min={Number(segment.startPage) || 1}
                    required
                  />
                </div>
                <div className="grid gap-2 col-span-2">
                  <Label htmlFor={`quizFile-${segment.id}`}>Quiz File (CSV/JSON)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id={`quizFile-${segment.id}`}
                      type="file"
                      accept=".csv,.json"
                      onChange={(e) =>
                        handleQuizSegmentChange(segment.id, "quizFile", e.target.files ? e.target.files[0] : null)
                      }
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveQuizSegment(segment.id)}
                      className="shrink-0"
                    >
                      <XCircle className="h-4 w-4 text-destructive" />
                      <span className="sr-only">Remove quiz segment</span>
                    </Button>
                  </div>
                  {segment.quizFile && (
                    <p className="text-sm text-muted-foreground">Selected: {segment.quizFile.name}</p>
                  )}
                </div>
              </div>
            ))}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleAddQuizSegment} className="mt-4 bg-transparent">
                <PlusCircle className="h-4 w-4 mr-2" /> Add Quiz Segment
              </Button>
              <Button type="button" variant="secondary" onClick={handleAutoGenerateQuizzes} className="mt-4">
                Auto-generate 5-page quizzes
              </Button>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="chapterTestFile">Upload Chapter Test File (CSV/JSON)</Label>
            <Input id="chapterTestFile" type="file" accept=".csv,.json" onChange={handleFileChange} />
            {formData.chapterTestFile && (
              <p className="text-sm text-muted-foreground">Selected: {formData.chapterTestFile.name}</p>
            )}
            <p className="text-sm text-muted-foreground">
              This file will be used as the comprehensive test for this chapter.
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="postChapterText">Post-Chapter Text (Optional)</Label>
            <Textarea
              id="postChapterText"
              placeholder="Text to display after this chapter is completed (e.g., summary, next steps, motivational message)"
              value={formData.postChapterText}
              onChange={handleChange}
              rows={3}
            />
            <p className="text-sm text-muted-foreground">
              This text will appear before the child proceeds to the next chapter.
            </p>
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Add Chapter
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
