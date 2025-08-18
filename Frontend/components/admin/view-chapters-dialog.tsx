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
import { Card, CardContent } from "@/components/ui/card"
import { Edit, Trash2, BookOpen, FileText, FileQuestion, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type QuizSegment = {
  id: string
  startPage: number
  endPage: number
  quizFileUrl?: string
}

type Chapter = {
  id: string
  title: string
  totalPages: number
  readingFileUrl?: string
  quizSegments?: QuizSegment[]
  postChapterText?: string
  chapterTestFileUrl?: string
}

type Course = {
  id: string
  title: string
  gradeLevel: string
  chapters?: Chapter[]
}

type ViewChaptersDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  course: Course | null
  onAddChapter: (courseId: string) => void
  onEditChapter: (courseId: string, chapter: Chapter) => void
  onDeleteChapter: (courseId: string, chapterId: string, chapterTitle: string) => void
}

export function ViewChaptersDialog({
  open,
  onOpenChange,
  course,
  onAddChapter,
  onEditChapter,
  onDeleteChapter,
}: ViewChaptersDialogProps) {
  if (!course) return null

  const handleAddChapterClick = () => {
    onAddChapter(course.id)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[95vw] lg:max-w-[1200px] max-h-[90vh] overflow-hidden rounded-2xl p-0 shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50">
        <div className="flex flex-col h-full max-h-[90vh]">
          {/* Header */}
          <DialogHeader className="px-6 py-6 bg-gradient-to-r from-gray-700 to-gray-900 text-white">
            <DialogTitle className="text-2xl md:text-3xl font-bold">Chapters for "{course.title}"</DialogTitle>
            <DialogDescription className="text-gray-200 text-base">
              Manage individual chapters, their reading files, quizzes, and tests.
            </DialogDescription>
          </DialogHeader>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {/* Add Chapter Button */}
            <div className="flex justify-center md:justify-end mb-6">
              <Button
                onClick={handleAddChapterClick}
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-8 py-3 text-base font-semibold"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add New Chapter
              </Button>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block">
              <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-lg bg-white">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200">
                      <TableHead className="px-6 py-4 text-sm font-bold text-gray-700">Chapter Title</TableHead>
                      <TableHead className="px-6 py-4 text-sm font-bold text-gray-700 text-center">Pages</TableHead>
                      <TableHead className="px-6 py-4 text-sm font-bold text-gray-700 text-center">
                        Reading File
                      </TableHead>
                      <TableHead className="px-6 py-4 text-sm font-bold text-gray-700 text-center">
                        Quiz Segments
                      </TableHead>
                      <TableHead className="px-6 py-4 text-sm font-bold text-gray-700 text-center">
                        Chapter Test
                      </TableHead>
                      <TableHead className="px-6 py-4 text-sm font-bold text-gray-700 text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {course.chapters && course.chapters.length > 0 ? (
                      course.chapters.map((chapter, index) => (
                        <TableRow
                          key={chapter.id}
                          className={`hover:bg-gray-50/50 transition-all duration-200 ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                          }`}
                        >
                          <TableCell className="px-6 py-4">
                            <div>
                              <p className="font-semibold text-gray-800 text-base">{chapter.title}</p>
                              {chapter.postChapterText && (
                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                  Post-chapter: {chapter.postChapterText}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4 text-center">
                            <Badge
                              variant="outline"
                              className="rounded-full bg-gray-50 text-gray-700 border-gray-200 font-semibold"
                            >
                              {chapter.totalPages}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-6 py-4 text-center">
                            {chapter.readingFileUrl ? (
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border-green-200 text-green-700 hover:text-green-800 rounded-xl px-4 py-2 shadow-sm"
                              >
                                <FileText className="h-3 w-3 mr-2" />
                                Available
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border-gray-200 text-gray-600 rounded-xl px-4 py-2"
                                disabled
                              >
                                Missing
                              </Button>
                            )}
                          </TableCell>
                          <TableCell className="px-6 py-4 text-center">
                            {chapter.quizSegments && chapter.quizSegments.length > 0 ? (
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 border-orange-200 text-orange-700 hover:text-orange-800 rounded-xl px-4 py-2 shadow-sm min-w-[100px]"
                              >
                                <FileQuestion className="h-3 w-3 mr-2" />
                                {chapter.quizSegments.length} Segments
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border-gray-200 text-gray-600 rounded-xl px-4 py-2"
                                disabled
                              >
                                None
                              </Button>
                            )}
                          </TableCell>
                          <TableCell className="px-6 py-4 text-center">
                            {chapter.chapterTestFileUrl ? (
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border-purple-200 text-purple-700 hover:text-purple-800 rounded-xl px-4 py-2 shadow-sm"
                              >
                                <FileQuestion className="h-3 w-3 mr-2" />
                                Available
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border-gray-200 text-gray-600 rounded-xl px-4 py-2"
                                disabled
                              >
                                Missing
                              </Button>
                            )}
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <div className="flex items-center justify-center gap-3">
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border-gray-200 text-gray-700 hover:text-gray-800 transition-all duration-200 rounded-xl px-4 py-2"
                                onClick={() => onEditChapter(course.id, chapter)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => onDeleteChapter(course.id, chapter.id, chapter.title)}
                                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-sm rounded-xl px-4 py-2"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-16">
                          <div className="flex flex-col items-center gap-4">
                            <BookOpen className="h-16 w-16 text-gray-300" />
                            <div>
                              <p className="text-xl font-semibold text-gray-600 mb-2">No chapters found</p>
                              <p className="text-gray-500">Start by adding your first chapter to this course</p>
                            </div>
                            <Button
                              onClick={handleAddChapterClick}
                              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl px-6 py-2 mt-2"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add First Chapter
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden space-y-4">
              {course.chapters && course.chapters.length > 0 ? (
                course.chapters.map((chapter) => (
                  <Card
                    key={chapter.id}
                    className="rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 bg-white"
                  >
                    <CardContent className="p-6">
                      {/* Chapter Header */}
                      <div className="mb-4">
                        <h3 className="font-bold text-lg text-gray-800 mb-2">{chapter.title}</h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="rounded-full bg-gray-50 text-gray-700 border-gray-200">
                            {chapter.totalPages} pages
                          </Badge>
                        </div>
                      </div>

                      {/* Status Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        <div className="text-center">
                          <p className="text-xs font-medium text-gray-500 mb-2">Reading File</p>
                          {chapter.readingFileUrl ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border-green-200 text-green-700 hover:text-green-800 rounded-xl px-3 py-2 text-xs"
                            >
                              <FileText className="h-3 w-3 mr-1" />
                              Available
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 text-gray-600 rounded-xl px-3 py-2 text-xs"
                              disabled
                            >
                              Missing
                            </Button>
                          )}
                        </div>

                        <div className="text-center">
                          <p className="text-xs font-medium text-gray-500 mb-2">Quiz Segments</p>
                          {chapter.quizSegments && chapter.quizSegments.length > 0 ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 border-orange-200 text-orange-700 hover:text-orange-800 rounded-xl px-3 py-2 text-xs"
                            >
                              <FileQuestion className="h-3 w-3 mr-1" />
                              {chapter.quizSegments.length} Segments
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 text-gray-600 rounded-xl px-3 py-2 text-xs"
                              disabled
                            >
                              None
                            </Button>
                          )}
                        </div>

                        <div className="text-center">
                          <p className="text-xs font-medium text-gray-500 mb-2">Chapter Test</p>
                          {chapter.chapterTestFileUrl ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border-purple-200 text-purple-700 hover:text-purple-800 rounded-xl px-3 py-2 text-xs"
                            >
                              <FileQuestion className="h-3 w-3 mr-1" />
                              Available
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 text-gray-600 rounded-xl px-3 py-2 text-xs"
                              disabled
                            >
                              Missing
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Post Chapter Text */}
                      {chapter.postChapterText && (
                        <div className="mb-4 p-3 bg-orange-50 rounded-xl">
                          <p className="text-xs font-medium text-orange-800 mb-1">Post-Chapter Message:</p>
                          <p className="text-sm text-orange-700 italic line-clamp-2">"{chapter.postChapterText}"</p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border-gray-200 text-gray-700 hover:text-gray-800 transition-all duration-200 rounded-xl py-3"
                          onClick={() => onEditChapter(course.id, chapter)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Chapter
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onDeleteChapter(course.id, chapter.id, chapter.title)}
                          className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-sm rounded-xl py-3"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Chapter
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-16">
                  <BookOpen className="h-20 w-20 text-gray-300 mx-auto mb-6" />
                  <div className="mb-6">
                    <p className="text-xl font-semibold text-gray-600 mb-2">No chapters found</p>
                    <p className="text-gray-500">Start by adding your first chapter to this course</p>
                  </div>
                  <Button
                    onClick={handleAddChapterClick}
                    size="lg"
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl px-8 py-3"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add First Chapter
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="rounded-xl px-6 py-2 hover:bg-gray-100 transition-colors"
            >
              Close
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
