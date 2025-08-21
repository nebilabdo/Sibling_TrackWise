"use client"
import React, { useState } from "react" // Explicitly import React
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Target, BookOpen, Trophy, Clock, ChevronLeft, CheckCircle, X, BarChart, FlaskConical, Book, Landmark } from 'lucide-react'
import { useRouter } from "next/navigation"

// Define subjects array with correct properties
const subjects = [
  {
    id: "math",
    name: "Mathematics",
    icon: BarChart,
    accentGradient: "from-[#B5EEDC] via-[#A2E7C9] to-[#89E1B8]", // warm coral
    bgColor: "bg-[#E8FDEF]", // soft light green background
   
  },
  {
    id: "science",
    name: "Science",
    icon: FlaskConical,
    accentGradient: "from-[#7DD3FC] via-[#38BDF8] to-[#0EA5E9]", // vibrant blue
    bgColor: "bg-[#E8F6FF]", // clean bluish background
    
  },
  {
    id: "english",
    name: "English",
    icon: Book,
    accentGradient: "from-[#D2B48C] via-[#F3E5AB] to-[#FFF8E1]", // soft yellow-tan
    bgColor: "bg-[#F9F3E8]", // warm light background
    
  },
  {
    id: "history",
    name: "History",
    icon: Landmark,
    accentGradient: "from-[#a7a2a9] via-[#c6b8ae] to-[#f1e9e5]", // subtle vintage blend
    bgColor: "bg-[#F5F2F4]", // soft light gray-pink
   
  },
]


// Define practiceExams array
const practiceExams = [
  { id: "basic", title: "Basic Level", questions: 10, timeLimit: "20 min" },
  { id: "intermediate", title: "Intermediate Level", questions: 15, timeLimit: "30 min" },
  { id: "advanced", title: "Advanced Level", questions: 20, timeLimit: "40 min" },
]

// Main PracticeExamsPage component
export default function PracticeExamsPage() {
  const router = useRouter()
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [selectedExam, setSelectedExam] = useState<string | null>(null)

  // Conditional rendering for when a subject and exam are selected
  if (selectedSubject && selectedExam) {
    return (
      <PracticeExamComponent
        subjectId={selectedSubject}
        examId={selectedExam}
        onBack={() => {
          setSelectedExam(null)
          setSelectedSubject(null)
        }}
      />
    )
  }

  // Conditional rendering for when only a subject is selected
  if (selectedSubject) {
    const subject = subjects.find((s) => s.id === selectedSubject)!
    return (
      <div className="p-6 space-y-6 bg-gradient-to-br from-white to-gray-50 min-h-screen">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => setSelectedSubject(null)} className="text-gray-600 hover:text-blue-600">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Subjects
          </Button>
          <div className={`bg-gradient-to-r ${subject.accentGradient} rounded-2xl p-6 text-white flex-1 shadow-xl`}>
            <div className="flex items-center gap-4">
              <div className="text-4xl">
                <subject.icon className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{subject.name} Practice Exams</h1>
                <p className="text-white/80">Choose your difficulty level</p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {practiceExams.map((exam) => (
            <Card key={exam.id} className="chapter-card hover:scale-105 transition-transform shadow-md border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900">
                  <Target className="w-5 h-5 text-blue-600" />
                  {exam.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span>{exam.questions} questions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>{exam.timeLimit}</span>
                  </div>
                </div>
                <Button onClick={() => setSelectedExam(exam.id)} className={`w-full bg-gradient-to-r ${subject.accentGradient} hover:from-blue-700 hover:to-blue-900`}>
                  Start Practice Exam
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Default rendering for the main practice exams page (no subject selected)
  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-white to-gray-50 min-h-screen">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => router.push("/child/dashboard")} className="flex items-center gap-2 mb-4 text-gray-600 hover:text-blue-600">
        <ChevronLeft className="w-4 h-4" />
        Back to Dashboard
      </Button>

      {/* Header */}
      <div className="bg-gradient-to-r from-[#94A3B8] via-[#CBD5E1] to-[#E2E8F0]
 rounded-2xl p-6 text-white shadow-xl">
          <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-[#4B5563] via-[#F97316] to-[#FDBA74] bg-clip-text text-transparent leading-tight">
Practice Exams</h1>
        <p className="text-gray-300">Practice with exam-style questions for each subject</p>
      </div>

      {/* Info Card */}
      <Card className="shadow-xl border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Trophy className="w-5 h-5 text-blue-600" />
            How Practice Exams Work
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-4 rounded-lg shadow-inner border bg-[#E5F0FF] ">
              <h4 className="font-semibold text-gray-900 mb-2">Always Available</h4>
              <p className="text-gray-600">Practice exams are always accessible for all subjects</p>
            </div>
            <div className="p-4 rounded-lg shadow-inner border bg-[#F9F3E8] ">
              <h4 className="font-semibold text-gray-900 mb-2">First Score Counts</h4>
              <p className="text-gray-600">Only your first attempt score is recorded</p>
            </div>
            <div className="p-4 rounded-lg shadow-inner border bg-[#E8FDEF] ">
              <h4 className="font-semibold text-gray-900 mb-2">Unlimited Retakes</h4>
              <p className="text-gray-600">Practice as many times as you want</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {subjects.map((subject) => (
          <Card
            key={subject.id}
            className={`group hover:scale-105 transition-transform duration-300 shadow-2xl ${subject.bgColor} ${subject.borderColor} rounded-2xl`}
          >
            <CardHeader className="pb-3">
              <div className={`w-14 h-14 rounded-lg bg-gradient-to-r ${subject.accentGradient} flex items-center justify-center text-white text-2xl mb-3 shadow-xl transition-transform duration-300 group-hover:scale-110`}>
                <subject.icon className="w-8 h-8" />
              </div>
              <CardTitle className="text-xl font-bold text-[#2D3748]">{subject.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-base text-[#64748B]">Practice exams available at all difficulty levels</div>
              <Button
                onClick={() => setSelectedSubject(subject.id)}
                className={`w-full bg-gradient-to-r ${subject.accentGradient} hover:from-blue-700 hover:to-blue-900 shadow-md hover:shadow-lg transition-all duration-300`}
              >
                Start Practice
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// PracticeExamComponent for individual exam sessions
function PracticeExamComponent({
  subjectId,
  examId,
  onBack,
}: {
  subjectId: string
  examId: string
  onBack: () => void
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const [testStarted, setTestStarted] = useState(false)
  const [firstAttempt, setFirstAttempt] = useState(true)

  // Mock practice questions (these should ideally come from a data source based on subjectId and examId)
  const practiceQuestions = [
    {
      question: "Sample practice question for this subject?",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correct: 1,
      explanation: "This is the explanation for the correct answer.",
    },
    {
      question: "Another practice question to test understanding?",
      options: ["Choice 1", "Choice 2", "Choice 3", "Choice 4"],
      correct: 2,
      explanation: "Detailed explanation of why this answer is correct.",
    },
    {
      question: "Third practice question for comprehensive testing?",
      options: ["Answer A", "Answer B", "Answer C", "Answer D"],
      correct: 0,
      explanation: "Complete explanation with reasoning and context.",
    },
  ]

  const subject = subjects.find((s) => s.id === subjectId)!
  const exam = practiceExams.find((e) => e.id === examId)!

  const handleStartTest = () => {
    setTestStarted(true)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < practiceQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      setShowResults(true)
      if (firstAttempt) {
        // In a real application, you would save the score here
        setFirstAttempt(false)
      }
    }
  }

  const calculateScore = () => {
    let correct = 0
    practiceQuestions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct) {
        correct++
      }
    })
    return Math.round((correct / practiceQuestions.length) * 100)
  }

  // Render initial test information before starting
  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl shadow-2xl border-gray-200">
          <CardHeader className="text-center">
            <Button variant="ghost" onClick={onBack} className="self-start mb-4 text-gray-600 hover:text-blue-600">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Practice Exams
            </Button>
            <div className={`w-16 h-16 bg-gradient-to-br ${subject.accentGradient} rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl shadow-lg`}>
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl text-gray-900">{subject.name} - {exam.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-gray-600">
                Practice exam for {subject.name} at {exam.title.toLowerCase()} level
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-inner">
                <h4 className="font-semibold text-gray-900 mb-2">Exam Information</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• {exam.questions} questions</li>
                  <li>• Time limit: {exam.timeLimit}</li>
                  <li>
                    •{" "}
                    {firstAttempt ? "First attempt - score will be recorded" : "Practice attempt - score not recorded"}
                  </li>
                  <li>• Review explanations after completion</li>
                </ul>
              </div>
            </div>
            <Button
              onClick={handleStartTest}
              className={`w-full h-12 bg-gradient-to-r ${subject.accentGradient} hover:from-blue-700 hover:to-blue-900`}
            >
              {firstAttempt ? "Start Exam (Recorded)" : "Start Practice"}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render results after test completion
  if (showResults) {
    const score = calculateScore()
    const correctAnswers = selectedAnswers.filter((answer, index) => answer === practiceQuestions[index].correct).length
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <Button variant="ghost" onClick={onBack} className="mb-4 text-gray-600 hover:text-blue-600">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Practice Exams
          </Button>

          {/* Results Header */}
          <Card className="shadow-2xl border-gray-200">
            <CardHeader className="text-center">
              <div className={`w-16 h-16 bg-gradient-to-br ${subject.accentGradient} rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl shadow-lg`}>
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-900">Practice Exam Complete!</CardTitle>
              {!firstAttempt && <Badge variant="secondary" className="bg-gray-200 text-gray-600 border-gray-300">Practice Attempt</Badge>}
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-4xl font-bold text-blue-600 mb-2">{score}%</div>
              <p className="text-gray-600">
                You got {correctAnswers} out of {practiceQuestions.length} questions correct
              </p>
            </CardContent>
          </Card>

          {/* Question Review */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Review Your Answers</h3>
            {practiceQuestions.map((question, index) => {
              const userAnswer = selectedAnswers[index]
              const isCorrect = userAnswer === question.correct
              return (
                <Card key={index} className={`border-l-4 ${isCorrect ? "border-l-green-500" : "border-l-red-500"} shadow-md border-gray-200`}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2 text-gray-900">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <X className="w-5 h-5 text-red-500" />
                      )}
                      <span className="font-semibold">Question {index + 1}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="font-medium text-gray-900">{question.question}</p>
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`p-3 rounded-lg border ${
                            optionIndex === question.correct
                              ? "bg-green-50 border-green-300 text-green-800"
                              : userAnswer === optionIndex
                              ? "bg-red-50 border-red-300 text-red-800"
                              : "bg-gray-50 border-gray-200 text-gray-900"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{option}</span>
                            <div className="flex gap-2">
                              {optionIndex === question.correct && (
                                <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                                  Correct
                                </Badge>
                              )}
                              {userAnswer === optionIndex && optionIndex !== question.correct && (
                                <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
                                  Your Answer
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 shadow-inner">
                      <h5 className="font-semibold text-gray-900 mb-1">Explanation:</h5>
                      <p className="text-gray-600 text-sm">{question.explanation}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => {
                setTestStarted(false)
                setCurrentQuestion(0)
                setSelectedAnswers([])
                setShowResults(false)
              }}
              variant="outline"
              className="text-gray-600 hover:text-blue-600 border-gray-200 hover:border-blue-600"
            >
              Practice Again
            </Button>
            <Button onClick={onBack} className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white">Back to Practice Exams</Button>
          </div>
        </div>
      </div>
    )
  }

  // Render the active test questions
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-2xl border-gray-200">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl text-gray-900">{subject.name} - {exam.title}</CardTitle>
                {!firstAttempt && (
                  <Badge variant="secondary" className="mt-2 bg-gray-200 text-gray-600 border-gray-300">
                    Practice Mode
                  </Badge>
                )}
              </div>
              <Badge variant="secondary" className="bg-gray-200 text-gray-600 border-gray-300">
                Question {currentQuestion + 1} of {practiceQuestions.length}
              </Badge>
            </div>
            <Progress value={((currentQuestion + 1) / practiceQuestions.length) * 100} className="h-2 bg-blue-600" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">{practiceQuestions[currentQuestion].question}</h3>
              <div className="space-y-3">
                {practiceQuestions[currentQuestion].options.map((option, index) => (
                  <Button
                    key={index}
                    variant={selectedAnswers[currentQuestion] === index ? "default" : "outline"}
                    className={`w-full text-left justify-start h-auto p-4 text-lg font-medium transition-all duration-200 ${selectedAnswers[currentQuestion] === index
                        ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg"
                        : "bg-gray-50 text-gray-900 hover:bg-gray-100 border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleAnswerSelect(index)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex justify-between"> {/* Added a div wrapper for the buttons */}
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion((prev) => prev - 1)}
                disabled={currentQuestion === 0}
                className="text-gray-600 hover:text-blue-600 border-gray-200 hover:border-blue-600"
              >
                Previous
              </Button>
              <Button onClick={handleNext} disabled={selectedAnswers[currentQuestion] === undefined}
                className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold"
              >
                {currentQuestion === practiceQuestions.length - 1 ? "Finish Exam" : "Next"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
