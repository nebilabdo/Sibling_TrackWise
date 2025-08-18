"use client"

import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import {
  MoreHorizontal,
  Search,
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  BookOpen,
  GraduationCap,
  Calendar,
  FileText,
  ChevronRight,
  ChevronDown,
  Users,
  Award,
  Target,
  XCircle,
  Filter,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Types
type QuizSegment = {
  id: string
  startPage: number
  endPage: number
  quizFileUrl?: string
  quizFileName?: string
}

type Chapter = {
  id: string
  title: string
  description?: string
  totalPages: number
  readingFileUrl?: string
  readingFileName?: string
  quizSegments?: QuizSegment[]
  chapterTestFileUrl?: string
  chapterTestFileName?: string
  postChapterText?: string
  semester: 1 | 2
}

type Subject = {
  id: string
  title: string
  name: string
  description?: string
  status: "Published" | "Draft" | "Archived"
  thumbnailUrl: string
  chapters?: Chapter[]
  gradeId: string
}

type MixedExam = {
  id: string
  title: string
  type: "semester1" | "semester2" | "final"
  examFileUrl?: string
  examFileName?: string
  duration: number // in minutes
  totalMarks: number
  gradeId: string
  subjectIds: string[] // subjects included in this exam
}

type ChapterExam = {
  id: string
  title: string
  chapterId: string
  subjectId: string
  gradeId: string
  examFileUrl?: string
  examFileName?: string
  duration: number
  totalMarks: number
}

type Grade = {
  id: string
  level: string
  title: string
  description?: string
  status: "Active" | "Inactive"
  totalSubjects: number
  totalStudents: number
}

type QuizFormData = {
  id: string
  startPage: string
  endPage: string
  quizFile: File | null
}

const initialGrades: Grade[] = [
  {
    id: "g1",
    level: "Grade 1",
    title: "Grade 1",
    description: "Foundation level learning",
    status: "Active",
    totalSubjects: 5,
    totalStudents: 120,
  },
  {
    id: "g2",
    level: "Grade 2",
    title: "Grade 2",
    description: "Basic skills development",
    status: "Active",
    totalSubjects: 6,
    totalStudents: 115,
  },
  {
    id: "g3",
    level: "Grade 3",
    title: "Grade 3",
    description: "Intermediate foundation",
    status: "Active",
    totalSubjects: 7,
    totalStudents: 108,
  },
]

const initialSubjects: Subject[] = [
  {
    id: "s1",
    title: "Mathematics",
    name: "Mathematics",
    description: "Basic arithmetic and number concepts",
    status: "Published",
    thumbnailUrl: "/placeholder.svg?height=64&width=64",
    gradeId: "g1",
    chapters: [
      {
        id: "s1-ch1",
        title: "Numbers 1-10",
        totalPages: 20,
        semester: 1,
        readingFileUrl: "https://example.com/math-ch1.pdf",
        readingFileName: "numbers-1-10.pdf",
        quizSegments: [
          { id: "s1-ch1-q1", startPage: 1, endPage: 5, quizFileName: "quiz-1-5.pdf" },
          { id: "s1-ch1-q2", startPage: 6, endPage: 10, quizFileName: "quiz-6-10.pdf" },
          { id: "s1-ch1-q3", startPage: 11, endPage: 15, quizFileName: "quiz-11-15.pdf" },
          { id: "s1-ch1-q4", startPage: 16, endPage: 20, quizFileName: "quiz-16-20.pdf" },
        ],
        chapterTestFileUrl: "https://example.com/math-ch1-test.pdf",
        chapterTestFileName: "numbers-chapter-test.pdf",
      },
      {
        id: "s1-ch2",
        title: "Basic Addition",
        totalPages: 25,
        semester: 1,
        readingFileUrl: "https://example.com/math-ch2.pdf",
        readingFileName: "basic-addition.pdf",
        quizSegments: [
          { id: "s1-ch2-q1", startPage: 1, endPage: 5, quizFileName: "addition-quiz-1-5.pdf" },
          { id: "s1-ch2-q2", startPage: 6, endPage: 10, quizFileName: "addition-quiz-6-10.pdf" },
          { id: "s1-ch2-q3", startPage: 11, endPage: 15, quizFileName: "addition-quiz-11-15.pdf" },
          { id: "s1-ch2-q4", startPage: 16, endPage: 20, quizFileName: "addition-quiz-16-20.pdf" },
          { id: "s1-ch2-q5", startPage: 21, endPage: 25, quizFileName: "addition-quiz-21-25.pdf" },
        ],
        chapterTestFileUrl: "https://example.com/math-ch2-test.pdf",
        chapterTestFileName: "addition-chapter-test.pdf",
      },
    ],
  },
  {
    id: "s2",
    title: "English Language Arts",
    name: "English",
    description: "Reading, writing and communication skills",
    status: "Published",
    thumbnailUrl: "/placeholder.svg?height=64&width=64",
    gradeId: "g1",
  },
]

const initialMixedExams: MixedExam[] = [
  {
    id: "me1",
    title: "Grade 1 - Semester 1 Mixed Exam",
    type: "semester1",
    gradeId: "g1",
    subjectIds: ["s1", "s2"],
    duration: 60,
    totalMarks: 100,
    examFileUrl: "https://example.com/g1-s1-mixed.pdf",
    examFileName: "grade1-semester1-mixed.pdf",
  },
  {
    id: "me2",
    title: "Grade 1 - Semester 2 Mixed Exam",
    type: "semester2",
    gradeId: "g1",
    subjectIds: ["s1", "s2"],
    duration: 60,
    totalMarks: 100,
  },
  {
    id: "me3",
    title: "Grade 1 - Final Mixed Exam",
    type: "final",
    gradeId: "g1",
    subjectIds: ["s1", "s2"],
    duration: 90,
    totalMarks: 150,
  },
]

const initialChapterExams: ChapterExam[] = [
  {
    id: "ce1",
    title: "Numbers 1-10 Chapter Exam",
    chapterId: "s1-ch1",
    subjectId: "s1",
    gradeId: "g1",
    duration: 30,
    totalMarks: 50,
    examFileUrl: "https://example.com/ch1-exam.pdf",
    examFileName: "numbers-chapter-exam.pdf",
  },
]

export default function ContentManagerPage() {
  const { toast } = useToast()

  // State management
  const [grades, setGrades] = useState<Grade[]>(initialGrades)
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects)
  const [mixedExams, setMixedExams] = useState<MixedExam[]>(initialMixedExams)
  const [chapterExams, setChapterExams] = useState<ChapterExam[]>(initialChapterExams)

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGrade, setSelectedGrade] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("overview")
  const [expandedGrades, setExpandedGrades] = useState<Set<string>>(new Set())
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set())

  // Dialog states
  const [showAddGradeDialog, setShowAddGradeDialog] = useState(false)
  const [showAddSubjectDialog, setShowAddSubjectDialog] = useState(false)
  const [showAddChapterDialog, setShowAddChapterDialog] = useState(false)
  const [showEditChapterDialog, setShowEditChapterDialog] = useState(false)
  const [showEditQuizDialog, setShowEditQuizDialog] = useState(false)
  const [showEditChapterTestDialog, setShowEditChapterTestDialog] = useState(false)
  const [showAddMixedExamDialog, setShowAddMixedExamDialog] = useState(false)
  const [showEditMixedExamDialog, setShowEditMixedExamDialog] = useState(false)
  const [showAddChapterExamDialog, setShowAddChapterExamDialog] = useState(false)

  const [editingGrade, setEditingGrade] = useState<Grade | null>(null)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null)
  const [editingQuiz, setEditingQuiz] = useState<QuizSegment | null>(null)
  const [editingChapterTest, setEditingChapterTest] = useState<Chapter | null>(null)
  const [editingMixedExam, setEditingMixedExam] = useState<MixedExam | null>(null)
  const [selectedGradeForSubject, setSelectedGradeForSubject] = useState<string>("")
  const [selectedSubjectForChapter, setSelectedSubjectForChapter] = useState<string>("")
  const [selectedChapterForQuiz, setSelectedChapterForQuiz] = useState<string>("")

  // Form states
  const [gradeForm, setGradeForm] = useState({
    level: "",
    title: "",
    description: "",
  })

  const [subjectForm, setSubjectForm] = useState({
    title: "",
    name: "",
    description: "",
    gradeId: "",
  })

  const [chapterForm, setChapterForm] = useState({
    title: "",
    description: "",
    totalPages: "",
    semester: "1" as "1" | "2",
    subjectName: "",
    gradeId: "",
    readingFile: null as File | null,
    chapterTestFile: null as File | null,
    postChapterText: "",
    quizSegments: [] as QuizFormData[],
  })

  const [editChapterForm, setEditChapterForm] = useState({
    id: "",
    title: "",
    description: "",
    totalPages: "",
    semester: "1" as "1" | "2",
    subjectId: "",
    readingFile: null as File | null,
    chapterTestFile: null as File | null,
    postChapterText: "",
    currentReadingFileName: "",
    currentChapterTestFileName: "",
  })

  const [editQuizForm, setEditQuizForm] = useState({
    id: "",
    startPage: "",
    endPage: "",
    quizFile: null as File | null,
    currentQuizFileName: "",
    chapterId: "",
    subjectId: "",
  })

  const [editChapterTestForm, setEditChapterTestForm] = useState({
    chapterId: "",
    subjectId: "",
    chapterTestFile: null as File | null,
    currentChapterTestFileName: "",
  })

  const [mixedExamForm, setMixedExamForm] = useState({
    title: "",
    type: "semester1" as "semester1" | "semester2" | "final",
    gradeId: "",
    subjectIds: [] as string[],
    duration: "",
    totalMarks: "",
    examFile: null as File | null,
  })

  const [editMixedExamForm, setEditMixedExamForm] = useState({
    id: "",
    title: "",
    type: "semester1" as "semester1" | "semester2" | "final",
    gradeId: "",
    subjectIds: [] as string[],
    duration: "",
    totalMarks: "",
    examFile: null as File | null,
    currentExamFileName: "",
  })

  const [chapterExamForm, setChapterExamForm] = useState({
    title: "",
    gradeId: "",
    subjectId: "",
    chapterId: "",
    duration: "",
    totalMarks: "",
    examFile: null as File | null,
  })

  // Helper functions
  const toggleGradeExpansion = (gradeId: string) => {
    const newExpanded = new Set(expandedGrades)
    if (newExpanded.has(gradeId)) {
      newExpanded.delete(gradeId)
    } else {
      newExpanded.add(gradeId)
    }
    setExpandedGrades(newExpanded)
  }

  const toggleSubjectExpansion = (subjectId: string) => {
    const newExpanded = new Set(expandedSubjects)
    if (newExpanded.has(subjectId)) {
      newExpanded.delete(subjectId)
    } else {
      newExpanded.add(subjectId)
    }
    setExpandedSubjects(newExpanded)
  }

  const getSubjectsForGrade = (gradeId: string) => {
    return subjects.filter((subject) => subject.gradeId === gradeId)
  }

  const getChaptersForSubject = (subjectId: string) => {
    const subject = subjects.find((s) => s.id === subjectId)
    return subject?.chapters || []
  }

  const getMixedExamsForGrade = (gradeId: string) => {
    return mixedExams.filter((exam) => exam.gradeId === gradeId)
  }

  const getChapterExamsForGrade = (gradeId: string) => {
    return chapterExams.filter((exam) => exam.gradeId === gradeId)
  }

  // Quiz management functions
  const addQuizSegment = () => {
    const newQuiz: QuizFormData = {
      id: crypto.randomUUID(),
      startPage: "",
      endPage: "",
      quizFile: null,
    }
    setChapterForm({
      ...chapterForm,
      quizSegments: [...chapterForm.quizSegments, newQuiz],
    })
  }

  const removeQuizSegment = (quizId: string) => {
    setChapterForm({
      ...chapterForm,
      quizSegments: chapterForm.quizSegments.filter((quiz) => quiz.id !== quizId),
    })
  }

  const updateQuizSegment = (quizId: string, field: keyof QuizFormData, value: string | File | null) => {
    setChapterForm({
      ...chapterForm,
      quizSegments: chapterForm.quizSegments.map((quiz) => (quiz.id === quizId ? { ...quiz, [field]: value } : quiz)),
    })
  }

  // CRUD Operations for Grades
  const handleAddGrade = () => {
    if (!gradeForm.level || !gradeForm.title) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (editingGrade) {
      // Update existing grade
      setGrades(
        grades.map((grade) =>
          grade.id === editingGrade.id
            ? {
                ...grade,
                level: gradeForm.level,
                title: gradeForm.title,
                description: gradeForm.description,
              }
            : grade,
        ),
      )
      toast({
        title: "Grade Updated!",
        description: `${gradeForm.title} has been successfully updated.`,
      })
      setEditingGrade(null)
    } else {
      // Add new grade
      const newGrade: Grade = {
        id: `g${Date.now()}`,
        level: gradeForm.level,
        title: gradeForm.title,
        description: gradeForm.description,
        status: "Active",
        totalSubjects: 0,
        totalStudents: 0,
      }
      setGrades([...grades, newGrade])
      toast({
        title: "Grade Added!",
        description: `${newGrade.title} has been successfully added.`,
      })
    }

    setGradeForm({ level: "", title: "", description: "" })
    setShowAddGradeDialog(false)
  }

  const handleEditGrade = (grade: Grade) => {
    setEditingGrade(grade)
    setGradeForm({
      level: grade.level,
      title: grade.title,
      description: grade.description || "",
    })
    setShowAddGradeDialog(true)
  }

  const handleDeleteGrade = (gradeId: string, gradeTitle: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${gradeTitle}? This will also delete all associated subjects and chapters.`,
      )
    ) {
      setGrades(grades.filter((g) => g.id !== gradeId))
      setSubjects(subjects.filter((s) => s.gradeId !== gradeId))
      setMixedExams(mixedExams.filter((e) => e.gradeId !== gradeId))
      setChapterExams(chapterExams.filter((e) => e.gradeId !== gradeId))

      toast({
        title: "Grade Deleted!",
        description: `${gradeTitle} and all associated content has been removed.`,
        variant: "destructive",
      })
    }
  }

  // CRUD Operations for Subjects
  const handleAddSubject = () => {
    if (!subjectForm.title || !subjectForm.name || !subjectForm.gradeId) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      if (editingSubject) {
        // Update existing subject
        setSubjects(
          subjects.map((subject) =>
            subject.id === editingSubject.id
              ? {
                  ...subject,
                  title: subjectForm.title,
                  name: subjectForm.name,
                  description: subjectForm.description,
                  gradeId: subjectForm.gradeId,
                }
              : subject,
          ),
        )
        toast({
          title: "Subject Updated!",
          description: `${subjectForm.title} has been successfully updated.`,
        })
        setEditingSubject(null)
      } else {
        // Add new subject
        const newSubject: Subject = {
          id: `s${Date.now()}`,
          title: subjectForm.title,
          name: subjectForm.name,
          description: subjectForm.description,
          status: "Draft",
          thumbnailUrl: "/placeholder.svg?height=64&width=64",
          gradeId: subjectForm.gradeId,
          chapters: [],
        }
        setSubjects([...subjects, newSubject])
        toast({
          title: "Subject Added!",
          description: `${newSubject.title} has been successfully added.`,
        })
      }

      setSubjectForm({ title: "", name: "", description: "", gradeId: "" })
      setSelectedGradeForSubject("")
      setShowAddSubjectDialog(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while adding the subject. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditSubject = (subject: Subject) => {
    setEditingSubject(subject)
    setSubjectForm({
      title: subject.title,
      name: subject.name,
      description: subject.description || "",
      gradeId: subject.gradeId,
    })
    setShowAddSubjectDialog(true)
  }

  const handleDeleteSubject = (subjectId: string, subjectTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${subjectTitle}"? This will also delete all chapters.`)) {
      setSubjects(subjects.filter((s) => s.id !== subjectId))
      setChapterExams(chapterExams.filter((e) => e.subjectId !== subjectId))

      toast({
        title: "Subject Deleted!",
        description: `"${subjectTitle}" and all chapters have been removed.`,
        variant: "destructive",
      })
    }
  }

  // CRUD Operations for Chapters - FIXED VERSION
  const handleAddChapter = () => {
    console.log("Add Chapter button clicked")
    console.log("Chapter form data:", chapterForm)

    // Validation
    if (!chapterForm.title || !chapterForm.totalPages || !chapterForm.subjectName || !chapterForm.gradeId) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields: title, total pages, subject name, and grade.",
        variant: "destructive",
      })
      return
    }

    if (!chapterForm.readingFile) {
      toast({
        title: "Validation Error",
        description: "Please upload a reading file for the chapter.",
        variant: "destructive",
      })
      return
    }

    if (chapterForm.quizSegments.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one quiz segment.",
        variant: "destructive",
      })
      return
    }

    // Validate quiz segments
    for (const quiz of chapterForm.quizSegments) {
      if (!quiz.startPage || !quiz.endPage || !quiz.quizFile) {
        toast({
          title: "Quiz Validation Error",
          description: "All quiz segments must have start page, end page, and quiz file.",
          variant: "destructive",
        })
        return
      }
      if (Number.parseInt(quiz.startPage) >= Number.parseInt(quiz.endPage)) {
        toast({
          title: "Quiz Validation Error",
          description: "Start page must be less than end page for all quizzes.",
          variant: "destructive",
        })
        return
      }
      if (
        Number.parseInt(quiz.startPage) < 1 ||
        Number.parseInt(quiz.endPage) > Number.parseInt(chapterForm.totalPages)
      ) {
        toast({
          title: "Quiz Validation Error",
          description: `Quiz segment pages must be within chapter total pages (1-${chapterForm.totalPages}).`,
          variant: "destructive",
        })
        return
      }
    }

    try {
      // Find or create subject
      let targetSubject = subjects.find(
        (s) => s.name.toLowerCase() === chapterForm.subjectName.toLowerCase() && s.gradeId === chapterForm.gradeId,
      )

      if (!targetSubject) {
        // Create new subject
        const newSubjectId = `s${Date.now()}`
        targetSubject = {
          id: newSubjectId,
          title: chapterForm.subjectName,
          name: chapterForm.subjectName,
          description: `${chapterForm.subjectName} subject`,
          status: "Draft",
          thumbnailUrl: "/placeholder.svg?height=64&width=64",
          gradeId: chapterForm.gradeId,
          chapters: [],
        }
        setSubjects((prevSubjects) => [...prevSubjects, targetSubject!])
        console.log("Created new subject:", targetSubject)
      }

      // Create quiz segments
      const quizSegments: QuizSegment[] = chapterForm.quizSegments.map((quiz) => ({
        id: quiz.id,
        startPage: Number.parseInt(quiz.startPage),
        endPage: Number.parseInt(quiz.endPage),
        quizFileUrl: URL.createObjectURL(quiz.quizFile!),
        quizFileName: quiz.quizFile!.name,
      }))

      // Create new chapter
      const newChapter: Chapter = {
        id: `${targetSubject.id}-ch${Date.now()}`,
        title: chapterForm.title,
        description: chapterForm.description,
        totalPages: Number.parseInt(chapterForm.totalPages),
        semester: Number.parseInt(chapterForm.semester) as 1 | 2,
        readingFileUrl: URL.createObjectURL(chapterForm.readingFile),
        readingFileName: chapterForm.readingFile.name,
        quizSegments: quizSegments,
        chapterTestFileUrl: chapterForm.chapterTestFile ? URL.createObjectURL(chapterForm.chapterTestFile) : undefined,
        chapterTestFileName: chapterForm.chapterTestFile ? chapterForm.chapterTestFile.name : undefined,
        postChapterText: chapterForm.postChapterText,
      }

      console.log("Created new chapter:", newChapter)

      // Update subjects with new chapter
      setSubjects((prevSubjects) =>
        prevSubjects.map((subject) => {
          if (subject.id === targetSubject!.id) {
            return {
              ...subject,
              chapters: [...(subject.chapters || []), newChapter],
            }
          }
          return subject
        }),
      )

      // Reset form
      setChapterForm({
        title: "",
        description: "",
        totalPages: "",
        semester: "1",
        subjectName: "",
        gradeId: "",
        readingFile: null,
        chapterTestFile: null,
        postChapterText: "",
        quizSegments: [],
      })

      setShowAddChapterDialog(false)

      toast({
        title: "Chapter Added Successfully!",
        description: `${newChapter.title} has been added with ${quizSegments.length} quiz segments.`,
      })

      console.log("Chapter added successfully")
    } catch (error) {
      console.error("Error adding chapter:", error)
      toast({
        title: "Error",
        description: "An error occurred while adding the chapter. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditChapter = (chapter: Chapter) => {
    setEditingChapter(chapter)
    setEditChapterForm({
      id: chapter.id,
      title: chapter.title,
      description: chapter.description || "",
      totalPages: chapter.totalPages.toString(),
      semester: chapter.semester.toString() as "1" | "2",
      subjectId: chapter.id.split("-ch")[0],
      readingFile: null,
      chapterTestFile: null,
      postChapterText: chapter.postChapterText || "",
      currentReadingFileName: chapter.readingFileName || "",
      currentChapterTestFileName: chapter.chapterTestFileName || "",
    })
    setShowEditChapterDialog(true)
  }

  const handleUpdateChapter = () => {
    if (!editChapterForm.title || !editChapterForm.totalPages) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setSubjects(
      subjects.map((subject) => {
        if (subject.id === editChapterForm.subjectId) {
          return {
            ...subject,
            chapters: subject.chapters?.map((chapter) => {
              if (chapter.id === editChapterForm.id) {
                return {
                  ...chapter,
                  title: editChapterForm.title,
                  description: editChapterForm.description,
                  totalPages: Number.parseInt(editChapterForm.totalPages),
                  semester: Number.parseInt(editChapterForm.semester) as 1 | 2,
                  readingFileUrl: editChapterForm.readingFile
                    ? URL.createObjectURL(editChapterForm.readingFile)
                    : chapter.readingFileUrl,
                  readingFileName: editChapterForm.readingFile
                    ? editChapterForm.readingFile.name
                    : chapter.readingFileName,
                  chapterTestFileUrl: editChapterForm.chapterTestFile
                    ? URL.createObjectURL(editChapterForm.chapterTestFile)
                    : chapter.chapterTestFileUrl,
                  chapterTestFileName: editChapterForm.chapterTestFile
                    ? editChapterForm.chapterTestFile.name
                    : chapter.chapterTestFileName,
                  postChapterText: editChapterForm.postChapterText,
                }
              }
              return chapter
            }),
          }
        }
        return subject
      }),
    )

    setShowEditChapterDialog(false)
    setEditingChapter(null)

    toast({
      title: "Chapter Updated!",
      description: `${editChapterForm.title} has been successfully updated.`,
    })
  }

  const handleEditQuiz = (quiz: QuizSegment, chapterId: string, subjectId: string) => {
    setEditingQuiz(quiz)
    setEditQuizForm({
      id: quiz.id,
      startPage: quiz.startPage.toString(),
      endPage: quiz.endPage.toString(),
      quizFile: null,
      currentQuizFileName: quiz.quizFileName || "",
      chapterId: chapterId,
      subjectId: subjectId,
    })
    setShowEditQuizDialog(true)
  }

  const handleUpdateQuiz = () => {
    if (!editQuizForm.startPage || !editQuizForm.endPage) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setSubjects(
      subjects.map((subject) => {
        if (subject.id === editQuizForm.subjectId) {
          return {
            ...subject,
            chapters: subject.chapters?.map((chapter) => {
              if (chapter.id === editQuizForm.chapterId) {
                return {
                  ...chapter,
                  quizSegments: chapter.quizSegments?.map((quiz) => {
                    if (quiz.id === editQuizForm.id) {
                      return {
                        ...quiz,
                        startPage: Number.parseInt(editQuizForm.startPage),
                        endPage: Number.parseInt(editQuizForm.endPage),
                        quizFileUrl: editQuizForm.quizFile
                          ? URL.createObjectURL(editQuizForm.quizFile)
                          : quiz.quizFileUrl,
                        quizFileName: editQuizForm.quizFile ? editQuizForm.quizFile.name : quiz.quizFileName,
                      }
                    }
                    return quiz
                  }),
                }
              }
              return chapter
            }),
          }
        }
        return subject
      }),
    )

    setShowEditQuizDialog(false)
    setEditingQuiz(null)

    toast({
      title: "Quiz Updated!",
      description: "Quiz segment has been successfully updated.",
    })
  }

  const handleEditChapterTest = (chapter: Chapter) => {
    setEditingChapterTest(chapter)
    setEditChapterTestForm({
      chapterId: chapter.id,
      subjectId: chapter.id.split("-ch")[0],
      chapterTestFile: null,
      currentChapterTestFileName: chapter.chapterTestFileName || "",
    })
    setShowEditChapterTestDialog(true)
  }

  const handleUpdateChapterTest = () => {
    if (!editChapterTestForm.chapterTestFile) {
      toast({
        title: "Validation Error",
        description: "Please upload a chapter test file.",
        variant: "destructive",
      })
      return
    }

    setSubjects(
      subjects.map((subject) => {
        if (subject.id === editChapterTestForm.subjectId) {
          return {
            ...subject,
            chapters: subject.chapters?.map((chapter) => {
              if (chapter.id === editChapterTestForm.chapterId) {
                return {
                  ...chapter,
                  chapterTestFileUrl: URL.createObjectURL(editChapterTestForm.chapterTestFile!),
                  chapterTestFileName: editChapterTestForm.chapterTestFile!.name,
                }
              }
              return chapter
            }),
          }
        }
        return subject
      }),
    )

    setShowEditChapterTestDialog(false)
    setEditingChapterTest(null)

    toast({
      title: "Chapter Test Updated!",
      description: "Chapter test has been successfully updated.",
    })
  }

  const handleDeleteChapter = (subjectId: string, chapterId: string, chapterTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${chapterTitle}"?`)) {
      setSubjects(
        subjects.map((subject) => {
          if (subject.id === subjectId) {
            return {
              ...subject,
              chapters: subject.chapters?.filter((ch) => ch.id !== chapterId) || [],
            }
          }
          return subject
        }),
      )

      setChapterExams(chapterExams.filter((e) => e.chapterId !== chapterId))

      toast({
        title: "Chapter Deleted!",
        description: `"${chapterTitle}" has been removed.`,
        variant: "destructive",
      })
    }
  }

  const handleDeleteQuiz = (subjectId: string, chapterId: string, quizId: string) => {
    if (window.confirm("Are you sure you want to delete this quiz segment?")) {
      setSubjects(
        subjects.map((subject) => {
          if (subject.id === subjectId) {
            return {
              ...subject,
              chapters: subject.chapters?.map((chapter) => {
                if (chapter.id === chapterId) {
                  return {
                    ...chapter,
                    quizSegments: chapter.quizSegments?.filter((quiz) => quiz.id !== quizId) || [],
                  }
                }
                return chapter
              }),
            }
          }
          return subject
        }),
      )

      toast({
        title: "Quiz Deleted!",
        description: "Quiz segment has been removed.",
        variant: "destructive",
      })
    }
  }

  // CRUD Operations for Mixed Exams
  const handleAddMixedExam = () => {
    if (!mixedExamForm.title || !mixedExamForm.gradeId || !mixedExamForm.duration || !mixedExamForm.totalMarks) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const newMixedExam: MixedExam = {
      id: `me${Date.now()}`,
      title: mixedExamForm.title,
      type: mixedExamForm.type,
      gradeId: mixedExamForm.gradeId,
      subjectIds: mixedExamForm.subjectIds,
      duration: Number.parseInt(mixedExamForm.duration),
      totalMarks: Number.parseInt(mixedExamForm.totalMarks),
      examFileUrl: mixedExamForm.examFile ? URL.createObjectURL(mixedExamForm.examFile) : undefined,
      examFileName: mixedExamForm.examFile ? mixedExamForm.examFile.name : undefined,
    }

    setMixedExams([...mixedExams, newMixedExam])
    setMixedExamForm({
      title: "",
      type: "semester1",
      gradeId: "",
      subjectIds: [],
      duration: "",
      totalMarks: "",
      examFile: null,
    })
    setShowAddMixedExamDialog(false)

    toast({
      title: "Mixed Exam Added!",
      description: `${newMixedExam.title} has been successfully added.`,
    })
  }

  const handleEditMixedExam = (exam: MixedExam) => {
    setEditingMixedExam(exam)
    setEditMixedExamForm({
      id: exam.id,
      title: exam.title,
      type: exam.type,
      gradeId: exam.gradeId,
      subjectIds: exam.subjectIds,
      duration: exam.duration.toString(),
      totalMarks: exam.totalMarks.toString(),
      examFile: null,
      currentExamFileName: exam.examFileName || "",
    })
    setShowEditMixedExamDialog(true)
  }

  const handleUpdateMixedExam = () => {
    if (
      !editMixedExamForm.title ||
      !editMixedExamForm.gradeId ||
      !editMixedExamForm.duration ||
      !editMixedExamForm.totalMarks
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setMixedExams(
      mixedExams.map((exam) =>
        exam.id === editMixedExamForm.id
          ? {
              ...exam,
              title: editMixedExamForm.title,
              type: editMixedExamForm.type,
              gradeId: editMixedExamForm.gradeId,
              subjectIds: editMixedExamForm.subjectIds,
              duration: Number.parseInt(editMixedExamForm.duration),
              totalMarks: Number.parseInt(editMixedExamForm.totalMarks),
              examFileUrl: editMixedExamForm.examFile
                ? URL.createObjectURL(editMixedExamForm.examFile)
                : exam.examFileUrl,
              examFileName: editMixedExamForm.examFile ? editMixedExamForm.examFile.name : exam.examFileName,
            }
          : exam,
      ),
    )

    setShowEditMixedExamDialog(false)
    setEditingMixedExam(null)

    toast({
      title: "Mixed Exam Updated!",
      description: `${editMixedExamForm.title} has been successfully updated.`,
    })
  }

  const handleDeleteMixedExam = (examId: string, examTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${examTitle}"?`)) {
      setMixedExams(mixedExams.filter((e) => e.id !== examId))

      toast({
        title: "Mixed Exam Deleted!",
        description: `"${examTitle}" has been removed.`,
        variant: "destructive",
      })
    }
  }

  // CRUD Operations for Chapter Exams
  const handleAddChapterExam = () => {
    if (
      !chapterExamForm.title ||
      !chapterExamForm.chapterId ||
      !chapterExamForm.duration ||
      !chapterExamForm.totalMarks
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const newChapterExam: ChapterExam = {
      id: `ce${Date.now()}`,
      title: chapterExamForm.title,
      chapterId: chapterExamForm.chapterId,
      subjectId: chapterExamForm.subjectId,
      gradeId: chapterExamForm.gradeId,
      duration: Number.parseInt(chapterExamForm.duration),
      totalMarks: Number.parseInt(chapterExamForm.totalMarks),
      examFileUrl: chapterExamForm.examFile ? URL.createObjectURL(chapterExamForm.examFile) : undefined,
      examFileName: chapterExamForm.examFile ? chapterExamForm.examFile.name : undefined,
    }

    setChapterExams([...chapterExams, newChapterExam])
    setChapterExamForm({
      title: "",
      gradeId: "",
      subjectId: "",
      chapterId: "",
      duration: "",
      totalMarks: "",
      examFile: null,
    })
    setShowAddChapterExamDialog(false)

    toast({
      title: "Chapter Exam Added!",
      description: `${newChapterExam.title} has been successfully added.`,
    })
  }

  const filteredGrades = grades.filter((grade) => {
    const matchesSearch = grade.title.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  // Statistics calculations
  const totalGrades = grades.length
  const totalSubjects = subjects.length
  const totalChapters = subjects.reduce((acc, subject) => acc + (subject.chapters?.length || 0), 0)
  const totalExams = mixedExams.length + chapterExams.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-white/20">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Content Management System
            </h1>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Comprehensive educational content management with hierarchical organization and advanced assessment tools
          </p>
        </div>

        {/* Statistics Cards with Adjusted Icon Shadows */}
        <div className="grid gap-3 md:gap-6 grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Grades */}
          <Card className="bg-[#D3F8EC] text-[#1E293B] rounded-xl md:rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border border-[#e2e8f0] relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 md:pb-3">
              <CardTitle className="text-sm md:text-base font-semibold text-[#4a5568]">Total Grades</CardTitle>
              <div className="p-2 md:p-3 bg-[#718096]/15 rounded-lg md:rounded-xl z-10">
                <GraduationCap className="h-5 w-5 md:h-6 md:w-6 text-[#718096]" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-2xl md:text-4xl font-bold mb-1 text-[#2d3748]">3</div>
              <p className="text-xs md:text-sm text-[#718096]">All your grades</p>
            </CardContent>
            <div className="absolute right-2 bottom-2 opacity-10 z-0">
              <GraduationCap className="h-16 w-16 text-[#718096]" />
            </div>
          </Card>

          {/* Total Subjects */}
          <Card className="bg-[#E9F6FF] text-[#1E293B] rounded-xl md:rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]  relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 md:pb-3">
              <CardTitle className="text-sm md:text-base font-semibold text-[#4a5568]">Total Subjects</CardTitle>
              <div className="p-2 md:p-3 bg-[#667eea]/15 rounded-lg md:rounded-xl z-10">
                <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-[#667eea]" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-2xl md:text-4xl font-bold mb-1 text-[#2d3748]">2</div>
              <p className="text-xs md:text-sm text-[#718096]">Active subjects</p>
            </CardContent>
            <div className="absolute right-2 bottom-2 opacity-10 z-0">
              <BookOpen className="h-16 w-16 text-[#667eea]" />
            </div>
          </Card>

          {/* Total Chapters */}
          <Card className="bg-gradient-to-br from-[#F9F6F1] to-[#EFE9DC] text-[#1E293B] rounded-xl md:rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]  relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 md:pb-3">
              <CardTitle className="text-sm md:text-base font-semibold text-[#4a5568]">Total Chapters</CardTitle>
              <div className="p-2 md:p-3 bg-[#9f7aea]/15 rounded-lg md:rounded-xl z-10">
                <FileText className="h-5 w-5 md:h-6 md:w-6 text-[#9f7aea]" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-2xl md:text-4xl font-bold mb-1 text-[#2d3748]">2</div>
              <p className="text-xs md:text-sm text-[#718096]">Across all subjects</p>
            </CardContent>
            <div className="absolute right-2 bottom-2 opacity-10 z-0">
              <FileText className="h-16 w-16 text-[#9f7aea]" />
            </div>
          </Card>

          {/* Total Exams */}
          <Card className="bg-gradient-to-br from-[#F1F5F9] to-[#E2E8F0]text-[#1E293B] rounded-xl md:rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]  relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 md:pb-3">
              <CardTitle className="text-sm md:text-base font-semibold text-[#4a5568]">Total Exams</CardTitle>
              <div className="p-2 md:p-3 bg-[#ed8936]/15 rounded-lg md:rounded-xl z-10">
                <Award className="h-5 w-5 md:h-6 md:w-6 text-[#ed8936]" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-2xl md:text-4xl font-bold mb-1 text-[#2d3748]">4</div>
              <p className="text-xs md:text-sm text-[#718096]">Completed exams</p>
            </CardContent>
            <div className="absolute right-2 bottom-2 opacity-10 z-0">
              <Award className="h-16 w-16 text-[#ed8936]" />
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200/50 p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  Educational Content Hub
                </CardTitle>
                <CardDescription className="text-slate-600 text-lg">
                  Manage your educational content with advanced hierarchical organization
                </CardDescription>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
                <div className="relative flex-1 lg:w-80">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    type="search"
                    placeholder="Search content..."
                    className="w-full rounded-2xl bg-white/80 border-slate-200 pl-12 h-12 text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-slate-200 hover:bg-slate-50 bg-transparent"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-slate-200 hover:bg-slate-50 bg-transparent"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 rounded-2xl bg-slate-100 p-2 h-auto">
                <TabsTrigger
                  value="overview"
                  className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm py-3 px-4 text-sm font-medium"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger
                  value="grades"
                  className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm py-3 px-4 text-sm font-medium"
                >
                  <GraduationCap className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Grades</span>
                </TabsTrigger>
                <TabsTrigger
                  value="chapters"
                  className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm py-3 px-4 text-sm font-medium"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Chapters</span>
                </TabsTrigger>
                <TabsTrigger
                  value="mixed-exams"
                  className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm py-3 px-4 text-sm font-medium"
                >
                  <Award className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Mixed Exams</span>
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-8">
                <div className="space-y-8">
                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button
                      onClick={() => setShowAddGradeDialog(true)}
                      className="h-24 bg-[#F0FDF4] hover:bg-gradient-to-br hover:from-[#F9F6F1] hover:to-[#EFE9DC] hover:text-[#1E293B] text-orange rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center gap-2"
                    >
                      <PlusCircle className="h-8 w-8" />
                      <span className="font-semibold">Add Grade</span>
                    </Button>

                    <Button
                      onClick={() => setShowAddSubjectDialog(true)}
                      className="h-24 bg-[#EFF6FF] hover:bg-gradient-to-br hover:from-[#F9F6F1] hover:to-[#EFE9DC] hover:text-[#1E293B] text-orange rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center gap-2"
                    >
                      <PlusCircle className="h-8 w-8" />
                      <span className="font-semibold">Add Subject</span>
                    </Button>

                    <Button
                      onClick={() => setShowAddChapterDialog(true)}
                      className="h-24 bg-[#FCF4D7] hover:bg-gradient-to-br hover:from-[#F9F6F1] hover:to-[#EFE9DC] hover:text-[#1E293B] text-ora rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center gap-2"
                    >
                      <PlusCircle className="h-8 w-8" />
                      <span className="font-semibold">Add Chapter</span>
                    </Button>

                    <Button
                      onClick={() => setShowAddMixedExamDialog(true)}
                      className="h-24 bg-[#EFE6E2] hover:bg-gradient-to-br hover:from-[#F9F6F1] hover:to-[#EFE9DC] hover:text-[#1E293B] text-orange rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center gap-2"
                    >
                      <PlusCircle className="h-8 w-8" />
                      <span className="font-semibold">Add Exam</span>
                    </Button>
                  </div>

                  {/* Recent Activity */}
                  <Card className="rounded-2xl border-slate-200 shadow-lg">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                        <Clock className="h-5 w-5 text-blue-500" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-200">
                          <div className="p-2 bg-green-500 rounded-full">
                            <CheckCircle className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-slate-800">Mathematics chapter added</p>
                            <p className="text-sm text-slate-600">Numbers 1-10 with 4 quiz segments</p>
                          </div>
                          <span className="text-sm text-slate-500">2 hours ago</span>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                          <div className="p-2 bg-blue-500 rounded-full">
                            <Star className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-slate-800">Grade 2 created</p>
                            <p className="text-sm text-slate-600">Basic skills development level</p>
                          </div>
                          <span className="text-sm text-slate-500">5 hours ago</span>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl border border-orange-200">
                          <div className="p-2 bg-orange-500 rounded-full">
                            <AlertCircle className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-slate-800">Mixed exam updated</p>
                            <p className="text-sm text-slate-600">Semester 1 exam for Grade 1</p>
                          </div>
                          <span className="text-sm text-slate-500">1 day ago</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Content Summary */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="rounded-2xl border-slate-200 shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold text-slate-800">Content Distribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {grades.map((grade) => (
                            <div
                              key={grade.id}
                              className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
                            >
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-[#D2B48C] via-[#F3E5AB] to-[#FFF8E1] rounded-lg">
                                  <GraduationCap className="h-4 w-4 text-[#6B4226]" /> {/* warm chocolate */}
                                </div>
                                <span className="font-medium text-slate-800">{grade.title}</span>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium text-slate-800">
                                  {getSubjectsForGrade(grade.id).length} subjects
                                </p>
                                <p className="text-xs text-slate-600">
                                  {getSubjectsForGrade(grade.id).reduce(
                                    (acc, subject) => acc + (subject.chapters?.length || 0),
                                    0,
                                  )}{" "}
                                  chapters
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="rounded-2xl border-slate-200 shadow-lg">
                      <CardHeader>
                        <CardTitle className="text-lg font-semibold text-slate-800">Assessment Overview</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-500 rounded-lg">
                                <Award className="h-4 w-4 text-white" />
                              </div>
                              <span className="font-medium text-slate-800">Mixed Exams</span>
                            </div>
                            <span className="text-lg font-bold text-blue-600">{mixedExams.length}</span>
                          </div>

                          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-purple-500 rounded-lg">
                                <Target className="h-4 w-4 text-white" />
                              </div>
                              <span className="font-medium text-slate-800">Chapter Exams</span>
                            </div>
                            <span className="text-lg font-bold text-purple-600">{chapterExams.length}</span>
                          </div>

                          <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-emerald-500 rounded-lg">
                                <FileText className="h-4 w-4 text-white" />
                              </div>
                              <span className="font-medium text-slate-800">Quiz Segments</span>
                            </div>
                            <span className="text-lg font-bold text-emerald-600">
                              {subjects.reduce(
                                (acc, subject) =>
                                  acc +
                                  (subject.chapters?.reduce(
                                    (chAcc, chapter) => chAcc + (chapter.quizSegments?.length || 0),
                                    0,
                                  ) || 0),
                                0,
                              )}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Grades Tab */}
              <TabsContent value="grades" className="mt-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800">Grade Management</h3>
                    <p className="text-slate-600 mt-1">Organize your educational content by grade levels</p>
                  </div>
                  <Button
                    onClick={() => setShowAddGradeDialog(true)}
                    className="bg-gradient-to-br from-[#D2B48C] via-[#F3E5AB] to-[#FFF8E1] hover:from-[#C2A678] hover:via-[#E6D08F] hover:to-[#FDF2C8]
                    text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3"
                  >
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Add Grade
                  </Button>
                </div>

                <div className="space-y-6">
                  {filteredGrades.map((grade) => (
                    <Card
                      key={grade.id}
                      className="rounded-2xl border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                    >
                      <CardContent className="p-0">
                        <div className="p-6 bg-gradient-to-r from-slate-50 to-blue-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleGradeExpansion(grade.id)}
                                className="p-2 h-10 w-10 rounded-xl  text-bl"
                              >
                                {expandedGrades.has(grade.id) ? (
                                  <ChevronDown className="h-5 w-5 " />
                                ) : (
                                  <ChevronRight className="h-5 w-5" />
                                )}
                              </Button>
                              <div className="p-2 bg-gradient-to-br from-[#a7a2a9] via-[#c6b8ae] to-[#f1e9e5] rounded-lg">
                                <GraduationCap className="h-4 w-4 text-white" /> {/* warm mahogany */}
                              </div>

                              <div>
                                <h4 className="text-xl font-bold text-slate-800">{grade.title}</h4>
                                <p className="text-slate-600 mt-1">{grade.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="text-right">
                                <div className="flex gap-6 text-sm text-slate-600 mb-2">
                                  <span className="flex items-center gap-2">
                                    <BookOpen className="h-4 w-4 text-blue-500" />
                                    <span className="font-medium">{grade.totalSubjects}</span>
                                    <span>subjects</span>
                                  </span>
                                  <span className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-emerald-500" />
                                    <span className="font-medium">{grade.totalStudents}</span>
                                    <span>students</span>
                                  </span>
                                </div>
                                <Badge
                                  variant={grade.status === "Active" ? "default" : "secondary"}
                                  className="rounded-full px-3 py-1 bg-gradient-to-br from-[#F9F6F1] to-[#EFE9DC] text-[#1E293B]"
                                >
                                  {grade.status}
                                </Badge>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-10 w-10 p-0 rounded-xl "
                                  >
                                    <MoreHorizontal className="h-5 w-5" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="rounded-2xl shadow-xl border-slate-200">
                                  <DropdownMenuItem onClick={() => handleEditGrade(grade)} className="rounded-xl">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Grade
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedGradeForSubject(grade.id)
                                      setSubjectForm({ ...subjectForm, gradeId: grade.id })
                                      setShowAddSubjectDialog(true)
                                    }}
                                    className="rounded-xl"
                                  >
                                    <PlusCircle
                                      className="h-4 w-4 mr-2 bg-gradient-to-r 
"
                                    />
                                    Add Subject
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteGrade(grade.id, grade.title)}
                                    className="text-red-600 rounded-xl"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Grade
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>

                        {/* Expanded Grade Content - Subjects */}
                        {expandedGrades.has(grade.id) && (
                          <div className="p-6 border-t border-slate-200">
                            <div className="flex justify-between items-center mb-6">
                              <h5 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-blue-500" />
                                Subjects in {grade.title}
                              </h5>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedGradeForSubject(grade.id)
                                  setSubjectForm({ ...subjectForm, gradeId: grade.id })
                                  setShowAddSubjectDialog(true)
                                }}
                                className="rounded-xl bg-[#ECE4D4] border-slate-200 hover:bg-slate-50"
                              >
                                <PlusCircle className="h-4 w-4 mr-2 " />
                                Add Subject
                              </Button>
                            </div>

                            <div className="grid gap-4">
                              {getSubjectsForGrade(grade.id).map((subject) => (
                                <Card key={subject.id} className="rounded-xl border-slate-200 bg-slate-50/50">
                                  <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-4">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => toggleSubjectExpansion(subject.id)}
                                          className="p-1 h-8 w-8 rounded-lg"
                                        >
                                          {expandedSubjects.has(subject.id) ? (
                                            <ChevronDown className="h-4 w-4" />
                                          ) : (
                                            <ChevronRight className="h-4 w-4" />
                                          )}
                                        </Button>
                                        <div className="p-2 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg">
                                          <BookOpen className="h-4 w-4 text-white" />
                                        </div>
                                        <div>
                                          <h6 className="font-semibold text-slate-800">{subject.title}</h6>
                                          <p className="text-sm text-slate-600">{subject.name}</p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <Badge variant="outline" className="text-xs rounded-full px-2 py-1">
                                          {subject.chapters?.length || 0} chapters
                                        </Badge>
                                        <Badge
                                          variant={subject.status === "Published" ? "default" : "secondary"}
                                          className="text-xs rounded-full px-2 py-1"
                                        >
                                          {subject.status}
                                        </Badge>
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg">
                                              <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end" className="rounded-xl shadow-lg">
                                            <DropdownMenuItem
                                              onClick={() => handleEditSubject(subject)}
                                              className="rounded-lg"
                                            >
                                              <Edit className="h-4 w-4 mr-2" />
                                              Edit Subject
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                              onClick={() => {
                                                setSelectedSubjectForChapter(subject.id)
                                                setChapterForm({
                                                  ...chapterForm,
                                                  subjectName: subject.name,
                                                  gradeId: subject.gradeId,
                                                })
                                                setShowAddChapterDialog(true)
                                              }}
                                              className="rounded-lg"
                                            >
                                              <PlusCircle className="h-4 w-4 mr-2" />
                                              Add Chapter
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                              onClick={() => handleDeleteSubject(subject.id, subject.title)}
                                              className="text-red-600 rounded-lg"
                                            >
                                              <Trash2 className="h-4 w-4 mr-2" />
                                              Delete Subject
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      </div>
                                    </div>

                                    {/* Expanded Subject Content - Chapters */}
                                    {expandedSubjects.has(subject.id) && (
                                      <div className="mt-6 pl-8 border-l-2 border-slate-200">
                                        <div className="flex justify-between items-center mb-4">
                                          <h6 className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                                            <FileText className="h-4 w-4" />
                                            Chapters
                                          </h6>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                              setSelectedSubjectForChapter(subject.id)
                                              setChapterForm({
                                                ...chapterForm,
                                                subjectName: subject.name,
                                                gradeId: subject.gradeId,
                                              })
                                              setShowAddChapterDialog(true)
                                            }}
                                            className="text-xs rounded-lg h-8 border-slate-200"
                                          >
                                            <PlusCircle className="h-3 w-3 mr-1" />
                                            Add Chapter
                                          </Button>
                                        </div>

                                        <div className="space-y-4">
                                          {/* Semester 1 Chapters */}
                                          <div>
                                            <h6 className="text-xs font-semibold text-blue-600 mb-3 flex items-center gap-2">
                                              <Calendar className="h-3 w-3" />
                                              Semester 1
                                            </h6>
                                            <div className="space-y-2">
                                              {getChaptersForSubject(subject.id)
                                                .filter((ch) => ch.semester === 1)
                                                .map((chapter) => (
                                                  <div
                                                    key={chapter.id}
                                                    className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-200"
                                                  >
                                                    <div>
                                                      <p className="text-sm font-semibold text-slate-800">
                                                        {chapter.title}
                                                      </p>
                                                      <p className="text-xs text-slate-600">
                                                        {chapter.totalPages} pages • {chapter.quizSegments?.length || 0}{" "}
                                                        quizzes
                                                      </p>
                                                    </div>
                                                    <div className="flex gap-1">
                                                      <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEditChapter(chapter)}
                                                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg"
                                                      >
                                                        <Edit className="h-3 w-3" />
                                                      </Button>
                                                      <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                          handleDeleteChapter(subject.id, chapter.id, chapter.title)
                                                        }
                                                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg"
                                                      >
                                                        <Trash2 className="h-3 w-3" />
                                                      </Button>
                                                    </div>
                                                  </div>
                                                ))}
                                            </div>
                                          </div>

                                          {/* Semester 2 Chapters */}
                                          <div>
                                            <h6 className="text-xs font-semibold text-purple-600 mb-3 flex items-center gap-2">
                                              <Calendar className="h-3 w-3" />
                                              Semester 2
                                            </h6>
                                            <div className="space-y-2">
                                              {getChaptersForSubject(subject.id)
                                                .filter((ch) => ch.semester === 2)
                                                .map((chapter) => (
                                                  <div
                                                    key={chapter.id}
                                                    className="flex items-center justify-between p-3 bg-purple-50 rounded-xl border border-purple-200"
                                                  >
                                                    <div>
                                                      <p className="text-sm font-semibold text-slate-800">
                                                        {chapter.title}
                                                      </p>
                                                      <p className="text-xs text-slate-600">
                                                        {chapter.totalPages} pages • {chapter.quizSegments?.length || 0}{" "}
                                                        quizzes
                                                      </p>
                                                    </div>
                                                    <div className="flex gap-1">
                                                      <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEditChapter(chapter)}
                                                        className="h-8 w-8 p-0 text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded-lg"
                                                      >
                                                        <Edit className="h-3 w-3" />
                                                      </Button>
                                                      <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                          handleDeleteChapter(subject.id, chapter.id, chapter.title)
                                                        }
                                                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-lg"
                                                      >
                                                        <Trash2 className="h-3 w-3" />
                                                      </Button>
                                                    </div>
                                                  </div>
                                                ))}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              ))}

                              {getSubjectsForGrade(grade.id).length === 0 && (
                                <div className="text-center py-12 text-slate-500">
                                  <div className="p-4 bg-slate-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                    <BookOpen className="h-8 w-8 text-slate-400" />
                                  </div>
                                  <p className="text-lg font-medium mb-2">No subjects added yet</p>
                                  <p className="text-sm mb-4">Start by adding your first subject to this grade</p>
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      setSelectedGradeForSubject(grade.id)
                                      setSubjectForm({ ...subjectForm, gradeId: grade.id })
                                      setShowAddSubjectDialog(true)
                                    }}
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl"
                                  >
                                    Add First Subject
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Chapters Tab */}
              <TabsContent value="chapters" className="mt-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800">Chapter Management</h3>
                    <p className="text-slate-600 mt-1">Manage individual chapters with quiz segments and assessments</p>
                  </div>
                  <Button
                    onClick={() => setShowAddChapterDialog(true)}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3"
                  >
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Add Chapter
                  </Button>
                </div>

                <div className="grid gap-6">
                  {subjects.map((subject) => (
                    <Card key={subject.id} className="rounded-2xl border-slate-200 shadow-lg">
                      <CardHeader className="pb-4 bg-gradient-to-r from-slate-50 to-purple-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl">
                              <BookOpen className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-xl text-slate-800">{subject.title}</CardTitle>
                              <CardDescription className="text-slate-600">
                                {subject.name} • {grades.find((g) => g.id === subject.gradeId)?.title}
                              </CardDescription>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedSubjectForChapter(subject.id)
                              setChapterForm({ ...chapterForm, subjectName: subject.name, gradeId: subject.gradeId })
                              setShowAddChapterDialog(true)
                            }}
                            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl"
                          >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add Chapter
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          {/* Semester 1 */}
                          <div className="space-y-4">
                            <h4 className="font-semibold text-blue-600 flex items-center gap-2 text-lg">
                              <Calendar className="h-5 w-5" />
                              Semester 1
                            </h4>
                            <div className="space-y-3">
                              {getChaptersForSubject(subject.id)
                                .filter((ch) => ch.semester === 1)
                                .map((chapter) => (
                                  <Card key={chapter.id} className="rounded-xl border-blue-200 bg-blue-50/50 shadow-sm">
                                    <CardContent className="p-4">
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                          <h5 className="font-semibold text-slate-800 mb-1">{chapter.title}</h5>
                                          <p className="text-sm text-slate-600 mb-3">{chapter.description}</p>
                                          <div className="flex gap-4 text-xs text-slate-500 mb-3">
                                            <span className="flex items-center gap-1">
                                              <FileText className="h-3 w-3" />
                                              {chapter.totalPages} pages
                                            </span>
                                            <span className="flex items-center gap-1">
                                              <Target className="h-3 w-3" />
                                              {chapter.quizSegments?.length || 0} quizzes
                                            </span>
                                            <span className="flex items-center gap-1">
                                              <CheckCircle className="h-3 w-3" />
                                              {chapter.chapterTestFileUrl ? "Test available" : "No test"}
                                            </span>
                                          </div>
                                          {/* Quiz Segments */}
                                          {chapter.quizSegments && chapter.quizSegments.length > 0 && (
                                            <div className="space-y-2">
                                              <p className="text-xs font-semibold text-slate-700">Quiz Segments:</p>
                                              {chapter.quizSegments.map((quiz) => (
                                                <div
                                                  key={quiz.id}
                                                  className="flex items-center justify-between p-2 bg-white rounded-lg border border-blue-200"
                                                >
                                                  <span className="text-xs text-slate-600">
                                                    Pages {quiz.startPage}-{quiz.endPage}
                                                  </span>
                                                  <div className="flex gap-1">
                                                    <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() => handleEditQuiz(quiz, chapter.id, subject.id)}
                                                      className="h-6 w-6 p-0 text-blue-600 hover:bg-blue-100 rounded"
                                                    >
                                                      <Edit className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() => handleDeleteQuiz(subject.id, chapter.id, quiz.id)}
                                                      className="h-6 w-6 p-0 text-red-600 hover:bg-red-100 rounded"
                                                    >
                                                      <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg">
                                              <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end" className="rounded-xl shadow-lg">
                                            <DropdownMenuItem
                                              onClick={() => handleEditChapter(chapter)}
                                              className="rounded-lg"
                                            >
                                              <Edit className="h-4 w-4 mr-2" />
                                              Edit Chapter
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                              onClick={() => handleEditChapterTest(chapter)}
                                              className="rounded-lg"
                                            >
                                              <FileText className="h-4 w-4 mr-2" />
                                              Edit Chapter Test
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="rounded-lg">
                                              <Eye className="h-4 w-4 mr-2" />
                                              View Details
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                              onClick={() => handleDeleteChapter(subject.id, chapter.id, chapter.title)}
                                              className="text-red-600 rounded-lg"
                                            >
                                              <Trash2 className="h-4 w-4 mr-2" />
                                              Delete Chapter
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                            </div>
                          </div>

                          {/* Semester 2 */}
                          <div className="space-y-4">
                            <h4 className="font-semibold text-purple-600 flex items-center gap-2 text-lg">
                              <Calendar className="h-5 w-5" />
                              Semester 2
                            </h4>
                            <div className="space-y-3">
                              {getChaptersForSubject(subject.id)
                                .filter((ch) => ch.semester === 2)
                                .map((chapter) => (
                                  <Card
                                    key={chapter.id}
                                    className="rounded-xl border-purple-200 bg-purple-50/50 shadow-sm"
                                  >
                                    <CardContent className="p-4">
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                          <h5 className="font-semibold text-slate-800 mb-1">{chapter.title}</h5>
                                          <p className="text-sm text-slate-600 mb-3">{chapter.description}</p>
                                          <div className="flex gap-4 text-xs text-slate-500 mb-3">
                                            <span className="flex items-center gap-1">
                                              <FileText className="h-3 w-3" />
                                              {chapter.totalPages} pages
                                            </span>
                                            <span className="flex items-center gap-1">
                                              <Target className="h-3 w-3" />
                                              {chapter.quizSegments?.length || 0} quizzes
                                            </span>
                                            <span className="flex items-center gap-1">
                                              <CheckCircle className="h-3 w-3" />
                                              {chapter.chapterTestFileUrl ? "Test available" : "No test"}
                                            </span>
                                          </div>
                                          {/* Quiz Segments */}
                                          {chapter.quizSegments && chapter.quizSegments.length > 0 && (
                                            <div className="space-y-2">
                                              <p className="text-xs font-semibold text-slate-700">Quiz Segments:</p>
                                              {chapter.quizSegments.map((quiz) => (
                                                <div
                                                  key={quiz.id}
                                                  className="flex items-center justify-between p-2 bg-white rounded-lg border border-purple-200"
                                                >
                                                  <span className="text-xs text-slate-600">
                                                    Pages {quiz.startPage}-{quiz.endPage}
                                                  </span>
                                                  <div className="flex gap-1">
                                                    <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() => handleEditQuiz(quiz, chapter.id, subject.id)}
                                                      className="h-6 w-6 p-0 text-purple-600 hover:bg-purple-100 rounded"
                                                    >
                                                      <Edit className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() => handleDeleteQuiz(subject.id, chapter.id, quiz.id)}
                                                      className="h-6 w-6 p-0 text-red-600 hover:bg-red-100 rounded"
                                                    >
                                                      <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg">
                                              <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end" className="rounded-xl shadow-lg">
                                            <DropdownMenuItem
                                              onClick={() => handleEditChapter(chapter)}
                                              className="rounded-lg"
                                            >
                                              <Edit className="h-4 w-4 mr-2" />
                                              Edit Chapter
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                              onClick={() => handleEditChapterTest(chapter)}
                                              className="rounded-lg"
                                            >
                                              <FileText className="h-4 w-4 mr-2" />
                                              Edit Chapter Test
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="rounded-lg">
                                              <Eye className="h-4 w-4 mr-2" />
                                              View Details
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                              onClick={() => handleDeleteChapter(subject.id, chapter.id, chapter.title)}
                                              className="text-red-600 rounded-lg"
                                            >
                                              <Trash2 className="h-4 w-4 mr-2" />
                                              Delete Chapter
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Mixed Exams Tab */}
              <TabsContent value="mixed-exams" className="mt-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800">Mixed Examinations</h3>
                    <p className="text-slate-600 mt-1">Comprehensive exams covering multiple subjects</p>
                  </div>
                  <Button
                    onClick={() => setShowAddMixedExamDialog(true)}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:bg-gradient-to-br hover:from-[#F9F6F1] hover:to-[#EFE9DC] hover:text-[#1E293B] text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3"
                  >
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Add Mixed Exam
                  </Button>
                </div>

                <div className="grid gap-6">
                  {grades.map((grade) => (
                    <Card key={grade.id} className="rounded-2xl border-slate-200 shadow-lg">
                      <CardHeader className="bg-gradient-to-r from-slate-50 to-orange-50">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl">
                            <Award className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-xl text-slate-800">{grade.title} - Mixed Examinations</CardTitle>
                            <CardDescription className="text-slate-600">
                              Semester and final examinations for {grade.title}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="grid md:grid-cols-3 gap-6">
                          {/* Semester 1 Exam */}
                          <Card className="rounded-xl border-blue-200 bg-blue-50/50 shadow-sm">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base text-blue-700 flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Semester 1 Exam
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                              {getMixedExamsForGrade(grade.id).find((e) => e.type === "semester1") ? (
                                <div className="space-y-3">
                                  {getMixedExamsForGrade(grade.id)
                                    .filter((e) => e.type === "semester1")
                                    .map((exam) => (
                                      <div
                                        key={exam.id}
                                        className="p-4 bg-white rounded-xl border border-blue-200 shadow-sm"
                                      >
                                        <h6 className="font-semibold text-slate-800 mb-2">{exam.title}</h6>
                                        <div className="text-sm text-slate-600 space-y-1 mb-3">
                                          <p className="flex items-center gap-2">
                                            <Clock className="h-3 w-3" />
                                            {exam.duration} minutes • {exam.totalMarks} marks
                                          </p>
                                          <p className="flex items-center gap-2">
                                            <BookOpen className="h-3 w-3" />
                                            {exam.subjectIds.length} subjects included
                                          </p>
                                          {exam.examFileName && (
                                            <p className="flex items-center gap-2 text-green-600">
                                              <CheckCircle className="h-3 w-3" />
                                              File: {exam.examFileName}
                                            </p>
                                          )}
                                        </div>
                                        <div className="flex gap-2">
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-xs h-8 bg-transparent border-blue-200 hover:bg-blue-50"
                                            onClick={() => handleEditMixedExam(exam)}
                                          >
                                            <Edit className="h-3 w-3 mr-1" />
                                            Edit
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-xs h-8 text-red-600 bg-transparent border-red-200 hover:bg-red-50"
                                            onClick={() => handleDeleteMixedExam(exam.id, exam.title)}
                                          >
                                            <Trash2 className="h-3 w-3 mr-1" />
                                            Delete
                                          </Button>
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              ) : (
                                <div className="text-center py-8">
                                  <div className="p-3 bg-blue-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                                    <FileText className="h-6 w-6 text-blue-500" />
                                  </div>
                                  <p className="text-sm text-slate-500 mb-3">No semester 1 exam</p>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setMixedExamForm({
                                        ...mixedExamForm,
                                        gradeId: grade.id,
                                        type: "semester1",
                                        title: `${grade.title} - Semester 1 Mixed Exam`,
                                      })
                                      setShowAddMixedExamDialog(true)
                                    }}
                                    className="text-xs h-8 rounded-xl border-blue-200 hover:bg-blue-50"
                                  >
                                    <PlusCircle className="h-3 w-3 mr-1" />
                                    Add Exam
                                  </Button>
                                </div>
                              )}
                            </CardContent>
                          </Card>

                          {/* Semester 2 Exam */}
                          <Card className="rounded-xl border-purple-200 bg-purple-50/50 shadow-sm">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base text-purple-700 flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Semester 2 Exam
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                              {getMixedExamsForGrade(grade.id).find((e) => e.type === "semester2") ? (
                                <div className="space-y-3">
                                  {getMixedExamsForGrade(grade.id)
                                    .filter((e) => e.type === "semester2")
                                    .map((exam) => (
                                      <div
                                        key={exam.id}
                                        className="p-4 bg-white rounded-xl border border-purple-200 shadow-sm"
                                      >
                                        <h6 className="font-semibold text-slate-800 mb-2">{exam.title}</h6>
                                        <div className="text-sm text-slate-600 space-y-1 mb-3">
                                          <p className="flex items-center gap-2">
                                            <Clock className="h-3 w-3" />
                                            {exam.duration} minutes • {exam.totalMarks} marks
                                          </p>
                                          <p className="flex items-center gap-2">
                                            <BookOpen className="h-3 w-3" />
                                            {exam.subjectIds.length} subjects included
                                          </p>
                                          {exam.examFileName && (
                                            <p className="flex items-center gap-2 text-green-600">
                                              <CheckCircle className="h-3 w-3" />
                                              File: {exam.examFileName}
                                            </p>
                                          )}
                                        </div>
                                        <div className="flex gap-2">
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-xs h-8 bg-transparent border-purple-200 hover:bg-purple-50"
                                            onClick={() => handleEditMixedExam(exam)}
                                          >
                                            <Edit className="h-3 w-3 mr-1" />
                                            Edit
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-xs h-8 text-red-600 bg-transparent border-red-200 hover:bg-red-50"
                                            onClick={() => handleDeleteMixedExam(exam.id, exam.title)}
                                          >
                                            <Trash2 className="h-3 w-3 mr-1" />
                                            Delete
                                          </Button>
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              ) : (
                                <div className="text-center py-8">
                                  <div className="p-3 bg-purple-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                                    <FileText className="h-6 w-6 text-purple-500" />
                                  </div>
                                  <p className="text-sm text-slate-500 mb-3">No semester 2 exam</p>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setMixedExamForm({
                                        ...mixedExamForm,
                                        gradeId: grade.id,
                                        type: "semester2",
                                        title: `${grade.title} - Semester 2 Mixed Exam`,
                                      })
                                      setShowAddMixedExamDialog(true)
                                    }}
                                    className="text-xs h-8 rounded-xl border-purple-200 hover:bg-purple-50"
                                  >
                                    <PlusCircle className="h-3 w-3 mr-1" />
                                    Add Exam
                                  </Button>
                                </div>
                              )}
                            </CardContent>
                          </Card>

                          {/* Final Exam */}
                          <Card className="rounded-xl border-red-200 bg-red-50/50 shadow-sm">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-base text-red-700 flex items-center gap-2">
                                <Award className="h-4 w-4" />
                                Final Exam
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                              {getMixedExamsForGrade(grade.id).find((e) => e.type === "final") ? (
                                <div className="space-y-3">
                                  {getMixedExamsForGrade(grade.id)
                                    .filter((e) => e.type === "final")
                                    .map((exam) => (
                                      <div
                                        key={exam.id}
                                        className="p-4 bg-white rounded-xl border border-red-200 shadow-sm"
                                      >
                                        <h6 className="font-semibold text-slate-800 mb-2">{exam.title}</h6>
                                        <div className="text-sm text-slate-600 space-y-1 mb-3">
                                          <p className="flex items-center gap-2">
                                            <Clock className="h-3 w-3" />
                                            {exam.duration} minutes • {exam.totalMarks} marks
                                          </p>
                                          <p className="flex items-center gap-2">
                                            <BookOpen className="h-3 w-3" />
                                            {exam.subjectIds.length} subjects included
                                          </p>
                                          {exam.examFileName && (
                                            <p className="flex items-center gap-2 text-green-600">
                                              <CheckCircle className="h-3 w-3" />
                                              File: {exam.examFileName}
                                            </p>
                                          )}
                                        </div>
                                        <div className="flex gap-2">
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-xs h-8 bg-transparent border-red-200 hover:bg-red-50"
                                            onClick={() => handleEditMixedExam(exam)}
                                          >
                                            <Edit className="h-3 w-3 mr-1" />
                                            Edit
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-xs h-8 text-red-600 bg-transparent border-red-200 hover:bg-red-50"
                                            onClick={() => handleDeleteMixedExam(exam.id, exam.title)}
                                          >
                                            <Trash2 className="h-3 w-3 mr-1" />
                                            Delete
                                          </Button>
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              ) : (
                                <div className="text-center py-8">
                                  <div className="p-3 bg-red-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                                    <FileText className="h-6 w-6 text-red-500" />
                                  </div>
                                  <p className="text-sm text-slate-500 mb-3">No final exam</p>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setMixedExamForm({
                                        ...mixedExamForm,
                                        gradeId: grade.id,
                                        type: "final",
                                        title: `${grade.title} - Final Mixed Exam`,
                                      })
                                      setShowAddMixedExamDialog(true)
                                    }}
                                    className="text-xs h-8 rounded-xl border-red-200 hover:bg-red-50"
                                  >
                                    <PlusCircle className="h-3 w-3 mr-1" />
                                    Add Exam
                                  </Button>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Add Grade Dialog */}
      <Dialog open={showAddGradeDialog} onOpenChange={setShowAddGradeDialog}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {editingGrade ? "Edit Grade" : "Add New Grade"}
            </DialogTitle>
            <DialogDescription>
              {editingGrade ? "Update grade information" : "Create a new grade level for students"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="gradeLevel">Grade Level</Label>
              <Input
                id="gradeLevel"
                placeholder="e.g., Grade 1, Pre-K, Kindergarten, Advanced Level"
                value={gradeForm.level}
                onChange={(e) => setGradeForm({ ...gradeForm, level: e.target.value })}
                className="rounded-xl"
              />
              <p className="text-xs text-gray-600">Enter any grade level name you want</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="gradeTitle">Grade Title</Label>
              <Input
                id="gradeTitle"
                placeholder="e.g., Grade 1, First Grade, Elementary Level"
                value={gradeForm.title}
                onChange={(e) => setGradeForm({ ...gradeForm, title: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="gradeDescription">Description (Optional)</Label>
              <Textarea
                id="gradeDescription"
                placeholder="Brief description of this grade level"
                value={gradeForm.description}
                onChange={(e) => setGradeForm({ ...gradeForm, description: e.target.value })}
                className="rounded-xl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleAddGrade}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl"
            >
              {editingGrade ? "Update Grade" : "Add Grade"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Subject Dialog */}
      <Dialog open={showAddSubjectDialog} onOpenChange={setShowAddSubjectDialog}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {editingSubject ? "Edit Subject" : "Add New Subject"}
            </DialogTitle>
            <DialogDescription>
              {editingSubject ? "Update subject information" : "Create a new subject for the selected grade"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="subjectGrade">Select Grade</Label>
              <Select
                value={selectedGradeForSubject || subjectForm.gradeId}
                onValueChange={(value) => {
                  setSubjectForm({ ...subjectForm, gradeId: value })
                  setSelectedGradeForSubject(value)
                }}
                disabled={!!selectedGradeForSubject && !editingSubject}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {grades.map((grade) => (
                    <SelectItem key={grade.id} value={grade.id}>
                      {grade.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subjectTitle">Subject Title</Label>
              <Input
                id="subjectTitle"
                placeholder="e.g., Mathematics Fundamentals, Advanced Physics"
                value={subjectForm.title}
                onChange={(e) => setSubjectForm({ ...subjectForm, title: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subjectName">Subject Name</Label>
              <Input
                id="subjectName"
                placeholder="e.g., Mathematics, English, Science, History, Art"
                value={subjectForm.name}
                onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })}
                className="rounded-xl"
              />
              <p className="text-xs text-gray-600">Enter any subject name you want</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subjectDescription">Description (Optional)</Label>
              <Textarea
                id="subjectDescription"
                placeholder="Brief description of the subject"
                value={subjectForm.description}
                onChange={(e) => setSubjectForm({ ...subjectForm, description: e.target.value })}
                className="rounded-xl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleAddSubject}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl"
            >
              {editingSubject ? "Update Subject" : "Add Subject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Chapter Dialog */}
      <Dialog open={showAddChapterDialog} onOpenChange={setShowAddChapterDialog}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Add New Chapter
            </DialogTitle>
            <DialogDescription>Create a new chapter with custom quiz segments</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="chapterGrade">Select Grade</Label>
              <Select
                value={chapterForm.gradeId}
                onValueChange={(value) => setChapterForm({ ...chapterForm, gradeId: value })}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {grades.map((grade) => (
                    <SelectItem key={grade.id} value={grade.id}>
                      {grade.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="chapterSubjectName">Subject Name</Label>
              <Input
                id="chapterSubjectName"
                placeholder="e.g., Mathematics, English, Science"
                value={chapterForm.subjectName}
                onChange={(e) => setChapterForm({ ...chapterForm, subjectName: e.target.value })}
                className="rounded-xl"
              />
              <p className="text-xs text-gray-600">
                Enter subject name. If subject doesn't exist, it will be created automatically.
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="chapterSemester">Semester</Label>
              <Select
                value={chapterForm.semester}
                onValueChange={(value: "1" | "2") => setChapterForm({ ...chapterForm, semester: value })}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="1">Semester 1</SelectItem>
                  <SelectItem value="2">Semester 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="chapterTitle">Chapter Title</Label>
              <Input
                id="chapterTitle"
                placeholder="e.g., Introduction to Numbers"
                value={chapterForm.title}
                onChange={(e) => setChapterForm({ ...chapterForm, title: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="chapterDescription">Description (Optional)</Label>
              <Textarea
                id="chapterDescription"
                placeholder="Brief description of the chapter"
                value={chapterForm.description}
                onChange={(e) => setChapterForm({ ...chapterForm, description: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="chapterPages">Total Pages</Label>
              <Input
                id="chapterPages"
                type="number"
                placeholder="e.g., 20"
                value={chapterForm.totalPages}
                onChange={(e) => setChapterForm({ ...chapterForm, totalPages: e.target.value })}
                className="rounded-xl"
                min="1"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="readingFile">Reading Material (PDF/DOCX)</Label>
              <Input
                id="readingFile"
                type="file"
                accept=".pdf,.docx"
                onChange={(e) => setChapterForm({ ...chapterForm, readingFile: e.target.files?.[0] || null })}
                className="rounded-xl"
              />
            </div>

            {/* Quiz Segments Section */}
            <div className="space-y-4 mt-6 p-4 border rounded-xl bg-slate-50">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-800">Quiz Segments</h3>
                <Button type="button" variant="outline" onClick={addQuizSegment} className="bg-transparent">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Quiz
                </Button>
              </div>

              {chapterForm.quizSegments.length === 0 && (
                <p className="text-sm text-gray-500">Add quiz segments to define quizzes for specific page ranges.</p>
              )}

              {chapterForm.quizSegments.map((quiz, index) => (
                <div
                  key={quiz.id}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end border-t pt-4 first:border-t-0 first:pt-0"
                >
                  <div className="grid gap-2">
                    <Label htmlFor={`startPage-${quiz.id}`}>Start Page</Label>
                    <Input
                      id={`startPage-${quiz.id}`}
                      type="number"
                      value={quiz.startPage}
                      onChange={(e) => updateQuizSegment(quiz.id, "startPage", e.target.value)}
                      min="1"
                      placeholder="1"
                      className="rounded-xl"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`endPage-${quiz.id}`}>End Page</Label>
                    <Input
                      id={`endPage-${quiz.id}`}
                      type="number"
                      value={quiz.endPage}
                      onChange={(e) => updateQuizSegment(quiz.id, "endPage", e.target.value)}
                      min={Number(quiz.startPage) || 1}
                      placeholder="5"
                      className="rounded-xl"
                    />
                  </div>
                  <div className="grid gap-2 col-span-2">
                    <Label htmlFor={`quizFile-${quiz.id}`}>Quiz File (PDF/DOCX/JSON/CSV)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id={`quizFile-${quiz.id}`}
                        type="file"
                        accept=".pdf,.docx,.json,.csv"
                        onChange={(e) => updateQuizSegment(quiz.id, "quizFile", e.target.files?.[0] || null)}
                        className="rounded-xl"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeQuizSegment(quiz.id)}
                        className="shrink-0"
                      >
                        <XCircle className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Remove quiz segment</span>
                      </Button>
                    </div>
                    {quiz.quizFile && <p className="text-sm text-muted-foreground">Selected: {quiz.quizFile.name}</p>}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="chapterTestFile">Chapter Test File (Optional)</Label>
              <Input
                id="chapterTestFile"
                type="file"
                accept=".pdf,.docx,.json,.csv"
                onChange={(e) => setChapterForm({ ...chapterForm, chapterTestFile: e.target.files?.[0] || null })}
                className="rounded-xl"
              />
              <p className="text-xs text-gray-600">Upload the comprehensive test for this chapter</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="postChapterText">Post-Chapter Text (Optional)</Label>
              <Textarea
                id="postChapterText"
                placeholder="Text to display after chapter completion"
                value={chapterForm.postChapterText}
                onChange={(e) => setChapterForm({ ...chapterForm, postChapterText: e.target.value })}
                className="rounded-xl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleAddChapter}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-xl"
            >
              Add Chapter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Chapter Dialog */}
      <Dialog open={showEditChapterDialog} onOpenChange={setShowEditChapterDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Edit Chapter
            </DialogTitle>
            <DialogDescription>Update chapter information and files</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="editChapterTitle">Chapter Title</Label>
              <Input
                id="editChapterTitle"
                placeholder="e.g., Introduction to Numbers"
                value={editChapterForm.title}
                onChange={(e) => setEditChapterForm({ ...editChapterForm, title: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editChapterDescription">Description (Optional)</Label>
              <Textarea
                id="editChapterDescription"
                placeholder="Brief description of the chapter"
                value={editChapterForm.description}
                onChange={(e) => setEditChapterForm({ ...editChapterForm, description: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editChapterPages">Total Pages</Label>
              <Input
                id="editChapterPages"
                type="number"
                placeholder="e.g., 20"
                value={editChapterForm.totalPages}
                onChange={(e) => setEditChapterForm({ ...editChapterForm, totalPages: e.target.value })}
                className="rounded-xl"
                min="1"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editChapterSemester">Semester</Label>
              <Select
                value={editChapterForm.semester}
                onValueChange={(value: "1" | "2") => setEditChapterForm({ ...editChapterForm, semester: value })}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="1">Semester 1</SelectItem>
                  <SelectItem value="2">Semester 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editReadingFile">Reading Material (PDF/DOCX)</Label>
              <Input
                id="editReadingFile"
                type="file"
                accept=".pdf,.docx"
                onChange={(e) => setEditChapterForm({ ...editChapterForm, readingFile: e.target.files?.[0] || null })}
                className="rounded-xl"
              />
              {editChapterForm.currentReadingFileName && (
                <p className="text-xs text-gray-600">Current file: {editChapterForm.currentReadingFileName}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editChapterTestFile">Chapter Test File (Optional)</Label>
              <Input
                id="editChapterTestFile"
                type="file"
                accept=".pdf,.docx,.json,.csv"
                onChange={(e) =>
                  setEditChapterForm({ ...editChapterForm, chapterTestFile: e.target.files?.[0] || null })
                }
                className="rounded-xl"
              />
              {editChapterForm.currentChapterTestFileName && (
                <p className="text-xs text-gray-600">Current file: {editChapterForm.currentChapterTestFileName}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editPostChapterText">Post-Chapter Text (Optional)</Label>
              <Textarea
                id="editPostChapterText"
                placeholder="Text to display after chapter completion"
                value={editChapterForm.postChapterText}
                onChange={(e) => setEditChapterForm({ ...editChapterForm, postChapterText: e.target.value })}
                className="rounded-xl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleUpdateChapter}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-xl"
            >
              Update Chapter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Quiz Dialog */}
      <Dialog open={showEditQuizDialog} onOpenChange={setShowEditQuizDialog}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Edit Quiz Segment
            </DialogTitle>
            <DialogDescription>Update quiz segment information and file</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="editQuizStartPage">Start Page</Label>
                <Input
                  id="editQuizStartPage"
                  type="number"
                  placeholder="e.g., 1"
                  value={editQuizForm.startPage}
                  onChange={(e) => setEditQuizForm({ ...editQuizForm, startPage: e.target.value })}
                  className="rounded-xl"
                  min="1"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editQuizEndPage">End Page</Label>
                <Input
                  id="editQuizEndPage"
                  type="number"
                  placeholder="e.g., 5"
                  value={editQuizForm.endPage}
                  onChange={(e) => setEditQuizForm({ ...editQuizForm, endPage: e.target.value })}
                  className="rounded-xl"
                  min="1"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editQuizFile">Quiz File (PDF/DOCX/JSON/CSV)</Label>
              <Input
                id="editQuizFile"
                type="file"
                accept=".pdf,.docx,.json,.csv"
                onChange={(e) => setEditQuizForm({ ...editQuizForm, quizFile: e.target.files?.[0] || null })}
                className="rounded-xl"
              />
              {editQuizForm.currentQuizFileName && (
                <p className="text-xs text-gray-600">Current file: {editQuizForm.currentQuizFileName}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleUpdateQuiz}
              className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white rounded-xl"
            >
              Update Quiz
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Chapter Test Dialog */}
      <Dialog open={showEditChapterTestDialog} onOpenChange={setShowEditChapterTestDialog}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Edit Chapter Test
            </DialogTitle>
            <DialogDescription>Update chapter test file</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="editChapterTestFileOnly">Chapter Test File</Label>
              <Input
                id="editChapterTestFileOnly"
                type="file"
                accept=".pdf,.docx,.json,.csv"
                onChange={(e) =>
                  setEditChapterTestForm({ ...editChapterTestForm, chapterTestFile: e.target.files?.[0] || null })
                }
                className="rounded-xl"
              />
              {editChapterTestForm.currentChapterTestFileName && (
                <p className="text-xs text-gray-600">Current file: {editChapterTestForm.currentChapterTestFileName}</p>
              )}
              <p className="text-xs text-gray-600">Upload the comprehensive test for this chapter</p>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleUpdateChapterTest}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:bg-gradient-to-br hover:from-[#F9F6F1] hover:to-[#EFE9DC] hover:text-[#1E293B] text-white rounded-xl"
            >
              Update Chapter Test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Mixed Exam Dialog */}
      <Dialog open={showAddMixedExamDialog} onOpenChange={setShowAddMixedExamDialog}>
        <DialogContent className="sm:max-w-[600px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Add Mixed Examination
            </DialogTitle>
            <DialogDescription>Create a comprehensive exam covering multiple subjects</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="examGrade">Select Grade</Label>
              <Select
                value={mixedExamForm.gradeId}
                onValueChange={(value) => setMixedExamForm({ ...mixedExamForm, gradeId: value })}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {grades.map((grade) => (
                    <SelectItem key={grade.id} value={grade.id}>
                      {grade.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="examType">Exam Type</Label>
              <Select
                value={mixedExamForm.type}
                onValueChange={(value: "semester1" | "semester2" | "final") =>
                  setMixedExamForm({ ...mixedExamForm, type: value })
                }
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select exam type" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="semester1">Semester 1 Exam</SelectItem>
                  <SelectItem value="semester2">Semester 2 Exam</SelectItem>
                  <SelectItem value="final">Final Exam</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="examTitle">Exam Title</Label>
              <Input
                id="examTitle"
                placeholder="e.g., Grade 1 - Semester 1 Mixed Exam"
                value={mixedExamForm.title}
                onChange={(e) => setMixedExamForm({ ...mixedExamForm, title: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="examDuration">Duration (minutes)</Label>
                <Input
                  id="examDuration"
                  type="number"
                  placeholder="e.g., 60"
                  value={mixedExamForm.duration}
                  onChange={(e) => setMixedExamForm({ ...mixedExamForm, duration: e.target.value })}
                  className="rounded-xl"
                  min="1"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="examMarks">Total Marks</Label>
                <Input
                  id="examMarks"
                  type="number"
                  placeholder="e.g., 100"
                  value={mixedExamForm.totalMarks}
                  onChange={(e) => setMixedExamForm({ ...mixedExamForm, totalMarks: e.target.value })}
                  className="rounded-xl"
                  min="1"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="examFile">Exam File (Optional)</Label>
              <Input
                id="examFile"
                type="file"
                accept=".pdf,.docx,.json,.csv"
                onChange={(e) => setMixedExamForm({ ...mixedExamForm, examFile: e.target.files?.[0] || null })}
                className="rounded-xl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleAddMixedExam}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:bg-gradient-to-br hover:from-[#F9F6F1] hover:to-[#EFE9DC] hover:text-[#1E293B] text-white rounded-xl"
            >
              Add Mixed Exam
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Mixed Exam Dialog */}
      <Dialog open={showEditMixedExamDialog} onOpenChange={setShowEditMixedExamDialog}>
        <DialogContent className="sm:max-w-[600px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Edit Mixed Examination
            </DialogTitle>
            <DialogDescription>Update mixed exam information and file</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="editExamGrade">Select Grade</Label>
              <Select
                value={editMixedExamForm.gradeId}
                onValueChange={(value) => setEditMixedExamForm({ ...editMixedExamForm, gradeId: value })}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {grades.map((grade) => (
                    <SelectItem key={grade.id} value={grade.id}>
                      {grade.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editExamType">Exam Type</Label>
              <Select
                value={editMixedExamForm.type}
                onValueChange={(value: "semester1" | "semester2" | "final") =>
                  setEditMixedExamForm({ ...editMixedExamForm, type: value })
                }
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select exam type" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="semester1">Semester 1 Exam</SelectItem>
                  <SelectItem value="semester2">Semester 2 Exam</SelectItem>
                  <SelectItem value="final">Final Exam</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editExamTitle">Exam Title</Label>
              <Input
                id="editExamTitle"
                placeholder="e.g., Grade 1 - Semester 1 Mixed Exam"
                value={editMixedExamForm.title}
                onChange={(e) => setEditMixedExamForm({ ...editMixedExamForm, title: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="editExamDuration">Duration (minutes)</Label>
                <Input
                  id="editExamDuration"
                  type="number"
                  placeholder="e.g., 60"
                  value={editMixedExamForm.duration}
                  onChange={(e) => setEditMixedExamForm({ ...editMixedExamForm, duration: e.target.value })}
                  className="rounded-xl"
                  min="1"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editExamMarks">Total Marks</Label>
                <Input
                  id="editExamMarks"
                  type="number"
                  placeholder="e.g., 100"
                  value={editMixedExamForm.totalMarks}
                  onChange={(e) => setEditMixedExamForm({ ...editMixedExamForm, totalMarks: e.target.value })}
                  className="rounded-xl"
                  min="1"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editExamFile">Exam File (Optional)</Label>
              <Input
                id="editExamFile"
                type="file"
                accept=".pdf,.docx,.json,.csv"
                onChange={(e) => setEditMixedExamForm({ ...editMixedExamForm, examFile: e.target.files?.[0] || null })}
                className="rounded-xl"
              />
              {editMixedExamForm.currentExamFileName && (
                <p className="text-xs text-gray-600">Current file: {editMixedExamForm.currentExamFileName}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleUpdateMixedExam}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:bg-gradient-to-br hover:from-[#F9F6F1] hover:to-[#EFE9DC] hover:text-[#1E293B] text-white rounded-xl"
            >
              Update Mixed Exam
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Chapter Exam Dialog */}
      <Dialog open={showAddChapterExamDialog} onOpenChange={setShowAddChapterExamDialog}>
        <DialogContent className="sm:max-w-[600px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              Add Chapter Examination
            </DialogTitle>
            <DialogDescription>Create an exam for a specific chapter</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="chapterExamGrade">Select Grade</Label>
              <Select
                value={chapterExamForm.gradeId}
                onValueChange={(value) => {
                  setChapterExamForm({ ...chapterExamForm, gradeId: value, subjectId: "", chapterId: "" })
                }}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {grades.map((grade) => (
                    <SelectItem key={grade.id} value={grade.id}>
                      {grade.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="chapterExamSubject">Select Subject</Label>
              <Select
                value={chapterExamForm.subjectId}
                onValueChange={(value) => {
                  setChapterExamForm({ ...chapterExamForm, subjectId: value, chapterId: "" })
                }}
                disabled={!chapterExamForm.gradeId}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {getSubjectsForGrade(chapterExamForm.gradeId).map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="chapterExamChapter">Select Chapter</Label>
              <Select
                value={chapterExamForm.chapterId}
                onValueChange={(value) => setChapterExamForm({ ...chapterExamForm, chapterId: value })}
                disabled={!chapterExamForm.subjectId}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Select chapter" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {getChaptersForSubject(chapterExamForm.subjectId).map((chapter) => (
                    <SelectItem key={chapter.id} value={chapter.id}>
                      {chapter.title} (Semester {chapter.semester})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="chapterExamTitle">Exam Title</Label>
              <Input
                id="chapterExamTitle"
                placeholder="e.g., Introduction to Numbers - Chapter Exam"
                value={chapterExamForm.title}
                onChange={(e) => setChapterExamForm({ ...chapterExamForm, title: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="chapterExamDuration">Duration (minutes)</Label>
                <Input
                  id="chapterExamDuration"
                  type="number"
                  placeholder="e.g., 30"
                  value={chapterExamForm.duration}
                  onChange={(e) => setChapterExamForm({ ...chapterExamForm, duration: e.target.value })}
                  className="rounded-xl"
                  min="1"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="chapterExamMarks">Total Marks</Label>
                <Input
                  id="chapterExamMarks"
                  type="number"
                  placeholder="e.g., 50"
                  value={chapterExamForm.totalMarks}
                  onChange={(e) => setChapterExamForm({ ...chapterExamForm, totalMarks: e.target.value })}
                  className="rounded-xl"
                  min="1"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="chapterExamFile">Exam File (Optional)</Label>
              <Input
                id="chapterExamFile"
                type="file"
                accept=".pdf,.docx,.json,.csv"
                onChange={(e) => setChapterExamForm({ ...chapterExamForm, examFile: e.target.files?.[0] || null })}
                className="rounded-xl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleAddChapterExam}
              className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white rounded-xl"
            >
              Add Chapter Exam
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
