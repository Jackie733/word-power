"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Target, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WordCard } from "@/components/ui/word-card";
import { AnimatedContainer } from "@/components/ui/animated-container";

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
  // 模拟待复习的单词数据
  const [reviewWords] = useState<Word[]>([
    {
      id: 1,
      word: "serendipity",
      pronunciation: "/ˌserənˈdɪpəti/",
      meaning: "意外发现有价值或令人愉快的事物的能力",
      example: "It was pure serendipity that led me to find this book.",
      reviewStage: 2,
      nextReviewDate: "今天",
    },
    {
      id: 2,
      word: "ubiquitous",
      pronunciation: "/juːˈbɪkwɪtəs/",
      meaning: "无处不在的，普遍存在的",
      example: "Smartphones have become ubiquitous in modern society.",
      reviewStage: 1,
      nextReviewDate: "今天",
    },
    {
      id: 3,
      word: "ephemeral",
      pronunciation: "/ɪˈfem(ə)rəl/",
      meaning: "短暂的，瞬息的",
      example: "The beauty of cherry blossoms is ephemeral.",
      reviewStage: 3,
      nextReviewDate: "今天",
    },
  ]);

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [completedWords, setCompletedWords] = useState<number[]>([]);

  const currentWord = reviewWords[currentWordIndex];
  const remainingWords = reviewWords.length - completedWords.length;

  const handleReviewResult = (difficulty: "easy" | "medium" | "hard") => {
    // 记录复习结果
    console.log(`单词 ${currentWord.word} 复习结果: ${difficulty}`);

    // 标记为已完成
    setCompletedWords(prev => [...prev, currentWord.id]);

    // 移动到下一个单词
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            今天没有需要复习的单词
          </h1>
          <p className="text-gray-600 mb-6">您已经完成了所有的复习任务！</p>
          <Link
            href="/"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            返回仪表板
          </Link>
        </div>
      </div>
    );
  }

  if (completedWords.length === reviewWords.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center">
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
            复习完成！
          </motion.h1>
          <motion.p
            className="text-muted-foreground mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            您已经完成了今天的所有复习任务，共复习了 {reviewWords.length} 个单词
          </motion.p>
          <motion.div
            className="flex gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Button onClick={resetReview} size="lg">
              重新复习
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/">返回仪表板</Link>
            </Button>
          </motion.div>
        </AnimatedContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题和进度 */}
        <AnimatedContainer variant="slideDown" className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                返回仪表板
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
                进度: {completedWords.length + 1} / {reviewWords.length}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                剩余: {remainingWords}
              </div>
            </motion.div>
          </div>
          <motion.h1
            className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            复习单词
          </motion.h1>
          <motion.p
            className="text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            还有 {remainingWords} 个单词需要复习
          </motion.p>
        </AnimatedContainer>

        {/* 进度条 */}
        <AnimatedContainer variant="slideUp" delay={0.3} className="mb-8">
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
        </AnimatedContainer>

        {/* 单词卡片 */}
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

        {/* 复习说明 */}
        <AnimatedContainer variant="slideUp" delay={0.7} className="mt-8">
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="text-blue-800 flex items-center gap-2">
                💡 复习说明
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-blue-700 text-sm">
                <motion.li
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.3 }}
                >
                  • <strong>简单</strong>
                  ：您很容易记起这个单词，下次复习间隔会延长
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9, duration: 0.3 }}
                >
                  • <strong>一般</strong>：您能记起但需要思考，按正常间隔复习
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0, duration: 0.3 }}
                >
                  • <strong>困难</strong>：您很难记起这个单词，会缩短复习间隔
                </motion.li>
              </ul>
            </CardContent>
          </Card>
        </AnimatedContainer>
      </div>
    </div>
  );
}
