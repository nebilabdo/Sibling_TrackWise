"use client"
import { RefreshCw, Trophy, AlertCircle, CheckCircle, X, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useProgress } from "@/contexts/ProgressContext"
import { useTimer } from "@/contexts/TimerContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion, AnimatePresence } from "framer-motion"

const testQuestions = [
  {
    question: "What is the fundamental principle discussed in this chapter?",
    options: [
      "Basic understanding of core concepts",
      "Advanced mathematical formulas",
      "Historical background information",
      "Future technological developments",
    ],
    correct: 0,
    explanation:
      "The chapter focuses on building fundamental understanding of core concepts as the foundation for advanced learning.",
  },
  {
    question: "Which approach is most effective for problem-solving?",
    options: [
      "Random trial and error",
      "Systematic step-by-step method",
      "Guessing based on intuition",
      "Copying from external sources",
    ],
    correct: 1,
    explanation: "A systematic step-by-step approach ensures thorough understanding and consistent results.",
  },
  {
    question: "What should you do when encountering difficult concepts?",
    options: [
      "Skip them entirely",
      "Review prerequisites and practice",
      "Memorize without understanding",
      "Ask for direct answers",
    ],
    correct: 1,
    explanation:
      "Reviewing prerequisites and practicing helps build the foundation needed to understand difficult concepts.",
  },
  {
    question: "How can you best retain the information learned?",
    options: [
      "Read once and move on",
      "Regular review and application",
      "Highlight everything important",
      "Take extensive notes only",
    ],
    correct: 1,
    explanation:
      "Regular review and practical application help transfer knowledge from short-term to long-term memory.",
  },
  {
    question: "What is the key to mastering this subject?",
    options: [
      "Speed over accuracy",
      "Consistent practice and understanding",
      "Memorizing all formulas",
      "Completing assignments quickly",
    ],
    correct: 1,
    explanation: "Consistent practice combined with deep understanding creates lasting mastery of the subject.",
  },
]

export default function ChapterTestPage() {
  const params = useParams()
  const router = useRouter()
  const subjectId = params.subjectId as string
  const chapterId = params.chapterId as string

  const { getChapterProgress, updateChapterProgress } = useProgress()
  const { setQuizMode, formatTime, dailyTime } = useTimer()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const [testStarted, setTestStarted] = useState(false)
  const [currentAttempt, setCurrentAttempt] = useState(0)
  const [testTimeRemaining, setTestTimeRemaining] = useState(1800)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const chapterProgress = getChapterProgress(subjectId, chapterId)

  // Unified button styling
  const baseButtonStyle = "flex items-center gap-2 bg-gradient-to-r from-[#94A3B8] via-[#CBD5E1] to-[#E2E8F0] hover:from-[#8A99AE] hover:via-[#C1CBD7] hover:to-[#D8E0E8] text-white shadow-md hover:shadow-lg transition-all duration-300 rounded-lg px-4 py-2"

  useEffect(() => {
    setQuizMode(true)
    return () => {
      setQuizMode(false)
    }
  }, [setQuizMode])

  const handleStartTest = () => {
    setTestStarted(true)
    setCurrentAttempt(chapterProgress.testAttempts + 1)
    updateChapterProgress(subjectId, chapterId, {
      testAttempts: chapterProgress.testAttempts + 1,
    })
  }

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const smoothQuestionChange = (direction: 'next' | 'prev') => {
    if (isTransitioning) return
    setIsTransitioning(true)
    
    setTimeout(() => {
      if (direction === 'next') {
        if (currentQuestion < testQuestions.length - 1) {
          setCurrentQuestion(prev => prev + 1)
        } else {
          setShowResults(true)
        }
      } else {
        if (currentQuestion > 0) {
          setCurrentQuestion(prev => prev - 1)
        }
      }
      setIsTransitioning(false)
    }, 200)
  }

  const calculateScore = () => {
    let correct = 0
    testQuestions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct) {
        correct++
      }
    })
    return Math.round((correct / testQuestions.length) * (currentAttempt === 1 ? 100 : 80))
  }

  const handleTestComplete = () => {
    const score = calculateScore()
    const passed = score >= 80
    let finalScore = score
    if (chapterProgress.testAttempts > 0 && chapterProgress.testScore) {
      finalScore = Math.max(score, chapterProgress.testScore)
    }
    updateChapterProgress(subjectId, chapterId, {
      testCompleted: passed,
      testScore: finalScore,
    })
    setShowResults(true)
  }

  const handleRereadChapter = () => {
    updateChapterProgress(subjectId, chapterId, {
      currentPage: 1,
      completed: false,
    })
    setQuizMode(false)
    router.push(`/child/subjects/${subjectId}/chapters/${chapterId}?page=1`)
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (testStarted && testTimeRemaining > 0) {
      interval = setInterval(() => {
        setTestTimeRemaining((prev) => {
          if (prev <= 1) {
            handleTestComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [testStarted, testTimeRemaining])

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#94A3B8] via-[#CBD5E1] to-[#E2E8F0] flex flex-col items-center justify-center p-6">
        <Button
          onClick={() => {
            setQuizMode(false)
            router.push(`/child/subjects/${subjectId}`)
          }}
          className={`${baseButtonStyle} self-start mb-4`}
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Chapters
        </Button>
        
        <Card className="w-full max-w-2xl border border-gray-200 rounded-xl overflow-hidden shadow-lg">
          <CardHeader className="text-center bg-gradient-to-r from-[#94A3B8] via-[#CBD5E1] to-[#E2E8F0] p-6">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Trophy className="w-8 h-8 text-gray-800" />
            </div>
            <CardTitle className="text-2xl text-white">
              Chapter {chapterId.split("-")[1]} Test
              {chapterProgress.testAttempts > 0 && (
                <Badge className="ml-2 bg-white text-gray-800 shadow-sm">
                  Retake
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-6 space-y-6 bg-white/90 backdrop-blur-sm">
            <div className="text-center space-y-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <p className="text-gray-700">
                  {chapterProgress.testAttempts > 0
                    ? `Previous score: ${chapterProgress.testScore || "N/A"}%. You need 80% to pass.`
                    : "Test your understanding of this chapter. You need 80% to pass and unlock the next chapter."}
                </p>
                <p className="text-gray-600 mt-2">Time spent today: {formatTime(dailyTime)}</p>
              </div>
              
              {chapterProgress.testAttempts > 0 && (
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-700">
                    This is attempt #{chapterProgress.testAttempts + 1}. Your score will be calculated out of 80%.
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-800 mb-3">Test Information</h4>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>{testQuestions.length} questions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>80% required to pass</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>First attempt: scored out of 100%</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Retakes: scored out of 80%</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>30-minute time limit</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Full results shown only if you pass</span>
                  </li>
                </ul>
              </div>
            </div>

            <Button
              onClick={handleStartTest}
              className={`w-full h-12 ${baseButtonStyle}`}
            >
              {chapterProgress.testAttempts > 0 ? "Retake Test" : "Start Test"}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showResults) {
    const score = calculateScore()
    const passed = score >= 80
    const correctAnswers = selectedAnswers.filter((answer, index) => answer === testQuestions[index].correct).length

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#94A3B8] via-[#CBD5E1] to-[#E2E8F0] p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="border border-gray-200 rounded-xl overflow-hidden shadow-lg">
            <CardHeader className={`text-center ${passed ? "bg-green-50" : "bg-red-50"} p-6`}>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                passed ? "bg-green-100 border-2 border-green-400" : "bg-red-100 border-2 border-red-400"
              }`}>
                {passed ? (
                  <CheckCircle className="w-8 h-8 text-green-600" />
                ) : (
                  <X className="w-8 h-8 text-red-600" />
                )}
              </div>
              <CardTitle className="text-2xl text-gray-800">
                {passed ? "Test Passed!" : "Test Not Passed"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-center space-y-4 bg-white/90 backdrop-blur-sm">
              <div className={`text-4xl font-bold ${passed ? "text-green-600" : "text-red-600"} mb-2`}>
                {score}%
              </div>
              {passed && (
                <p className="text-gray-600">
                  You got {correctAnswers} out of {testQuestions.length} questions correct
                </p>
              )}
              <p className="text-gray-600">Time spent today: {formatTime(dailyTime)}</p>
              <Alert className={passed ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                {passed ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={passed ? "text-green-700" : "text-red-700"}>
                  {passed
                    ? "Congratulations! You can now proceed to the next chapter."
                    : "You need 80% to pass. Please review the chapter or retake the test."}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {passed && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">Review Your Answers</h3>
              {testQuestions.map((question, index) => {
                const userAnswer = selectedAnswers[index]
                const isCorrect = userAnswer === question.correct

                return (
                  <Card key={index} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white/90 backdrop-blur-sm">
                    <div className={`p-4 ${isCorrect ? "bg-green-50" : "bg-red-50"}`}>
                      <div className="flex items-center gap-2">
                        {isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <X className="w-5 h-5 text-red-600" />
                        )}
                        <h4 className="font-medium text-gray-800">Question {index + 1}</h4>
                      </div>
                      <p className="mt-2 text-gray-700">{question.question}</p>
                    </div>
                    <CardContent className="p-4 space-y-3">
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`p-3 rounded-lg transition-all ${
                            optionIndex === question.correct
                              ? "bg-green-100 border border-green-300"
                              : userAnswer === optionIndex
                                ? "bg-red-100 border border-red-300"
                                : "bg-gray-50 border border-gray-200"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                              optionIndex === question.correct
                                ? "bg-green-500 text-white"
                                : userAnswer === optionIndex
                                  ? "bg-red-500 text-white"
                                  : "bg-gray-200"
                            }`}>
                              {String.fromCharCode(65 + optionIndex)}
                            </div>
                            <span>{option}</span>
                          </div>
                        </div>
                      ))}
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-800">
                          <span className="font-medium">Explanation:</span> {question.explanation}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          <div className="flex gap-4 justify-center">
            {passed ? (
              <>
                <Button
                  onClick={() => {
                    setQuizMode(false)
                    router.push(`/child/subjects/${subjectId}`)
                  }}
                  className={baseButtonStyle}
                >
                  Continue to Next Chapter
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => {
                    setTestStarted(false)
                    setCurrentQuestion(0)
                    setSelectedAnswers([])
                    setShowResults(false)
                    setTestTimeRemaining(1800)
                  }}
                  className={baseButtonStyle}
                >
                  <RefreshCw className="w-4 h-4" />
                  Retake Test
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleRereadChapter}
                  className={baseButtonStyle}
                >
                  Reread Chapter
                </Button>
                <Button
                  onClick={() => {
                    setTestStarted(false)
                    setCurrentQuestion(0)
                    setSelectedAnswers([])
                    setShowResults(false)
                    setTestTimeRemaining(1800)
                  }}
                  className={baseButtonStyle}
                >
                  <RefreshCw className="w-4 h-4" />
                  Retake Test
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#94A3B8] via-[#CBD5E1] to-[#E2E8F0] p-6">
      <div className="max-w-2xl mx-auto">
        <Card className="border border-gray-200 rounded-xl overflow-hidden shadow-lg">
          <CardHeader className="bg-gradient-to-r from-[#94A3B8] via-[#CBD5E1] to-[#E2E8F0] p-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-white">Chapter Test</CardTitle>
              <Badge className="bg-white text-gray-800 shadow-sm">
                Question {currentQuestion + 1} of {testQuestions.length}
              </Badge>
            </div>
            <Progress 
              value={((currentQuestion + 1) / testQuestions.length) * 100} 
              className="h-2 bg-white/30"
            />
          </CardHeader>
          <CardContent className="p-6 space-y-6 bg-white/90 backdrop-blur-sm">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-medium text-gray-800">
                  {testQuestions[currentQuestion].question}
                </h3>
                <div className="space-y-3">
                  {testQuestions[currentQuestion].options.map((option, index) => (
                    <Button
                      key={index}
                      className={`w-full text-left justify-start h-auto p-4 transition-all ${
                        selectedAnswers[currentQuestion] === index
                          ? "bg-gradient-to-r from-[#94A3B8] via-[#CBD5E1] to-[#E2E8F0] text-white"
                          : "bg-white hover:bg-gray-50 text-gray-800 border border-gray-200"
                      } rounded-lg shadow-sm`}
                      onClick={() => handleAnswerSelect(index)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          selectedAnswers[currentQuestion] === index
                            ? "bg-white text-[#94A3B8]"
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span>{option}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between">
              <Button
                onClick={() => smoothQuestionChange('prev')}
                disabled={currentQuestion === 0 || isTransitioning}
                className={`${baseButtonStyle} ${
                  currentQuestion === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <Button
                onClick={currentQuestion === testQuestions.length - 1 
                  ? handleTestComplete 
                  : () => smoothQuestionChange('next')}
                disabled={selectedAnswers[currentQuestion] === undefined || isTransitioning}
                className={`${baseButtonStyle} ${
                  selectedAnswers[currentQuestion] === undefined ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {currentQuestion === testQuestions.length - 1 ? "Finish Test" : "Next"}
                {currentQuestion < testQuestions.length - 1 && (
                  <ChevronRight className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}