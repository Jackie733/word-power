"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Target, Clock, Info, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PageHeader } from "@/components/page-header";
import { ReviewCard } from "@/components/review-card";
import { toast } from "sonner";

interface Word {
  id: string;
  text: string;
  pronunciation: string;
  meaning: string;
  example: string;
  reviewStage: number;
  nextReviewDate: string;
  masteryLevel: string;
  priority?: number;
}

export default function ReviewWords() {
  const [reviewWords, setReviewWords] = useState<Word[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [completedWords, setCompletedWords] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentWord = reviewWords[currentWordIndex];
  const remainingWords = reviewWords.length - completedWords.length;

  // 获取需要复习的单词
  useEffect(() => {
    fetchReviewWords();
  }, []);

  const fetchReviewWords = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/reviews");

      if (!response.ok) {
        throw new Error("Failed to fetch review words");
      }

      const data = await response.json();
      setReviewWords(data.words || []);
      setError(null);
    } catch (error) {
      console.error("Error fetching review words:", error);
      setError("Unable to fetch review words, please try again later");
      toast.error("Failed to fetch review words");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewResult = async (difficulty: "easy" | "medium" | "hard") => {
    if (!currentWord || isSubmitting) return;

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/reviews/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wordId: currentWord.id,
          difficulty,
          wasCorrect: true, // 在这个简化版本中，我们假设用户总是"看到"了答案
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      // 不再显示每次复习的提醒，只在完成所有复习后显示
      // 标记为已完成
      setCompletedWords(prev => [...prev, currentWord.id]);

      // 移动到下一个单词
      if (currentWordIndex < reviewWords.length - 1) {
        setCurrentWordIndex(prev => prev + 1);
      } else {
        // 所有单词复习完成时显示提醒
        toast.success("All reviews completed! Great job!");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review, please try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetReview = () => {
    setCurrentWordIndex(0);
    setCompletedWords([]);
  };

  const restartReview = () => {
    setCurrentWordIndex(0);
    setCompletedWords([]);
    fetchReviewWords();
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-background via-muted/20 to-background min-h-screen">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
            <motion.div
              className="text-center max-w-lg mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Loader2 className="h-12 w-12 md:h-16 md:w-16 animate-spin mx-auto mb-6 md:mb-8 text-primary" />
              <p className="text-muted-foreground text-base md:text-lg">
                Loading review words...
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-background via-muted/20 to-background min-h-screen">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
            <motion.div
              className="text-center max-w-lg mx-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-6xl md:text-8xl mb-6 md:mb-8">😞</div>
              <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-4 md:mb-6">
                Something went wrong
              </h1>
              <p className="text-muted-foreground text-base md:text-lg mb-8 md:mb-10 px-4">
                {error}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                <Button
                  onClick={fetchReviewWords}
                  size="lg"
                  className="w-full sm:w-auto min-w-[140px]"
                >
                  Retry
                </Button>
                <Button
                  variant="outline"
                  asChild
                  size="lg"
                  className="w-full sm:w-auto min-w-[140px]"
                >
                  <Link href="/">Back to Home</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (reviewWords.length === 0) {
    return (
      <div className="bg-gradient-to-br from-background via-muted/20 to-background min-h-screen">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
            <motion.div
              className="text-center max-w-lg mx-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-6xl md:text-8xl mb-6 md:mb-8">🎉</div>
              <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-4 md:mb-6">
                No words to review today
              </h1>
              <p className="text-muted-foreground text-base md:text-lg mb-8 md:mb-10 px-4">
                You&apos;ve completed all your review tasks!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto min-w-[140px]"
                >
                  <Link href="/learn/new">Learn New Words</Link>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  size="lg"
                  className="w-full sm:w-auto min-w-[140px]"
                >
                  <Link href="/">Back to Home</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (completedWords.length === reviewWords.length) {
    return (
      <div className="bg-gradient-to-br from-background via-muted/20 to-background min-h-screen">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
            <motion.div
              className="text-center max-w-lg mx-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="text-6xl md:text-8xl mb-6 md:mb-8"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
              >
                🎉
              </motion.div>
              <motion.h1
                className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4 md:mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                Review Complete!
              </motion.h1>
              <motion.p
                className="text-muted-foreground text-base md:text-lg mb-8 md:mb-10 px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                You&apos;ve completed today&apos;s review session. You reviewed{" "}
                {reviewWords.length} word{reviewWords.length !== 1 ? "s" : ""}.
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <Button
                  onClick={resetReview}
                  size="lg"
                  className="w-full sm:w-auto min-w-[140px]"
                >
                  Review Again
                </Button>
                <Button
                  onClick={restartReview}
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto min-w-[140px]"
                >
                  Refresh Word List
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="w-full sm:w-auto min-w-[140px]"
                >
                  <Link href="/">Back to Home</Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Page Title and Progress */}
        <PageHeader
          title="Review Words"
          description={`${remainingWords} word${remainingWords !== 1 ? "s" : ""} remaining to review`}
          action={
            <motion.div
              className="flex items-center gap-4 text-sm text-muted-foreground"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                <span className="hidden sm:inline">Progress:</span>
                {completedWords.length + 1} / {reviewWords.length}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span className="hidden sm:inline">Remaining:</span>
                {remainingWords}
              </div>
            </motion.div>
          }
        />

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="mb-6 md:mb-8"
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Review Progress</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(
                    (completedWords.length / reviewWords.length) * 100
                  )}
                  %
                </span>
              </div>
              <Progress
                value={(completedWords.length / reviewWords.length) * 100}
                className="h-2"
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Word Card */}
        <motion.div
          className="w-full md:max-w-2xl md:mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentWord.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.4 }}
              className="md:px-0 -mx-4 md:mx-0"
            >
              <ReviewCard
                word={currentWord.text}
                pronunciation={currentWord.pronunciation}
                meaning={currentWord.meaning}
                example={currentWord.example}
                onAnswer={handleReviewResult}
                disabled={isSubmitting}
                className="md:rounded-lg"
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Review Instructions */}
        <motion.div
          className="mx-auto mt-6 md:mt-8 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.3 }}
        >
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  <span>Review Instructions</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 pl-4 text-sm text-muted-foreground list-disc">
                  <li>
                    <strong>Easy</strong>: You easily recalled this word. The
                    next review interval will be extended.
                  </li>
                  <li>
                    <strong>Medium</strong>: You recalled the word but needed
                    some thinking. The review interval remains normal.
                  </li>
                  <li>
                    <strong>Hard</strong>: You had difficulty recalling this
                    word. The review interval will be shortened.
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
      </div>
    </div>
  );
}
