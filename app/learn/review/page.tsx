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
      setError("无法获取复习单词，请稍后重试");
      toast.error("获取复习单词失败");
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

      const result = await response.json();

      // 显示复习结果
      const nextReviewDays = Math.ceil(
        (new Date(result.nextReview.nextDate).getTime() -
          new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      );

      let message = `复习完成！`;
      if (nextReviewDays <= 1) {
        message += ` 明天再次复习`;
      } else if (nextReviewDays <= 7) {
        message += ` ${nextReviewDays}天后复习`;
      } else {
        message += ` ${Math.ceil(nextReviewDays / 7)}周后复习`;
      }

      toast.success(message);

      // 标记为已完成
      setCompletedWords(prev => [...prev, currentWord.id]);

      // 移动到下一个单词
      if (currentWordIndex < reviewWords.length - 1) {
        setCurrentWordIndex(prev => prev + 1);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("提交复习结果失败，请重试");
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
      <div className="flex flex-grow items-center justify-center bg-background">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">正在加载复习单词...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-grow items-center justify-center bg-background">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-6xl mb-4">😞</div>
          <h1 className="text-2xl font-bold text-foreground mb-2">出错了</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={fetchReviewWords}>重试</Button>
            <Button variant="outline" asChild>
              <Link href="/">返回首页</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (reviewWords.length === 0) {
    return (
      <div className="flex flex-grow items-center justify-center bg-background">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            今天没有需要复习的单词
          </h1>
          <p className="text-muted-foreground mb-6">
            您已经完成了所有复习任务！
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/learn/new">学习新单词</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">返回首页</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (completedWords.length === reviewWords.length) {
    return (
      <div className="bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center flex-grow">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
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
            复习完成！
          </motion.h1>
          <motion.p
            className="text-muted-foreground mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            您已经完成了今天的复习任务，共复习了 {reviewWords.length} 个单词。
          </motion.p>
          <motion.div
            className="flex gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Button onClick={resetReview} size="lg">
              再次复习
            </Button>
            <Button onClick={restartReview} variant="outline" size="lg">
              刷新单词列表
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/">返回首页</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Page Title and Progress */}
        <PageHeader
          title="复习单词"
          description={`还有 ${remainingWords} 个单词需要复习`}
          action={
            <motion.div
              className="flex items-center gap-4 text-sm text-muted-foreground"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                <span className="hidden sm:inline">进度:</span>
                {completedWords.length + 1} / {reviewWords.length}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span className="hidden sm:inline">剩余:</span>
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
                <span className="text-sm font-medium">复习进度</span>
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
          className="max-w-2xl mx-auto"
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
                  <span>复习说明</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 pl-4 text-sm text-muted-foreground list-disc">
                  <li>
                    <strong>简单</strong>
                    ：您很容易回忆起这个单词。下次复习间隔会延长。
                  </li>
                  <li>
                    <strong>一般</strong>
                    ：您能回忆起单词，但需要一些思考。复习间隔保持正常。
                  </li>
                  <li>
                    <strong>困难</strong>
                    ：您很难回忆起这个单词。复习间隔会缩短。
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
