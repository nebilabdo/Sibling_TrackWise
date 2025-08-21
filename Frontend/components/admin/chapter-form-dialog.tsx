"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
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
  quizFileUrl?: string // For existing files
}

type Chapter = {
  id: string
  title: string
  description?: string
  totalPages: number
  readingFileUrl?: string
  quizSegments?: { id: string; startPage: number; endPage: number; quizFileUrl?: string }[]
  postChapterText?: string
  chapterTestFileUrl?: string
}

type Course = {
  id: string
  title: string
  gradeLevel: string
  chapters?: Chapter[]
}

type ChapterFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  courses: Course[]
  onSaveChapter: (
    courseId: string,
    chapterData: {
      id?: string // Optional for new chapters
      title: string
      description: string
      totalPages: number
      readingFile: File | null
      quizSegments: { startPage: number; endPage: number; quizFile: File | null }[]
      postChapterText: string
      chapterTestFile: File | null
    },
  ) => void
  initialCourseId?: string | null // For pre-selecting course when adding
  initialChapterData?: Chapter | null // For editing existing chapter
}

export function ChapterFormDialog({
  open,
  onOpenChange,
  courses,
  onSaveChapter,
  initialCourseId,
  initialChapterData,
}: ChapterFormDialogProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    id: initialChapterData?.id || "",
    courseId: initialCourseId || "",
    title: initialChapterData?.title || "",
    description: initialChapterData?.description || "",
    totalPages: initialChapterData?.totalPages.toString() || "",
    readingFile: null as File | null,
    quizSegments: (initialChapterData?.quizSegments || []).map((s) => ({
      ...s,
      id: s.id || crypto.randomUUID(),
      startPage: s.startPage.toString(),
      endPage: s.endPage.toString(),
      quizFile: null,
    })) as QuizSegmentFormData[],
    postChapterText: initialChapterData?.postChapterText || "",
    chapterTestFile: null as File | null,
  })

  // Store original file URLs for display
  const [originalReadingFileUrl, setOriginalReadingFileUrl] = useState(initialChapterData?.readingFileUrl || "")
  const [originalChapterTestFileUrl, setOriginalChapterTestFileUrl] = useState(
    initialChapterData?.chapterTestFileUrl || "",
  )
  const [originalQuizSegmentFileUrls, setOriginalQuizSegmentFileUrls] = useState<Record<string, string>>(
    initialChapterData?.quizSegments?.reduce((acc, s) => {
      if (s.quizFileUrl) acc[s.id] = s.quizFileUrl
      return acc
    }, {}) || {},
  )

  useEffect(() => {
    if (open) {
      setFormData({
        id: initialChapterData?.id || "",
        courseId: initialCourseId || initialChapterData?.id.split("-ch")[0] || "", // Derive courseId if editing
        title: initialChapterData?.title || "",
        description: initialChapterData?.description || "",
        totalPages: initialChapterData?.totalPages.toString() || "",
        readingFile: null, // Reset file input
        quizSegments: (initialChapterData?.quizSegments || []).map((s) => ({
          ...s,
          id: s.id || crypto.randomUUID(),
          startPage: s.startPage.toString(),
          endPage: s.endPage.toString(),
          quizFile: null, // Reset file input
        })) as QuizSegmentFormData[],
        postChapterText: initialChapterData?.postChapterText || "",
        chapterTestFile: null, // Reset file input
      })
      setOriginalReadingFileUrl(initialChapterData?.readingFileUrl || "")
      setOriginalChapterTestFileUrl(initialChapterData?.chapterTestFileUrl || "")
      setOriginalQuizSegmentFileUrls(
        initialChapterData?.quizSegments?.reduce((acc, s) => {
          if (s.quizFileUrl) acc[s.id] = s.quizFileUrl
          return acc
        }, {}) || {},
      )
    } else {
      // Reset form completely when dialog closes
      setFormData({
        id: "",
        courseId: "",
        title: "",
        description: "",
        totalPages: "",
        readingFile: null,
        quizSegments: [],
        postChapterText: "",
        chapterTestFile: null,
      })
      setOriginalReadingFileUrl("")
      setOriginalChapterTestFileUrl("")
      setOriginalQuizSegmentFileUrls({})
    }
  }, [open, initialCourseId, initialChapterData])

  const isEditing = useMemo(() => !!initialChapterData, [initialChapterData])

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
      ...prev,
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
    if (!formData.courseId || !formData.title || !formData.totalPages) {
      toast({
        title: "Validation Error",
        description: "Please select a course, fill in chapter title, and total pages.",
        variant: "destructive",
      })
      return
    }

    if (!isEditing && !formData.readingFile) {
      toast({
        title: "Validation Error",
        description: "Please upload a reading file for new chapters.",
        variant: "destructive",
      })
      return
    }

    // Validate quiz segments
    for (const segment of formData.quizSegments) {
      if (!segment.startPage || !segment.endPage) {
        toast({
          title: "Validation Error",
          description: "All quiz segments must have start page and end page.",
          variant: "destructive",
        })
        return
      }
      if (!segment.quizFile && !originalQuizSegmentFileUrls[segment.id]) {
        toast({
          title: "Validation Error",
          description: "All quiz segments must have a quiz file uploaded or an existing one.",
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

    onSaveChapter(formData.courseId, {
      id: formData.id, // Pass ID for editing
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

    onOpenChange(false) // Close dialog on successful submission
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Chapter" : "Add New Chapter"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? `Edit details for "${initialChapterData?.title}".`
              : "Add a new chapter to an existing course and define specific quizzes for page ranges."}
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
              disabled={!!initialCourseId || isEditing} // Disable if pre-selected or editing
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
            <Input id="readingFile" type="file" accept=".pdf,.docx" onChange={handleFileChange} required={!isEditing} />
            {formData.readingFile && (
              <p className="text-sm text-muted-foreground">Selected: {formData.readingFile.name}</p>
            )}
            {!formData.readingFile && originalReadingFileUrl && (
              <p className="text-sm text-muted-foreground">Current: {originalReadingFileUrl.split("/").pop()}</p>
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
                      required={!originalQuizSegmentFileUrls[segment.id]}
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
                  {!segment.quizFile && originalQuizSegmentFileUrls[segment.id] && (
                    <p className="text-sm text-muted-foreground">
                      Current: {originalQuizSegmentFileUrls[segment.id].split("/").pop()}
                    </p>
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
            {!formData.chapterTestFile && originalChapterTestFileUrl && (
              <p className="text-sm text-muted-foreground">Current: {originalChapterTestFileUrl.split("/").pop()}</p>
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
              {isEditing ? "Save Changes" : "Add Chapter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
