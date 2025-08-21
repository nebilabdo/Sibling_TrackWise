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

type AddChapterTestDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  courses: Course[]
  onAddChapterTest: (courseId: string, chapterId: string, chapterTestFile: File | null) => void
}

export function AddChapterTestDialog({ open, onOpenChange, courses, onAddChapterTest }: AddChapterTestDialogProps) {
  const { toast } = useToast()
  const [selectedCourseId, setSelectedCourseId] = useState("")
  const [selectedChapterId, setSelectedChapterId] = useState("")
  const [chapterTestFile, setChapterTestFile] = useState<File | null>(null)

  const selectedCourse = useMemo(() => courses.find((c) => c.id === selectedCourseId), [courses, selectedCourseId])
  const selectedChapter = useMemo(
    () => selectedCourse?.chapters?.find((ch) => ch.id === selectedChapterId),
    [selectedCourse, selectedChapterId],
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedCourseId || !selectedChapterId || !chapterTestFile) {
      toast({
        title: "Validation Error",
        description: "Please select a course and chapter, and upload a chapter test file.",
        variant: "destructive",
      })
      return
    }

    onAddChapterTest(selectedCourseId, selectedChapterId, chapterTestFile)

    // Reset form
    setSelectedCourseId("")
    setSelectedChapterId("")
    setChapterTestFile(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Chapter Test</DialogTitle>
          <DialogDescription>Upload a comprehensive test file for a specific chapter.</DialogDescription>
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
          </div>

          <div className="grid gap-2">
            <Label htmlFor="chapterTestFile">Upload Chapter Test File (CSV/JSON)</Label>
            <Input
              id="chapterTestFile"
              type="file"
              accept=".csv,.json"
              onChange={(e) => setChapterTestFile(e.target.files ? e.target.files[0] : null)}
              required
              disabled={!selectedChapter}
            />
            {chapterTestFile && <p className="text-sm text-muted-foreground">Selected: {chapterTestFile.name}</p>}
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Add Chapter Test
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
