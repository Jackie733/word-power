"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Target, Clock, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { WordCard } from "@/components/ui/word-card";
import { AnimatedContainer } from "@/components/animated-container";

interface Word {
  id: number;
  word: string;
  pronunciation: string;
  meaning: string;
  example: string;
  reviewStage: number;
  nextReviewDate: string;
}

export default function ReviewWords() {
  // Mock data for words to review
  const [reviewWords] = useState<Word[]>([
    {
      id: 1,
      word: "serendipity",
      pronunciation: "/ˌserənˈdɪpəti/",
      meaning:
        "The faculty of making happy and unexpected discoveries by accident.",
      example: "It was pure serendipity that led me to find this book.",
      reviewStage: 2,
      nextReviewDate: "Today",
    },
    {
      id: 2,
      word: "ubiquitous",
      pronunciation: "/juːˈbɪkwɪtəs/",
      meaning: "Present, appearing, or found everywhere.",
      example: "Smartphones have become ubiquitous in modern society.",
      reviewStage: 1,
      nextReviewDate: "Today",
    },
    {
      id: 3,
      word: "ephemeral",
      pronunciation: "/ɪˈfem(ə)rəl/",
      meaning: "Lasting for a very short time.",
      example: "The beauty of cherry blossoms is ephemeral.",
      reviewStage: 3,
      nextReviewDate: "Today",
    },
  ]);

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [completedWords, setCompletedWords] = useState<number[]>([]);

  const currentWord = reviewWords[currentWordIndex];
  const remainingWords = reviewWords.length - completedWords.length;

  const handleReviewResult = (difficulty: "easy" | "medium" | "hard") => {
    // Record review result
    console.log(`Review result for word ${currentWord.word}: ${difficulty}`);

    // Mark as completed
    setCompletedWords(prev => [...prev, currentWord.id]);

    // Move to the next word
    if (currentWordIndex < reviewWords.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
    }
  };

  const resetReview = () => {
    setCurrentWordIndex(0);
    setCompletedWords([]);
  };

  if (reviewWords.length === 0) {
    return (
      <div className="flex flex-grow items-center justify-center bg-background">
        <AnimatedContainer variant="scale" className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            No words to review today
          </h1>
          <p className="text-muted-foreground mb-6">
            You have completed all review tasks!
          </p>
          <Button asChild>
            <Link href="/">Back to Dashboard</Link>
          </Button>
        </AnimatedContainer>
      </div>
    );
  }

  if (completedWords.length === reviewWords.length) {
    return (
      <div className="bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center flex-grow">
        <AnimatedContainer variant="scale" className="text-center">
          <motion.div
            className="text-6xl mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
          >
            🎉
          </motion.div>
          <motion.h1
            className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Review Complete!
          </motion.h1>
          <motion.p
            className="text-muted-foreground mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            You have completed all review tasks for today, reviewing{" "}
            {reviewWords.length} words in total.
          </motion.p>
          <motion.div
            className="flex gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Button onClick={resetReview} size="lg">
              Review Again
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/">Back to Dashboard</Link>
            </Button>
          </motion.div>
        </AnimatedContainer>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Page Title and Progress */}
        <AnimatedContainer variant="slideDown" className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
            </Button>
            <motion.div
              className="flex items-center gap-4 text-sm text-muted-foreground"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                Progress: {completedWords.length + 1} / {reviewWords.length}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Remaining: {remainingWords}
              </div>
            </motion.div>
          </div>
          <motion.h1
            className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            Review Words
          </motion.h1>
          <motion.p
            className="text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            There are {remainingWords} words left to review.
          </motion.p>
        </AnimatedContainer>

        {/* Progress Bar */}
        <AnimatedContainer variant="slideUp" delay={0.3} className="mb-8">
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
        </AnimatedContainer>

        {/* Word Card */}
        <AnimatedContainer
          variant="scale"
          delay={0.5}
          className="max-w-2xl mx-auto"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentWord.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.4 }}
            >
              <WordCard
                word={currentWord.word}
                pronunciation={currentWord.pronunciation}
                meaning={currentWord.meaning}
                example={currentWord.example}
                onAnswer={handleReviewResult}
              />
            </motion.div>
          </AnimatePresence>
        </AnimatedContainer>

        {/* Review Instructions */}
        <AnimatedContainer
          variant="slideUp"
          delay={0.7}
          className="mx-auto mt-8 max-w-2xl"
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
                    <strong>Easy</strong>: You recall this word easily. The next
                    review interval will be extended.
                  </li>
                  <li>
                    <strong>Medium</strong>: You recall the word, but it
                    requires some thought. The review interval will be normal.
                  </li>
                  <li>
                    <strong>Hard</strong>: You have difficulty recalling this
                    word. The review interval will be shortened.
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </AnimatedContainer>
      </div>
    </div>
  );
}
