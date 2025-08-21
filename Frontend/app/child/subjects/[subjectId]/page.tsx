"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProgress } from "@/contexts/ProgressContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Lock,
  CheckCircle,
  BookOpen,
  Clock,
  Trophy,
  ChevronLeft,
  ArrowRight,
  Zap,
  Award,
} from "lucide-react";
import Link from "next/link";

export default function SubjectPage() {
  const router = useRouter();
  const params = useParams();
  const subjectId = params.subjectId as string;

  const { getChapterProgress, isChapterUnlocked } = useProgress();

  type SubjectType = {
    id: string;
    name: string;
    icon: React.ReactNode;
    bgGradient: string;
  };

  type ChapterType = {
    _id: string;
    title: string;
    semester: number;
    chapterNumber: number;
  };

  const [subject, setSubject] = useState<null | SubjectType>(null);
  const [chapters, setChapters] = useState<ChapterType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!subjectId) return;

    async function fetchData() {
      setLoading(true);
      try {
        const [subjectRes, chaptersRes] = await Promise.all([
          fetch(`http://localhost:5000/api/subjects/${subjectId}`),
          fetch(`http://localhost:5000/api/chapters/subject/${subjectId}`),
        ]);

        if (!subjectRes.ok) throw new Error("Failed to load subject");
        if (!chaptersRes.ok) throw new Error("Failed to load chapters");

        const subjectData = await subjectRes.json();
        const chaptersData = await chaptersRes.json();

        setSubject(subjectData);

        setChapters(chaptersData);
        setError("");
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [subjectId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!subject) return <div>Subject not found</div>;

  const semester1Chapters = chapters.filter((ch) => ch.semester === 1);
  const semester2Chapters = chapters.filter((ch) => ch.semester === 2);

  const semester1Completed = semester1Chapters.every(
    (ch) => getChapterProgress(subjectId, ch._id).completed
  );

  const getChapterStatus = (chapterId: string) => {
    const progress = getChapterProgress(subjectId, chapterId);
    const chapter = chapters.find((c) => c._id === chapterId);

    if (chapter?.chapterNumber === 1) {
      return progress.completed ? "completed" : "unlocked";
    }

    if (chapter) {
      const prevChapter = chapters.find(
        (c) =>
          c.semester === chapter.semester &&
          c.chapterNumber === chapter.chapterNumber - 1
      );

      if (prevChapter) {
        const prevProgress = getChapterProgress(subjectId, prevChapter._id);
        if (!prevProgress.completed) return "locked";
      }
    }

    return progress.completed ? "completed" : "unlocked";
  };

  const ChapterCard = ({ chapter }: { chapter: ChapterType }) => {
    const status = getChapterStatus(chapter._id);
    const progress = getChapterProgress(subjectId, chapter._id);
    const progressPercent = Math.min(
      100,
      (progress.currentPage / progress.totalPages) * 100
    );

    const isSemester2Locked = chapter.semester === 2 && !semester1Completed;

    const isLocked = status === "locked" || isSemester2Locked;

    const lockReason = isSemester2Locked
      ? "Complete all Semester 1 chapters first"
      : `Complete Chapter ${chapter.chapterNumber - 1} to unlock`;

    return (
      <Card
        className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
          status === "completed"
            ? "border-[#89E1B8]"
            : status === "unlocked" && !isSemester2Locked
            ? "border-[#A2E7C9]"
            : "border-gray-200"
        }`}
      >
        {/* Status indicator bar */}
        <div
          className={`absolute top-0 left-0 h-1 w-full ${
            status === "completed"
              ? "bg-[#89E1B8]"
              : status === "unlocked" && !isSemester2Locked
              ? "bg-[#A2E7C9]"
              : "bg-gray-200"
          }`}
        ></div>

        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              {status === "completed" ? (
                <div className="p-1.5 rounded-full bg-[#E8FDEF]">
                  <CheckCircle className="w-5 h-5 text-[#89E1B8]" />
                </div>
              ) : status === "locked" || isSemester2Locked ? (
                <div className="p-1.5 rounded-full bg-gray-100">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
              ) : (
                <div className="p-1.5 rounded-full bg-[#E8FDEF]">
                  <Zap className="w-5 h-5 text-[#A2E7C9]" />
                </div>
              )}
              <span className="font-bold text-[#1F2937]">{chapter.title}</span>
            </CardTitle>
            <div className="flex flex-col items-end gap-1">
              <Badge
                variant={
                  status === "completed"
                    ? "default"
                    : status === "unlocked" && !isSemester2Locked
                    ? "secondary"
                    : "outline"
                }
                className="rounded-md"
              >
                {status === "completed"
                  ? "Completed"
                  : status === "unlocked" && !isSemester2Locked
                  ? "Available"
                  : "Locked"}
              </Badge>
              {progress.testScore && (
                <Badge
                  variant="outline"
                  className="text-xs rounded-md bg-[#E8FDEF] border-[#A2E7C9] text-[#1F2937]"
                >
                  <Trophy className="w-3 h-3 mr-1" />
                  {progress.testScore}%
                </Badge>
              )}
            </div>
          </div>
          <CardDescription className="text-[#64748B]">
            Chapter {chapter.chapterNumber ?? "?"} • Semester{" "}
            {chapter.semester ?? 1}
            {isSemester2Locked && (
              <span className="text-[#FF8A6B] ml-2">
                Complete Semester 1 first
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status !== "locked" && !isSemester2Locked && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#64748B]">Progress</span>
                <span className="font-medium text-[#1F2937]">
                  {Math.round(progressPercent)}%
                </span>
              </div>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className={`h-full rounded-full ${
                    status === "completed" ? "bg-[#89E1B8]" : "bg-[#A2E7C9]"
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 text-sm text-[#64748B]">
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{progress.totalPages} pages</span>
            </div>
            {progress.timeSpent > 0 && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{Math.round(progress.timeSpent / 60)}min</span>
              </div>
            )}
            {progress.testScore && (
              <div className="flex items-center gap-1">
                <Award className="w-4 h-4" />
                <span>
                  Mastery:{" "}
                  {progress.testScore >= 95
                    ? "Advanced"
                    : progress.testScore >= 85
                    ? "Intermediate"
                    : "Beginner"}
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {status !== "locked" && !isSemester2Locked && (
              <Link
                href={`/child/subjects/${subjectId}/chapters/${chapter._id}`}
                className="flex-1"
              >
                <Button
                  className={`w-full rounded-lg ${
                    status === "completed"
                      ? "bg-[#E8FDEF] text-[#1F2937] hover:bg-[#D3F8EC] border border-[#A2E7C9]"
                      : "bg-gradient-to-r from-[#A2E7C9] to-[#89E1B8] text-white hover:opacity-90"
                  }`}
                >
                  {status === "completed"
                    ? "Review"
                    : progress.currentPage > 1
                    ? "Continue"
                    : "Start"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
            {status === "completed" && (
              <Link
                href={`/child/subjects/${subjectId}/chapters/${chapter._id}/test`}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg border-[#A2E7C9] text-[#1F2937] hover:bg-[#E8FDEF]"
                >
                  {progress.testScore && progress.testScore >= 80
                    ? "Review Test"
                    : "Retake Test"}
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8 bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9]">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.push("/child/subjects")}
        className="flex items-center gap-2 text-[#64748B] hover:text-[#1F2937] hover:bg-[#E8FDEF]"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Subjects
      </Button>

      {/* Subject Header */}
      <div className={`${subject.bgGradient} rounded-2xl p-6 shadow-sm`}>
        <div className="flex items-center gap-4">
          <div className="text-4xl md:text-5xl">{subject.icon}</div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-gradient-to-r from-[#4B5563] via-[#F97316] to-[#FDBA74] bg-clip-text">
              {subject.name}
            </h1>
            <p className="text-[#64748B]">
              Master the fundamentals and advanced concepts
            </p>
          </div>
        </div>
      </div>

      {/* Semester 1 */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl md:text-2xl font-bold text-[#1F2937]">
            Semester 1
          </h2>
          {semester1Completed && (
            <Badge className="bg-[#89E1B8] hover:bg-[#A2E7C9] text-[#1F2937] rounded-md">
              <CheckCircle className="w-4 h-4 mr-1" />
              Completed
            </Badge>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {semester1Chapters.map((chapter) => (
            <ChapterCard key={`sem1-${chapter._id}`} chapter={chapter} />
          ))}
        </div>
      </div>

      {/* Semester 2 */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl md:text-2xl font-bold text-[#1F2937]">
            Semester 2
          </h2>
          {!semester1Completed && (
            <Badge
              variant="outline"
              className="rounded-md border-[#FF8A6B] text-[#FF8A6B]"
            >
              <Lock className="w-4 h-4 mr-1" />
              Complete Semester 1 to unlock
            </Badge>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {semester2Chapters.map((chapter) => (
            <ChapterCard key={chapter._id} chapter={chapter} />
          ))}
        </div>
      </div>

      {/* Mixed Questions Link */}
      {semester1Completed && (
        <Card className="bg-gradient-to-r from-[#FFEDD5] to-[#FEE2E2] border-[#FECACA] shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-[#FF8A6B]/20">
                  <Award className="w-6 h-6 text-[#FF8A6B]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#1F2937]">
                    Mixed Questions Available!
                  </h3>
                  <p className="text-[#64748B]">
                    Test your knowledge across multiple chapters
                  </p>
                </div>
              </div>
              <Link href="/child/mixed-questions">
                <Button className="bg-gradient-to-r from-[#FF8A6B] to-[#FF9A7A] text-white hover:opacity-90 rounded-lg">
                  Start Challenge <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
