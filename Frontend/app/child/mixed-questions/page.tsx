"use client";
import { useState, useEffect } from "react";
import {
Card,
CardContent,
CardHeader,
CardTitle,
CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trophy, Lock, CheckCircle, Star, X, ChevronLeft } from 'lucide-react';
import { useRouter } from "next/navigation";
import { useProgress } from "@/contexts/ProgressContext"; // Import useProgress

const subjects = [
{
  id: "math",
  name: "Mathematics",
  icon: "📊",
  gradient: "from-[#FF9A7A] via-[#FFB399] to-[#FFD5C2]", // Soft warm gradient
  bgGradient: "from-[#FFF5F0] to-[#FBE9E3]", // Light peachy background
  borderColor: "border-[#FCD5C0]",
},
{
  id: "science",
  name: "Science",
  icon: "🔬",
  gradient: "from-[#7DD3FC] via-[#38BDF8] to-[#0EA5E9]", // Vibrant sky blue science look
  bgGradient: "from-[#E0F2FE] to-[#F0F9FF]", // Clean blueish background
  borderColor: "border-[#BAE6FD]",
},
{
  id: "english",
  name: "English",
  icon: "📚",
  gradient: "from-[#D2B48C] via-[#F3E5AB] to-[#FFF8E1]", // Soft beige-yellow blend
  bgGradient: "from-[#FDF7EE] to-[#F6EFE2]", // Light tan-ivory background
  borderColor: "border-[#E7D9C5]",
},
{
  id: "history",
  name: "History",
  icon: "🏛️",
  gradient: "from-[#a7a2a9] via-[#c6b8ae] to-[#f1e9e5]", // Elegant lavender → beige
  bgGradient: "from-[#F9F7F8] to-[#EFE9ED]", // Gentle warm gray-pink
  borderColor: "border-[#DDD6D9]",
},
];

export default function MixedQuestionsPage() {
const router = useRouter();
const { getCompletedChapters } = useProgress(); // Get getCompletedChapters from context
const [selectedTest, setSelectedTest] = useState<string | null>(null);

const getSemesterStatus = (semester: number) => {
  const requiredChapters = semester === 1 ? 5 : 10;
  return subjects.every((subject) => {
    const completed = getCompletedChapters(subject.id).length;
    return completed >= requiredChapters;
  });
};

const semester1Complete = getSemesterStatus(1);
const semester2Complete = getSemesterStatus(2);

const mixedTests = [
  {
    id: "semester-1-mixed",
    title: "Semester 1 Mixed Questions",
    description: "Questions from all subjects - Chapters 1-5",
    unlocked: semester1Complete,
    semester: 1,
    questions: 20,
    timeLimit: "45 minutes",
    bgColor: "bg-[#FCECE7]", // New color 1
    borderColor: "border-[#FCD5C0]",
  },
  {
    id: "semester-2-mixed",
    title: "Semester 2 Mixed Questions",
    description: "Questions from all subjects - Chapters 6-10",
    unlocked: semester2Complete,
    semester: 2,
    questions: 25,
    timeLimit: "60 minutes",
    bgColor: "bg-[#F9F2E6]", // New color 2
    borderColor: "border-[#E7D9C5]",
  },
  {
    id: "final-mixed",
    title: "Final Mixed Assessment",
    description: "Comprehensive test covering all chapters",
    unlocked: semester2Complete,
    semester: 3,
    questions: 40,
    timeLimit: "90 minutes",
    bgColor: "bg-[#F4F0F2]", // New color 3
    borderColor: "border-[#DDD6D9]",
  },
];

const MixedTestCard = ({ test }: { test: (typeof mixedTests)[0] }) => {
  // Adjusted colors for light backgrounds
  const textColor = "text-[#4A5568]"; // Darker gray for general text
const titleColor = "bg-gradient-to-r from-[#4B5563] via-[#F97316] to-[#FDBA74] bg-clip-text text-transparent font-bold";
  const iconColor = "text-[#FF8A6B]"; // Accent color remains
  const lockedIconColor = "text-gray-500"; // Slightly darker locked icon
  const badgeAvailableBg = "bg-[#FF8A6B]";
  const badgeAvailableText = "text-white";
  const badgeAvailableBorder = "border-[#FF8A6B]";
  const badgeLockedBg = "bg-gray-200"; // Lighter locked badge background
  const badgeLockedText = "text-gray-600"; // Darker locked badge text
  const badgeLockedBorder = "border-gray-300";

  return (
    <Card className={`${test.bgColor} ${test.borderColor} rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-[1.02]`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className={`flex items-center gap-3 text-2xl font-bold ${titleColor}`}>
            {test.unlocked ? (
              <Trophy className={`w-6 h-6 ${iconColor}`} />
            ) : (
              <Lock className={`w-6 h-6 ${lockedIconColor}`} />
            )}
            {test.title}
          </CardTitle>
          <Badge
            variant={test.unlocked ? "default" : "secondary"}
            className={test.unlocked ? `${badgeAvailableBg} ${badgeAvailableText} ${badgeAvailableBorder} px-3 py-1 text-sm font-semibold rounded-full` : `${badgeLockedBg} ${badgeLockedText} ${badgeLockedBorder} px-3 py-1 text-sm font-semibold rounded-full`}
          >
            {test.unlocked ? "Available" : "Locked"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className={`${textColor} text-base`}>{test.description}</p>
        <div className={`flex gap-6 text-sm ${textColor}`}>
          <div className="flex items-center gap-2">
            <Star className={`w-5 h-5 ${iconColor}`} />
            <span>{test.questions} questions</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className={`w-5 h-5 ${iconColor}`} />
            <span>{test.timeLimit}</span>
          </div>
        </div>
        {test.unlocked ? (
          <Button
            onClick={() => setSelectedTest(test.id)}
            className="w-full h-12 bg-gradient-to-r from-[#FF9A7A] via-[#FFB399] to-[#FFD5C2] hover:from-[#FFB399] hover:via-[#FFD5C2] hover:to-[#FFE5E0] text-white font-bold text-lg py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-[1.02]"
          >
            Start Mixed Test
          </Button>
        ) : (
          <div className="space-y-3">
            <Alert className="bg-[#FFF5F3] border-[#FFE5E0] rounded-xl shadow-sm">
              <Lock className="h-5 w-5 text-[#FF8A6B]" />
              <AlertDescription className="text-sm bg-gradient-to-r from-[#F97316] via-[#FB923C] to-[#FFB86C] bg-clip-text text-transparent">
  Complete {test.semester === 1 ? "first 5 chapters" : "all chapters"} in all subjects to unlock
</AlertDescription>

            </Alert>
            <div className={`text-sm ${textColor}`}>
              Progress:{" "}
              {subjects
                .map((subject) => {
                  const completed = getCompletedChapters(subject.id).length;
                  const required = test.semester === 1 ? 5 : 10;
                  return `${subject.name}: ${completed}/${required}`;
                })
                .join(", ")}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

if (selectedTest) {
  return <MixedTestComponent testId={selectedTest} onBack={() => setSelectedTest(null)} />;
}

return (
  <div className="p-8 space-y-10 content-area bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] min-h-screen">
    {/* Back Button */}
    <Button variant="ghost" onClick={() => router.push("/child/dashboard")} className="flex items-center gap-2 mb-6 text-[#718096] hover:text-[#FF8A6B] text-base font-medium transition-colors duration-200">
      <ChevronLeft className="w-5 h-5" />
      Back to Dashboard
    </Button>

    {/* Header */}
    <div className="bg-gradient-to-br from-[#94A3B8] via-[#CBD5E1] to-[#E2E8F0] rounded-3xl p-10 shadow-3xl">
  <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-[#4B5563] via-[#F97316] to-[#FDBA74] bg-clip-text text-transparent leading-tight">
    Mixed Questions
  </h1>
  <p className="text-lg text-gray-700 opacity-90">
    Test your knowledge across multiple subjects and chapters.
  </p>
</div>


    {/* Progress Overview */}
    <Card className="bg-white border-gray-200 rounded-2xl shadow-xl">
      <CardHeader>
<CardTitle className="text-2xl font-bold bg-gradient-to-r from-[#4B5563] via-[#F97316] to-[#FDBA74] bg-clip-text text-transparent">
  Your Progress
</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-semibold text-[#718096] text-lg">Semester 1 Status</h4>
            <div className="flex items-center gap-3">
              {semester1Complete ? (
                <CheckCircle className="w-7 h-7 text-emerald-500" />
              ) : (
                <Lock className="w-7 h-7 text-[#718096]" />
              )}
              <span className={semester1Complete ? "text-emerald-700 text-lg font-medium" : "text-[#718096] text-lg font-medium"}>
                {semester1Complete
                  ? "Complete - Mixed questions unlocked!"
                  : "Complete first 5 chapters in all subjects"}
              </span>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-[#718096] text-lg">Semester 2 Status</h4>
            <div className="flex items-center gap-3">
              {semester2Complete ? (
                <CheckCircle className="w-7 h-7 text-emerald-500" />
              ) : (
                <Lock className="w-7 h-7 text-[#718096]" />
              )}
              <span className={semester2Complete ? "text-emerald-700 text-lg font-medium" : "text-[#718096] text-lg font-medium"}>
                {semester2Complete
                  ? "Complete - All mixed questions unlocked!"
                  : "Complete all 10 chapters in all subjects"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Mixed Tests - Only these 3 cards have the new background colors */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {mixedTests.map((test) => (
        <MixedTestCard key={test.id} test={test} />
      ))}
    </div>

    {/* Subject Progress */}
    <Card className="bg-white border-gray-200 rounded-2xl shadow-xl">
      <CardHeader>
<CardTitle className="text-2xl font-bold bg-gradient-to-r from-[#4B5563] via-[#F97316] to-[#FDBA74] bg-clip-text text-transparent">
  Subject Progress
</CardTitle>      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {subjects.map((subject) => {
            const completed = getCompletedChapters(subject.id).length;
            return (
              <div key={subject.id} className={`text-center p-6 border rounded-2xl shadow-md bg-gradient-to-br ${subject.bgGradient} ${subject.borderColor} hover:shadow-lg transition-all duration-300 hover:scale-[1.02]`}>
                <h4 className="font-bold mb-3 text-[#2D3748] text-xl">{subject.name}</h4>
                <div className="text-4xl font-extrabold text-[#FF8A6B] mb-2">{completed}/10</div>
                <p className="text-base text-[#718096]">chapters completed</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  </div>
);
}

function MixedTestComponent({ testId, onBack }: { testId: string; onBack: () => void }) {
const [currentQuestion, setCurrentQuestion] = useState(0);
const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
const [showResults, setShowResults] = useState(false);
const [testStarted, setTestStarted] = useState(false);

const mixedQuestions = [
  {
    subject: "Mathematics",
    question: "What is 15% of 200?",
    options: ["25", "30", "35", "40"],
    correct: 1,
    explanation: "15% of 200 = (15/100) × 200 = 30",
  },
  {
    subject: "Science",
    question: "What is the chemical symbol for water?",
    options: ["H2O", "CO2", "NaCl", "O2"],
    correct: 0,
    explanation: "Water is composed of two hydrogen atoms and one oxygen atom, hence H2O.",
  },
  {
    subject: "English",
    question: "Which word is a synonym for 'happy'?",
    options: ["Sad", "Joyful", "Angry", "Tired"],
    correct: 1,
    explanation: "Joyful means feeling or expressing great happiness, making it a synonym for happy.",
  },
  {
    subject: "History",
    question: "In which year did World War II end?",
    options: ["1944", "1945", "1946", "1947"],
    correct: 1,
    explanation: "World War II ended in 1945 with the surrender of Japan in September.",
  },
  {
    subject: "Mathematics",
    question: "What is the area of a rectangle with length 8 and width 5?",
    options: ["13", "26", "40", "45"],
    correct: 2,
    explanation: "Area of rectangle = length × width = 8 × 5 = 40 square units",
  },
];

const handleStartTest = () => {
  setTestStarted(true);
};

const handleAnswerSelect = (answerIndex: number) => {
  const newAnswers = [...selectedAnswers];
  newAnswers[currentQuestion] = answerIndex;
  setSelectedAnswers(newAnswers);
};

const handleNext = () => {
  if (currentQuestion < mixedQuestions.length - 1) {
    setCurrentQuestion((prev) => prev + 1);
  } else {
    setShowResults(true);
  }
};

const calculateScore = () => {
  let correct = 0;
  mixedQuestions.forEach((question, index) => {
    if (selectedAnswers[index] === question.correct) {
      correct++;
    }
  });
  return Math.round((correct / mixedQuestions.length) * 100);
};

if (!testStarted) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] flex items-center justify-center p-8">
      <Card className="w-full max-w-2xl bg-white bg-[url('/placeholder.svg?height=200&width=200')] bg-cover bg-center border-gray-200 rounded-2xl shadow-3xl overflow-hidden">
        <CardHeader className="text-center">
          <Button variant="ghost" onClick={onBack} className="self-start mb-6 text-[#718096] hover:text-[#FF8A6B] text-base font-medium transition-colors duration-200">
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back to Mixed Questions
          </Button>
          <div className="w-28 h-28 bg-gradient-to-r from-[#FF9A7A] via-[#FFB399] to-[#FFD5C2] rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl transform hover:scale-105 transition-transform duration-300">
            <Trophy className="w-14 h-14 text-white" />
          </div>
          <CardTitle className="text-4xl font-bold text-[#2D3748]">Mixed Questions Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-10">
          <div className="text-center space-y-6">
            <p className="text-[#718096] text-lg">This test contains questions from multiple subjects and chapters.</p>
            <div className="bg-[#F8FAFC] border border-[#DDE2E8] rounded-2xl p-7 shadow-inner">
              <h4 className="font-bold text-[#2D3748] mb-5 text-2xl">Test Information</h4>
              <ul className="text-base text-[#718096] space-y-3 list-disc list-inside text-left">
                <li>{mixedQuestions.length} questions from different subjects</li>
                <li>Questions cover multiple chapters</li>
                <li>Results recorded on first attempt only</li>
                <li>Review explanations after completion</li>
              </ul>
            </div>
          </div>
          <Button
            onClick={handleStartTest}
            className="w-full h-16 bg-gradient-to-r from-[#FF9A7A] via-[#FFB399] to-[#FFD5C2] hover:from-[#FFB399] hover:via-[#FFD5C2] hover:to-[#FFE5E0] text-white font-bold text-xl rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 ease-in-out transform hover:scale-[1.02]"
          >
            Start Mixed Test
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

if (showResults) {
  const score = calculateScore();
  const correctAnswers = selectedAnswers.filter((answer, index) => answer === mixedQuestions[index].correct).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Button variant="ghost" onClick={onBack} className="mb-6 text-[#718096] hover:text-[#FF8A6B] text-base font-medium transition-colors duration-200">
          <ChevronLeft className="w-5 h-5 mr-2" />
          Back to Mixed Questions
        </Button>

        {/* Results Header */}
        <Card className="bg-white border-gray-200 rounded-2xl shadow-2xl">
          <CardHeader className="text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-[#FF9A7A] via-[#FFB399] to-[#FFD5C2] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <CardTitle className="text-4xl font-bold text-[#2D3748]">Test Complete!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="text-7xl font-extrabold text-[#FF8A6B] mb-3">{score}%</div>
            <p className="text-[#718096] text-xl">
              You got {correctAnswers} out of {mixedQuestions.length} questions correct
            </p>
          </CardContent>
        </Card>

        {/* Question Review */}
        <div className="space-y-6">
          <h3 className="text-3xl font-bold text-[#2D3748]">Review Your Answers</h3>
          {mixedQuestions.map((question, index) => {
            const userAnswer = selectedAnswers[index];
            const isCorrect = userAnswer === question.correct;
            return (
              <Card
                key={index}
                className={`bg-white border-l-8 ${isCorrect ? "border-l-emerald-500" : "border-l-rose-500"} rounded-2xl shadow-md`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl flex items-center gap-3 text-[#2D3748]">
                      {isCorrect ? (
                        <CheckCircle className="w-7 h-7 text-emerald-500" />
                      ) : (
                        <X className="w-7 h-7 text-rose-500" />
                      )}
                      Question {index + 1}
                    </CardTitle>
                    <Badge variant="outline" className="bg-[#F8FAFC] text-[#718096] px-4 py-1.5 text-base font-medium rounded-full">
                      {question.subject}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="font-semibold text-[#2D3748] text-xl">{question.question}</p>
                  <div className="space-y-4">
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`p-4 rounded-xl border transition-all duration-200 ${
                          optionIndex === question.correct
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700 font-medium shadow-sm"
                            : userAnswer === optionIndex
                            ? "bg-rose-50 border-rose-200 text-rose-700 font-medium shadow-sm"
                            : "bg-[#F8FAFC] border-[#E2E8F0] hover:bg-[#F1F5F9]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-base text-[#2D3748]">{option}</span>
                          <div className="flex gap-2">
                            {optionIndex === question.correct && (
                              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs font-medium rounded-full">
                                Correct
                              </Badge>
                            )}
                            {userAnswer === optionIndex && optionIndex !== question.correct && (
                              <Badge variant="secondary" className="bg-rose-100 text-rose-700 border-rose-200 text-xs font-medium rounded-full">
                                Your Answer
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-[#F8FAFC] border-[#E2E8F0] rounded-xl p-5 shadow-sm">
                    <h5 className="font-semibold text-[#2D3748] mb-3 text-lg">Explanation:</h5>
                    <p className="text-[#718096] text-base">{question.explanation}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

return (
  <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] p-8">
    <div className="max-w-2xl mx-auto">
      <Card className="bg-white border-gray-200 rounded-2xl shadow-2xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-3xl font-bold text-[#2D3748]">Mixed Questions Test</CardTitle>
              <Badge variant="outline" className="mt-4 bg-[#F8FAFC] text-[#718096] px-4 py-1.5 text-base font-medium rounded-full">
                {mixedQuestions[currentQuestion].subject}
              </Badge>
            </div>
            <Badge variant="secondary" className="bg-[#F8FAFC] text-[#718096] px-4 py-1.5 text-lg font-medium rounded-full">
              Question {currentQuestion + 1} of {mixedQuestions.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-10">
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-[#2D3748]">{mixedQuestions[currentQuestion].question}</h3>
            <div className="space-y-5">
              {mixedQuestions[currentQuestion].options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswers[currentQuestion] === index ? "default" : "outline"}
                  className={`w-full text-left justify-start h-auto p-5 rounded-xl text-lg font-medium transition-all duration-200 ${selectedAnswers[currentQuestion] === index
                      ? "bg-gradient-to-r from-[#FF9A7A] via-[#FFB399] to-[#FFD5C2] text-white shadow-lg"
                      : "bg-[#F8FAFC] text-[#2D3748] hover:bg-[#F1F5F9] border-[#E2E8F0] hover:border-[#DDD6D9]"
                  }`}
                  onClick={() => handleAnswerSelect(index)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion((prev) => prev - 1)}
              disabled={currentQuestion === 0}
              className="text-[#718096] hover:text-[#FF8A6B] border-[#E2E8F0] hover:border-[#FF8A6B] px-8 py-4 text-lg font-medium transition-colors duration-200"
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={selectedAnswers[currentQuestion] === undefined}
              className="bg-gradient-to-r from-[#FF9A7A] via-[#FFB399] to-[#FFD5C2] hover:from-[#FFB399] hover:via-[#FFD5C2] hover:to-[#FFE5E0] text-white font-bold px-8 py-4 text-lg shadow-lg transition-all duration-300"
            >
              {currentQuestion === mixedQuestions.length - 1 ? "Finish Test" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);
}
