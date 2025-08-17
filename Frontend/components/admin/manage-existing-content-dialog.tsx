"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, FileUp } from "lucide-react"
import Image from "next/image"

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
  chapters?: any[]
}

type ManageExistingContentDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  courses: Course[]
  onEditCourse: (course: Course) => void
  onReplaceFiles: (course: Course) => void
}

export function ManageExistingContentDialog({
  open,
  onOpenChange,
  courses,
  onEditCourse,
  onReplaceFiles,
}: ManageExistingContentDialogProps) {
  const handleEditClick = (course: Course) => {
    onEditCourse(course)
    onOpenChange(false) // Close this dialog
  }

  const handleReplaceFilesClick = (course: Course) => {
    onReplaceFiles(course)
    onOpenChange(false) // Close this dialog
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Existing Content</DialogTitle>
          <DialogDescription>Select a course to edit its metadata or replace its files.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Thumbnail</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No courses available to manage.
                  </TableCell>
                </TableRow>
              ) : (
                courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <Image
                        src={course.thumbnailUrl || "/placeholder.svg"}
                        width={48}
                        height={48}
                        alt={`${course.title} thumbnail`}
                        className="aspect-square rounded-md object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{course.title}</TableCell>
                    <TableCell>{course.gradeLevel}</TableCell>
                    <TableCell>{course.subject}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-2 bg-transparent"
                        onClick={() => handleEditClick(course)}
                      >
                        <Edit className="h-4 w-4 mr-2" /> Edit Metadata
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleReplaceFilesClick(course)}>
                        <FileUp className="h-4 w-4 mr-2" /> Replace Files
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
