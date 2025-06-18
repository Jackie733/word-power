"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Volume2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface WordCardProps {
  word: string;
  pronunciation?: string;
  meaning: string;
  example?: string;
  onAnswer?: (difficulty: "easy" | "medium" | "hard") => void;
  className?: string;
}

export function WordCard({
  word,
  pronunciation,
  meaning,
  example,
  onAnswer,
  className,
}: WordCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      setTimeout(() => setShowAnswer(true), 300);
    } else {
      setShowAnswer(false);
    }
  };

  const handleAnswer = (difficulty: "easy" | "medium" | "hard") => {
    onAnswer?.(difficulty);
    setIsFlipped(false);
    setShowAnswer(false);
  };

  return (
    <div className={cn("perspective-1000", className)}>
      <motion.div
        className="relative w-full h-80 preserve-3d cursor-pointer"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        onClick={!isFlipped ? handleFlip : undefined}
      >
        {/* 正面 - 单词 */}
        <Card className="absolute inset-0 backface-hidden">
          <CardContent className="flex flex-col items-center justify-center h-full p-8 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="space-y-4"
            >
              <h2 className="text-4xl font-bold text-primary">{word}</h2>
              {pronunciation && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-lg">{pronunciation}</span>
                  <Button variant="ghost" size="sm">
                    <Volume2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
              <motion.div
                className="mt-8 text-muted-foreground"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                <p className="text-sm">点击查看释义</p>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>

        {/* 背面 - 释义 */}
        <Card className="absolute inset-0 backface-hidden rotate-y-180">
          <CardContent className="flex flex-col justify-between h-full p-8">
            <AnimatePresence>
              {showAnswer && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h3 className="text-2xl font-semibold text-primary mb-2">
                      {word}
                    </h3>
                    {pronunciation && (
                      <p className="text-muted-foreground">{pronunciation}</p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-1">
                        释义
                      </h4>
                      <p className="text-lg">{meaning}</p>
                    </div>

                    {example && (
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">
                          例句
                        </h4>
                        <p className="text-sm italic text-muted-foreground">
                          {example}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {showAnswer && onAnswer && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="grid grid-cols-3 gap-2 mt-6"
              >
                <Button
                  onClick={() => handleAnswer("hard")}
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  困难
                </Button>
                <Button
                  onClick={() => handleAnswer("medium")}
                  variant="outline"
                  className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                >
                  一般
                </Button>
                <Button
                  onClick={() => handleAnswer("easy")}
                  variant="outline"
                  className="text-green-600 border-green-200 hover:bg-green-50"
                >
                  简单
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* 翻转提示 */}
      {isFlipped && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-4"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFlip}
            className="text-muted-foreground"
          >
            <Eye className="w-4 h-4 mr-2" />
            再次查看单词
          </Button>
        </motion.div>
      )}
    </div>
  );
}
