"use client"

import type React from "react"
import { useState, useMemo } from "react"
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
import { useToast } from "@/hooks/use-toast"

type Course = {
  id: string
  title: string
  gradeLevel: string
  chapters?: {
    id: string
    title: string
    totalPages: number
  }[]
}

type AddQuizSegmentDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  courses: Course[]
  onAddQuizSegment: (
    courseId: string,
    chapterId: string,
    segmentData: { startPage: number; endPage: number; quizFile: File | null },
  ) => void
}

export function AddQuizSegmentDialog({ open, onOpenChange, courses, onAddQuizSegment }: AddQuizSegmentDialogProps) {
  const { toast } = useToast()
  const [selectedCourseId, setSelectedCourseId] = useState("")
  const [selectedChapterId, setSelectedChapterId] = useState("")
  const [startPage, setStartPage] = useState("")
  const [endPage, setEndPage] = useState("")
  const [quizFile, setQuizFile] = useState<File | null>(null)

  const selectedCourse = useMemo(() => courses.find((c) => c.id === selectedCourseId), [courses, selectedCourseId])
  const selectedChapter = useMemo(
    () => selectedCourse?.chapters?.find((ch) => ch.id === selectedChapterId),
    [selectedCourse, selectedChapterId],
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedCourseId || !selectedChapterId || !startPage || !endPage || !quizFile) {
      toast({
        title: "Validation Error",
        description: "Please select a course and chapter, fill in page range, and upload a quiz file.",
        variant: "destructive",
      })
      return
    }

    const start = Number(startPage)
    const end = Number(endPage)
    const chapterTotalPages = selectedChapter?.totalPages || 0

    if (isNaN(start) || isNaN(end) || start < 1 || end < start || end > chapterTotalPages) {
      toast({
        title: "Validation Error",
        description: `Invalid page range. Must be within 1-${chapterTotalPages} and start page must be less than end page.`,
        variant: "destructive",
      })
      return
    }

    onAddQuizSegment(selectedCourseId, selectedChapterId, {
      startPage: start,
      endPage: end,
      quizFile: quizFile,
    })

    // Reset form
    setSelectedCourseId("")
    setSelectedChapterId("")
    setStartPage("")
    setEndPage("")
    setQuizFile(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Quiz Segment to Chapter</DialogTitle>
          <DialogDescription>Define a page range and upload a quiz file for a specific chapter.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="selectCourse">Select Course</Label>
            <Select value={selectedCourseId} onValueChange={setSelectedCourseId} required>
              <SelectTrigger id="selectCourse">
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
            <Label htmlFor="selectChapter">Select Chapter</Label>
            <Select value={selectedChapterId} onValueChange={setSelectedChapterId} required disabled={!selectedCourse}>
              <SelectTrigger id="selectChapter">
                <SelectValue placeholder="Select a chapter" />
              </SelectTrigger>
              <SelectContent>
                {selectedCourse?.chapters?.length === 0 && (
                  <SelectItem value="" disabled>
                    No chapters available for this course.
                  </SelectItem>
                )}
                {selectedCourse?.chapters?.map((chapter) => (
                  <SelectItem key={chapter.id} value={chapter.id}>
                    {chapter.title} ({chapter.totalPages} pages)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedChapter && (
              <p className="text-sm text-muted-foreground">Chapter total pages: {selectedChapter.totalPages}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="startPage">Start Page</Label>
              <Input
                id="startPage"
                type="number"
                placeholder="e.g., 1"
                value={startPage}
                onChange={(e) => setStartPage(e.target.value)}
                min="1"
                required
                disabled={!selectedChapter}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="endPage">End Page</Label>
              <Input
                id="endPage"
                type="number"
                placeholder="e.g., 5"
                value={endPage}
                onChange={(e) => setEndPage(e.target.value)}
                min={Number(startPage) || 1}
                required
                disabled={!selectedChapter}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="quizFile">Upload Quiz File (CSV/JSON)</Label>
            <Input
              id="quizFile"
              type="file"
              accept=".csv,.json"
              onChange={(e) => setQuizFile(e.target.files ? e.target.files[0] : null)}
              required
              disabled={!selectedChapter}
            />
            {quizFile && <p className="text-sm text-muted-foreground">Selected: {quizFile.name}</p>}
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Add Quiz Segment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
