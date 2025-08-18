"use client"

import type React from "react"
import { useState } from "react"
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
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

type Course = {
  id: string
  title: string
  thumbnailUrl: string
  documentUrl?: string
}

type ReplaceCourseFilesDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  course: Course | null
  onReplaceFiles: (courseId: string, newFiles: { documentFile: File | null; thumbnailFile: File | null }) => void
}

export function ReplaceCourseFilesDialog({
  open,
  onOpenChange,
  course,
  onReplaceFiles,
}: ReplaceCourseFilesDialogProps) {
  const { toast } = useToast()
  const [documentFile, setDocumentFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!course) return

    if (!documentFile && !thumbnailFile) {
      toast({
        title: "No Files Selected",
        description: "Please select at least one file to replace.",
        variant: "destructive",
      })
      return
    }

    onReplaceFiles(course.id, { documentFile, thumbnailFile })
    setDocumentFile(null)
    setThumbnailFile(null)
    onOpenChange(false)
  }

  if (!course) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Replace Files for &quot;{course.title}&quot;</DialogTitle>
          <DialogDescription>Upload new main reading document or thumbnail image for this course.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="documentFile">New Main Reading Document (PDF/DOCX)</Label>
            <Input
              id="documentFile"
              type="file"
              accept=".pdf,.docx"
              onChange={(e) => setDocumentFile(e.target.files ? e.target.files[0] : null)}
            />
            {documentFile && <p className="text-sm text-muted-foreground">Selected: {documentFile.name}</p>}
            {course.documentUrl && !documentFile && (
              <p className="text-xs text-muted-foreground">Current: {course.documentUrl.split("/").pop()}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="thumbnailFile">New Thumbnail Image</Label>
            <Input
              id="thumbnailFile"
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnailFile(e.target.files ? e.target.files[0] : null)}
            />
            {thumbnailFile && <p className="text-sm text-muted-foreground">Selected: {thumbnailFile.name}</p>}
            {course.thumbnailUrl && !thumbnailFile && (
              <p className="text-xs text-muted-foreground">Current: {course.thumbnailUrl.split("/").pop()}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Upload & Replace
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
