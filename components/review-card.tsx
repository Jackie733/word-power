"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Volume2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ReviewCardProps {
  word: string;
  pronunciation?: string;
  meaning: string;
  example?: string;
  onAnswer?: (difficulty: "easy" | "medium" | "hard") => void;
  disabled?: boolean;
  className?: string;
}

export function ReviewCard({
  word,
  pronunciation,
  meaning,
  example,
  onAnswer,
  disabled = false,
  className,
}: ReviewCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    setIsFlipped(false);
    setShowAnswer(false);
  }, [word]);

  const handleFlip = () => {
    if (disabled) return;
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      setTimeout(() => setShowAnswer(true), 300);
    } else {
      setShowAnswer(false);
    }
  };

  const handleAnswer = (difficulty: "easy" | "medium" | "hard") => {
    if (disabled) return;
    onAnswer?.(difficulty);
  };

  return (
    <div className={cn("perspective-1000", className)}>
      <motion.div
        className="relative w-full h-[70vh] md:h-96 lg:h-[32rem] preserve-3d cursor-pointer"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        onClick={!isFlipped ? handleFlip : undefined}
      >
        {/* Front - Word */}
        <Card className="absolute inset-0 backface-hidden md:rounded-lg">
          <CardContent className="flex flex-col items-center justify-center h-full p-6 md:p-8 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="space-y-4 md:space-y-6"
            >
              <h2 className="text-4xl md:text-4xl lg:text-5xl font-bold text-primary break-words px-4">
                {word}
              </h2>
              {pronunciation && (
                <div className="flex items-center justify-center gap-2 text-muted-foreground px-4">
                  <span className="text-lg md:text-lg">{pronunciation}</span>
                  <Button variant="ghost" size="sm">
                    <Volume2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
              <motion.div
                className="mt-8 md:mt-8 text-muted-foreground px-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                <p className="text-base md:text-base">
                  Click to see the definition
                </p>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>

        {/* Back - Definition */}
        <Card className="absolute inset-0 backface-hidden rotate-y-180 md:rounded-lg">
          <CardContent className="flex flex-col h-full p-4 md:p-6">
            <AnimatePresence>
              {showAnswer && (
                <>
                  {/* Header - Fixed at top */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="flex-shrink-0 text-center pb-4 md:pb-6 border-b border-border"
                  >
                    <h3 className="text-2xl md:text-2xl lg:text-3xl font-semibold text-primary mb-2 break-words px-2">
                      {word}
                    </h3>
                    {pronunciation && (
                      <p className="text-base md:text-base text-muted-foreground px-2">
                        {pronunciation}
                      </p>
                    )}
                  </motion.div>

                  {/* Content - Scrollable area */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="flex-1 overflow-y-auto py-4 md:py-6 space-y-4 md:space-y-6 min-h-0"
                  >
                    <div>
                      <h4 className="font-medium text-sm md:text-sm text-muted-foreground mb-2 md:mb-3">
                        Definition
                      </h4>
                      <p className="text-lg md:text-lg leading-relaxed">
                        {meaning}
                      </p>
                    </div>

                    {example && (
                      <div>
                        <h4 className="font-medium text-sm md:text-sm text-muted-foreground mb-2 md:mb-3">
                          Example
                        </h4>
                        <p className="text-base md:text-base italic text-muted-foreground leading-relaxed">
                          {example}
                        </p>
                      </div>
                    )}
                  </motion.div>

                  {/* Buttons - Fixed at bottom */}
                  {onAnswer && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                      className="flex-shrink-0 pt-4 md:pt-6 border-t border-border"
                    >
                      <div className="grid grid-cols-3 gap-3 md:gap-4">
                        <Button
                          onClick={() => handleAnswer("hard")}
                          variant="outline"
                          disabled={disabled}
                          className="text-red-600 border-red-200 hover:bg-red-50 disabled:opacity-50 text-sm md:text-sm py-3 md:py-3 h-12 md:h-auto"
                        >
                          Hard
                        </Button>
                        <Button
                          onClick={() => handleAnswer("medium")}
                          variant="outline"
                          disabled={disabled}
                          className="text-yellow-600 border-yellow-200 hover:bg-yellow-50 disabled:opacity-50 text-sm md:text-sm py-3 md:py-3 h-12 md:h-auto"
                        >
                          Medium
                        </Button>
                        <Button
                          onClick={() => handleAnswer("easy")}
                          variant="outline"
                          disabled={disabled}
                          className="text-green-600 border-green-200 hover:bg-green-50 disabled:opacity-50 text-sm md:text-sm py-3 md:py-3 h-12 md:h-auto"
                        >
                          Easy
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* Flip Hint */}
      {isFlipped && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-4 md:mt-6"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFlip}
            className="text-muted-foreground text-sm md:text-sm"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Word Again
          </Button>
        </motion.div>
      )}
    </div>
  );
}
