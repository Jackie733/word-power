"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Target, Info, Loader2, RefreshCw, Home } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
          wasCorrect: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      setCompletedWords(prev => [...prev, currentWord.id]);

      if (currentWordIndex < reviewWords.length - 1) {
        setCurrentWordIndex(prev => prev + 1);
      } else {
        toast.success("All reviews completed! Great job!");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review, please try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  const restartReview = () => {
    setCurrentWordIndex(0);
    setCompletedWords([]);
    fetchReviewWords();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-blue-900/20">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
            <motion.div
              className="text-center max-w-lg mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8 p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-slate-700/50 shadow-xl">
                <Loader2 className="h-16 w-16 animate-spin mx-auto mb-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  Loading Reviews
                </h2>
                <p className="text-muted-foreground text-lg">
                  Preparing your review session...
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-red-900/20">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
            <motion.div
              className="text-center max-w-lg mx-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="text-6xl mb-6">😞</div>
                  <h1 className="text-3xl font-bold text-foreground mb-4">
                    Something went wrong
                  </h1>
                  <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                    {error}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={fetchReviewWords}
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                    <Button
                      variant="outline"
                      asChild
                      size="lg"
                      className="border-2"
                    >
                      <Link href="/">
                        <Home className="w-4 h-4 mr-2" />
                        Back to Home
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (reviewWords.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-900/20">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
            <motion.div
              className="text-center max-w-lg mx-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="text-6xl mb-6">🎉</div>
                  <h1 className="text-3xl font-bold text-foreground mb-4">
                    All caught up!
                  </h1>
                  <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                    No words need reviewing right now. Great job keeping up with
                    your studies!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      asChild
                      size="lg"
                      className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Link href="/learn/new">
                        <Target className="w-4 h-4 mr-2" />
                        Learn New Words
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      asChild
                      size="lg"
                      className="border-2"
                    >
                      <Link href="/">
                        <Home className="w-4 h-4 mr-2" />
                        Back to Dashboard
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (remainingWords === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-900/20">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
            <motion.div
              className="text-center max-w-lg mx-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
                <CardContent className="p-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="text-6xl mb-6"
                  >
                    🏆
                  </motion.div>
                  <h1 className="text-3xl font-bold text-foreground mb-4">
                    Session Complete!
                  </h1>
                  <p className="text-muted-foreground text-lg mb-2">
                    You reviewed <strong>{reviewWords.length}</strong> words
                  </p>
                  <p className="text-muted-foreground text-base mb-8 leading-relaxed">
                    Keep up the great work! Regular practice helps improve
                    retention.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={restartReview}
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Review Again
                    </Button>
                    <Button
                      variant="outline"
                      asChild
                      size="lg"
                      className="border-2"
                    >
                      <Link href="/">
                        <Home className="w-4 h-4 mr-2" />
                        Back to Dashboard
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  const progressPercentage =
    ((reviewWords.length - remainingWords) / reviewWords.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-purple-900/20">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Target className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Progress</h3>
                    <p className="text-sm text-muted-foreground">
                      {completedWords.length} of {reviewWords.length} completed
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(progressPercentage)}%
                  </div>
                </div>
              </div>
              <Progress value={progressPercentage} className="h-3" />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          key={currentWord?.id}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <ReviewCard
            word={currentWord.text}
            pronunciation={currentWord.pronunciation}
            meaning={currentWord.meaning}
            example={currentWord.example}
            onAnswer={handleReviewResult}
            disabled={isSubmitting}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="tips" className="border-0">
              <AccordionTrigger className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-t-xl px-6 py-4 hover:no-underline border-0 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Info className="w-5 h-5 text-purple-600" />
                  </div>
                  <span className="font-semibold">Review Tips</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-b-xl px-6 pb-6 border-0 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                  <div className="p-4 bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-xl">
                    <div className="text-2xl mb-2">💚</div>
                    <h4 className="font-semibold text-emerald-700 dark:text-emerald-300 mb-1">
                      Easy
                    </h4>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400">
                      You remembered it instantly
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl">
                    <div className="text-2xl mb-2">🟡</div>
                    <h4 className="font-semibold text-amber-700 dark:text-amber-300 mb-1">
                      Medium
                    </h4>
                    <p className="text-sm text-amber-600 dark:text-amber-400">
                      It took some thought
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl">
                    <div className="text-2xl mb-2">🔴</div>
                    <h4 className="font-semibold text-red-700 dark:text-red-300 mb-1">
                      Hard
                    </h4>
                    <p className="text-sm text-red-600 dark:text-red-400">
                      You struggled or forgot
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
      </div>
    </div>
  );
}
