"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProgress } from "@/contexts/ProgressContext";
import { useTimer } from "@/contexts/TimerContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Chatbot } from "@/components/child/Chatbot";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Search,
  Clock,
  RefreshCw,
} from "lucide-react";

interface ChapterPage {
  _id: string;
  chapterId: string;
  pageNumber: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface SearchResult {
  page: number;
  title: string;
  content: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

const APP_ROUTES = {
  chapterTest: (subjectId: string, chapterId: string) =>
    `/child/subjects/${subjectId}/chapters/${chapterId}/test`,
  subjectChapters: (subjectId: string) => `/child/subjects/${subjectId}`,
};

export default function ChapterPage() {
  const params = useParams();
  const router = useRouter();
  const subjectId = params?.subjectId as string;
  const chapterId = params?.chapterId as string;

  const { getChapterProgress, updateChapterProgress } = useProgress();
  const {
    startReadingTimer,
    pauseReadingTimer,
    isRunning,
    setQuizMode,
    formatTime,
    dailyTime,
  } = useTimer();

  const [currentPage, setCurrentPage] = useState(1);
  const [showQuiz, setShowQuiz] = useState(false);
  const [canProceed, setCanProceed] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [completedQuizzes, setCompletedQuizzes] = useState<
    Record<number, boolean>
  >({});
  const [pageContent, setPageContent] = useState<ChapterPage | null>(null);
  const [pages, setPages] = useState<ChapterPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const chapterProgress = getChapterProgress(subjectId, chapterId);
  const totalPages = chapterProgress.totalPages;
  const isRevisit = chapterProgress.completed;
  const isQuizPage = currentPage % 5 === 0 && currentPage < totalPages;
  const progressPercent = (currentPage / totalPages) * 100;

  useEffect(() => {
    setQuizMode(showQuiz);
    if (!showQuiz) {
      startReadingTimer();
    } else {
      pauseReadingTimer();
    }
    return () => {
      setQuizMode(false);
      pauseReadingTimer();
    };
  }, [showQuiz, setQuizMode, startReadingTimer, pauseReadingTimer]);

  useEffect(() => {
    const progress = getChapterProgress(subjectId, chapterId);
    if (progress) {
      setCurrentPage(progress.currentPage);
      setCompletedQuizzes(progress.completedQuizzes || {});
    }
  }, [subjectId, chapterId, getChapterProgress]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchPages = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:5000/api/chapterpages/chapter/${chapterId}/pages`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error("Failed to fetch pages");
        const data = await res.json();
        setPages(data);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    if (chapterId) fetchPages();
    return () => controller.abort();
  }, [chapterId]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchPageContent = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `http://localhost:5000/api/chapterpages/${chapterId}/${currentPage}`,
          { signal: controller.signal }
        );

        if (!res.ok) {
          if (res.status === 404) {
            const availablePages = pages
              .map((p) => p.pageNumber)
              .sort((a, b) => a - b);
            const closestPage =
              availablePages.find((p) => p >= currentPage) ||
              availablePages[availablePages.length - 1];

            if (closestPage && closestPage !== currentPage) {
              setCurrentPage(closestPage);
              return;
            }
            throw new Error(`Page ${currentPage} not found`);
          }
          throw new Error("Failed to fetch page content");
        }

        const data = await res.json();
        if (!data) throw new Error("Page content is empty");
        setPageContent(data);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    if (chapterId && currentPage && pages.length > 0) {
      fetchPageContent();
    }
    return () => controller.abort();
  }, [chapterId, currentPage, pages]);

  useEffect(() => {
    setCanProceed(isRevisit);
    setTimeRemaining(5);

    if (!isRevisit) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setCanProceed(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentPage, isRevisit]);

  useEffect(() => {
    const currentProgress = getChapterProgress(subjectId, chapterId);
    const newTimeSpent = isRevisit ? 0 : 1;

    if (currentPage > (currentProgress?.currentPage ?? 0)) {
      updateChapterProgress(subjectId, chapterId, {
        currentPage: currentPage,
        timeSpent: (currentProgress?.timeSpent ?? 0) + newTimeSpent,
      });
    }
  }, [
    currentPage,
    subjectId,
    chapterId,
    isRevisit,
    updateChapterProgress,
    getChapterProgress,
  ]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.length > 2 && pages.length > 0) {
      const results = pages
        .filter(
          (page) =>
            page.title.toLowerCase().includes(term.toLowerCase()) ||
            page.content.toLowerCase().includes(term.toLowerCase())
        )
        .map((page) => ({
          page: page.pageNumber,
          title: page.title,
          content: page.content.substring(0, 100) + "...",
        }));
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleNextPage = () => {
    if (!canProceed && !isRevisit) return;

    if (isQuizPage && !isRevisit && !completedQuizzes[currentPage]) {
      setShowQuiz(true);
      return;
    }

    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    } else if (currentPage === totalPages) {
      handleChapterComplete();
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleQuizComplete = (score: number) => {
    const newCompletedQuizzes = { ...completedQuizzes, [currentPage]: true };
    setCompletedQuizzes(newCompletedQuizzes);

    if (!isRevisit && !completedQuizzes[currentPage]) {
      updateChapterProgress(subjectId, chapterId, {
        completedQuizzes: newCompletedQuizzes,
        quizScores: { ...chapterProgress.quizScores, [currentPage]: score },
      });
    }
    setShowQuiz(false);

    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleChapterComplete = () => {
    if (!isRevisit) {
      updateChapterProgress(subjectId, chapterId, {
        completed: true,
        currentPage: totalPages,
      });
    }
    router.push(
      `http://localhost:5000/child/subjects/${subjectId}/chapters/${chapterId}/test`
    );
  };

  const handleRetakeQuiz = () => {
    setShowQuiz(true);
  };

  if (showQuiz) {
    return (
      <QuizComponent
        onComplete={handleQuizComplete}
        isRevisit={isRevisit || completedQuizzes[currentPage]}
        pageNumber={currentPage}
        chapterId={chapterId}
      />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error} - Please try again later</AlertDescription>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </Alert>
      </div>
    );
  }

  if (loading || !pageContent) {
    return (
      <div className="min-h-screen w-[90%] max-w-7xl mx-auto rounded-2xl shadow-md p-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-[90%] max-w-7xl mx-auto  rounded-2xl shadow-md p-6">
      <div className="w-full mb-6">
        {/* Header Row - Modified to move chapter to left */}
        <div className="flex items-center gap-4 mb-2">
          {/* Back Button */}
          <Button
            onClick={() => {
              setQuizMode(false);
              pauseReadingTimer();
              router.push(`/child/subjects/${subjectId}`);
            }}
            className={`flex items-center gap-2 bg-gradient-to-r from-[#FAF3E9] to-[#F0E6D6] hover:from-[#F5EDE0] hover:to-[#EBE2D2] text-gray-700 shadow-sm hover:shadow-md transition-all duration-300 rounded-lg px-4 py-2`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Chapters</span>
          </Button>

          {/* Chapter Indicator - Moved to left side after back button */}
          <div className="flex items-center gap-3">
            <div className="h-px w-8 bg-gradient-to-r from-orange-400 to-transparent"></div>
            <div className="bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-transparent bg-clip-text">
              <span className="text-2xl font-bold">
                Chapter {chapterId.split("-")[1]}
              </span>
            </div>
          </div>

          {/* Spacer to push right elements to the right */}
          <div className="flex-1"></div>
        </div>

        {/* Card Content - Shifted left as before */}
        <div className="p-4 pl-2 bg-gradient-to-tr from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-sm flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Left Section */}
          <div className="space-y-1 ml-1">
            <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-300 dark:to-gray-100 text-transparent bg-clip-text">
              {pageContent.title}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Page {currentPage} of {totalPages} · Time spent:{" "}
              {formatTime(dailyTime)}
            </p>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3 flex-wrap justify-end">
            <Button
              onClick={() => setShowSearch(!showSearch)}
              className={`flex items-center gap-2 bg-gradient-to-r from-[#FAF3E9] to-[#F0E6D6] hover:from-[#F5EDE0] hover:to-[#EBE2D2] text-gray-700 shadow-sm hover:shadow-md transition-all duration-300 rounded-lg px-4 py-2`}
            >
              <Search className="w-4 h-4" />
              <span className="text-sm">Search</span>
            </Button>

            <Badge className="flex items-center gap-1 px-3 py-1 text-sm bg-gradient-to-r from-orange-100 to-orange-50 dark:from-orange-900 dark:to-orange-800 text-orange-800 dark:text-orange-100 rounded-md shadow-sm">
              <BookOpen className="w-4 h-4" />
              {isRevisit ? "Reviewing" : "Reading"}
            </Badge>
          </div>
        </div>
      </div>

      {showSearch && (
        <div className="mt-4 space-y-2">
          <Input
            placeholder="Search chapter content..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="max-w-md"
          />
          {searchResults.length > 0 && (
            <div className="bg-white border rounded-lg shadow-lg max-h-40 overflow-y-auto">
              {searchResults.map((result) => (
                <button
                  key={result.page}
                  onClick={() => {
                    setCurrentPage(result.page);
                    setShowSearch(false);
                    setSearchTerm("");
                    setSearchResults([]);
                  }}
                  className="w-full text-left p-3 hover:bg-gray-50 border-b last:border-b-0"
                >
                  <div className="font-medium text-sm">
                    Page {result.page}: {result.title}
                  </div>
                  <div className="text-xs text-gray-600 truncate">
                    {result.content}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="w-full min-h-[500px] rounded-2xl shadow-md p-6 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            {pageContent.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <div className="text-lg leading-relaxed text-gray-700 space-y-4">
            <p>{pageContent.content}</p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
              <h4 className="font-semibold text-blue-800 mb-2">Key Point</h4>
              <p className="text-blue-700">
                Remember to take notes and practice the concepts as you learn
                them. This will help reinforce your understanding and improve
                retention.
              </p>
            </div>

            {currentPage > 5 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">
                  Practice Exercise
                </h4>
                <p className="text-green-700">
                  Try to apply what you've learned in this section. Can you
                  think of real-world examples where these concepts might be
                  useful?
                </p>
              </div>
            )}

            {currentPage % 5 === 4 &&
              currentPage < totalPages - 1 &&
              !completedQuizzes[currentPage + 1] && (
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertDescription className="text-yellow-800">
                    <strong>Quiz Coming Up!</strong> After the next page, you'll
                    have a quiz to test your understanding of the last 5 pages.
                  </AlertDescription>
                </Alert>
              )}

            {!canProceed && !isRevisit && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <div>
                    <h4 className="font-semibold text-yellow-800">
                      Please read carefully
                    </h4>
                    <p className="text-yellow-700 text-sm">
                      You can proceed to the next page in {timeRemaining}{" "}
                      seconds. Take your time to understand the content.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {isQuizPage && (
              <Button
                onClick={handleRetakeQuiz}
                className={`flex items-center gap-2 mt-4 bg-gradient-to-r from-[#FAF3E9] to-[#F0E6D6] hover:from-[#F5EDE0] hover:to-[#EBE2D2] text-gray-700 shadow-sm hover:shadow-md transition-all duration-300 rounded-lg px-4 py-2`}
              >
                <RefreshCw className="w-4 h-4" />
                {completedQuizzes[currentPage] ? "Retake Quiz" : "Take Quiz"}
              </Button>
            )}
          </div>
        </CardContent>
      </div>

      <div className="flex justify-between items-center mt-6">
        <Button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`flex items-center gap-2 ${
            currentPage === 1
              ? "bg-gradient-to-r from-[#FAF3E9] to-[#F5EDE0] text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-[#FAF3E9] to-[#F0E6D6] text-gray-700 hover:from-[#F5EDE0] hover:to-[#EBE2D2]"
          } transition-all duration-300 rounded-lg px-4 py-2 shadow-sm hover:shadow-md`}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        <div className="text-sm text-gray-600 text-center">
          <div>
            Page {currentPage} of {totalPages}
          </div>
          {isQuizPage && !isRevisit && !completedQuizzes[currentPage] && (
            <div className="text-orange-500 font-medium">
              Quiz required before continuing
            </div>
          )}
        </div>

        {currentPage < totalPages ? (
          <Button
            onClick={handleNextPage}
            className={`flex items-center gap-2 ${
              (!canProceed && !isRevisit) ||
              (isQuizPage && !isRevisit && !completedQuizzes[currentPage])
                ? "bg-gradient-to-r from-[#FAF3E9] to-[#F5EDE0] text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-[#FAF3E9] to-[#F0E6D6] text-gray-700 hover:from-[#F5EDE0] hover:to-[#EBE2D2] shadow-sm hover:shadow-md"
            } transition-all duration-300 rounded-lg px-4 py-2`}
            disabled={
              (!canProceed && !isRevisit) ||
              (isQuizPage && !isRevisit && !completedQuizzes[currentPage])
            }
          >
            Next
            <ChevronRight className="w-4 h-4" />
            {!canProceed && !isRevisit && (
              <Badge className="ml-2 bg-gradient-to-r from-[#F0E6D6] to-[#E5DBCB] text-gray-700">
                {timeRemaining}s
              </Badge>
            )}
          </Button>
        ) : (
          <Button
            onClick={handleChapterComplete}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md hover:shadow-lg transition-all duration-300 rounded-lg px-4 py-2"
          >
            {isRevisit ? "Take Test Again" : "Take Chapter Test"}
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>

      <Chatbot />
    </div>
  );
}

interface QuizComponentProps {
  onComplete: (score: number) => void;
  isRevisit: boolean;
  pageNumber: number;
  chapterId: string;
}

function QuizComponent({
  onComplete,
  isRevisit,
  pageNumber,
  chapterId,
}: QuizComponentProps) {
  const { formatTime, dailyTime, setQuizMode } = useTimer();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      question: `What is the main concept covered in pages ${
        pageNumber - 4
      } to ${pageNumber}?`,
      options: [
        "Basic fundamentals and core principles",
        "Advanced mathematical formulas",
        "Historical background information",
        "Future technological developments",
      ],
      correct: 0,
      explanation: "These pages focused on building fundamental understanding.",
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
      explanation: "Systematic approach ensures thorough understanding.",
    },
  ];

  useEffect(() => {
    setQuizMode(true);
    return () => setQuizMode(false);
  }, [setQuizMode]);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const calculateScore = () => {
    const correct = questions.reduce((count, question, index) => {
      return count + (selectedAnswers[index] === question.correct ? 1 : 0);
    }, 0);
    return Math.round((correct / questions.length) * 100);
  };

  if (showResults) {
    const score = calculateScore();
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle>Quiz Results - Page {pageNumber}</CardTitle>
            {isRevisit && <Badge variant="secondary">Practice Mode</Badge>}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {score}%
              </div>
              <p className="text-gray-600">
                Time spent today: {formatTime(dailyTime)}
              </p>
            </div>

            <div className="space-y-4">
              {questions.map((question, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <p className="font-medium mb-2">{question.question}</p>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`p-3 rounded-lg ${
                          optionIndex === question.correct
                            ? "bg-green-100 border-green-200"
                            : selectedAnswers[index] === optionIndex
                            ? "bg-red-100 border-red-200"
                            : "bg-gray-50"
                        }`}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <strong>Explanation:</strong> {question.explanation}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={() => onComplete(score)}>
                Continue Reading
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r  flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl bg-white">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Quiz - Page {pageNumber}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                Question {currentQuestion + 1} of {questions.length}
              </Badge>
              <Badge variant="outline" className="text-blue-600">
                Time spent today: {formatTime(dailyTime)}
              </Badge>
              {isRevisit && <Badge variant="outline">Practice Mode</Badge>}
            </div>
          </div>

          <Progress
            value={((currentQuestion + 1) / questions.length) * 100}
            className="h-2"
          />
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="border-blue-200 bg-blue-50">
            <AlertDescription className="text-blue-800">
              This quiz covers the content from pages {pageNumber - 4} to{" "}
              {pageNumber}. Take your time and think carefully about each
              answer.
            </AlertDescription>
          </Alert>
          <div>
            <h3 className="text-lg font-medium mb-4">
              {questions[currentQuestion].question}
            </h3>
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`w-full text-left justify-start h-auto p-4 transition-all duration-300 ${
                    selectedAnswers[currentQuestion] === index
                      ? "bg-gradient-to-r from-[#FAF3E9] to-[#F0E6D6] text-gray-700 shadow-lg"
                      : "bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-800 border border-gray-200 hover:border-[#94A3B8] shadow-sm hover:shadow-md"
                  } rounded-lg`}
                  onClick={() => handleAnswerSelect(index)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <Button
              onClick={() => setCurrentQuestion((prev) => prev - 1)}
              disabled={currentQuestion === 0}
              variant="outline"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button
              onClick={() => {
                if (currentQuestion < questions.length - 1) {
                  setCurrentQuestion((prev) => prev + 1);
                } else {
                  setShowResults(true);
                }
              }}
              disabled={selectedAnswers[currentQuestion] === undefined}
            >
              {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
