"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Volume2, Eye, RotateCcw } from "lucide-react";
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
        whileHover={!isFlipped ? { scale: 1.02 } : {}}
      >
        {/* Front - Word */}
        <Card className="absolute inset-0 backface-hidden border-0 shadow-xl bg-gradient-to-br from-white via-blue-50/50 to-purple-50/50 dark:from-slate-800 dark:via-blue-900/20 dark:to-purple-900/20 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center h-full p-6 md:p-8 text-center relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-purple-200/30 dark:from-blue-800/20 dark:to-purple-800/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-200/30 to-pink-200/30 dark:from-purple-800/20 dark:to-pink-800/20 rounded-full blur-2xl" />

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="space-y-4 md:space-y-6 relative z-10"
            >
              <motion.div
                className="p-4 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-slate-600/20 shadow-lg"
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent break-words px-4">
                  {word}
                </h2>
              </motion.div>

              {pronunciation && (
                <motion.div
                  className="flex items-center justify-center gap-3 text-muted-foreground px-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  <span className="text-lg md:text-xl font-medium">
                    {pronunciation}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 rounded-full bg-white/50 dark:bg-slate-700/50 hover:bg-white/80 dark:hover:bg-slate-600/80 backdrop-blur-sm"
                  >
                    <Volume2 className="w-4 h-4" />
                  </Button>
                </motion.div>
              )}

              <motion.div
                className="mt-8 md:mt-12 px-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.3 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-400/10 dark:to-purple-400/10 rounded-full border border-blue-200/50 dark:border-blue-700/50 backdrop-blur-sm">
                  <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <p className="text-sm md:text-base text-blue-700 dark:text-blue-300 font-medium">
                    Tap to reveal definition
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>

        {/* Back - Definition */}
        <Card className="absolute inset-0 backface-hidden rotate-y-180 border-0 shadow-xl bg-gradient-to-br from-white via-emerald-50/50 to-blue-50/50 dark:from-slate-800 dark:via-emerald-900/20 dark:to-blue-900/20 backdrop-blur-sm">
          <CardContent className="flex flex-col h-full p-4 md:p-6 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-28 h-28 bg-gradient-to-br from-emerald-200/30 to-blue-200/30 dark:from-emerald-800/20 dark:to-blue-800/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tr from-blue-200/30 to-purple-200/30 dark:from-blue-800/20 dark:to-purple-800/20 rounded-full blur-2xl" />

            <AnimatePresence>
              {showAnswer && (
                <>
                  {/* Header - Fixed at top */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="flex-shrink-0 text-center pb-4 md:pb-6 border-b border-gradient-to-r from-transparent via-border to-transparent relative z-10"
                  >
                    <div className="bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm rounded-xl p-4 border border-white/20 dark:border-slate-600/20 shadow-lg">
                      <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 break-words px-2">
                        {word}
                      </h3>
                      {pronunciation && (
                        <p className="text-base md:text-lg text-muted-foreground px-2 font-medium">
                          {pronunciation}
                        </p>
                      )}
                    </div>
                  </motion.div>

                  {/* Content - Scrollable area */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="flex-1 overflow-y-auto py-4 md:py-6 space-y-4 md:space-y-6 min-h-0 relative z-10"
                  >
                    <motion.div
                      className="bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm rounded-xl p-4 border border-white/20 dark:border-slate-600/20 shadow-lg"
                      whileHover={{ scale: 1.02, y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h4 className="font-semibold text-sm md:text-base text-emerald-700 dark:text-emerald-300 mb-2 md:mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        Definition
                      </h4>
                      <p className="text-lg md:text-xl leading-relaxed text-foreground font-medium">
                        {meaning}
                      </p>
                    </motion.div>

                    {example && (
                      <motion.div
                        className="bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm rounded-xl p-4 border border-white/20 dark:border-slate-600/20 shadow-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                      >
                        <h4 className="font-semibold text-sm md:text-base text-blue-700 dark:text-blue-300 mb-2 md:mb-3 flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          Example Usage
                        </h4>
                        <p className="text-base md:text-lg italic text-muted-foreground leading-relaxed font-medium">
                          &ldquo;{example}&rdquo;
                        </p>
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Buttons - Fixed at bottom */}
                  {onAnswer && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                      className="flex-shrink-0 pt-4 md:pt-6 border-t border-gradient-to-r from-transparent via-border to-transparent relative z-10"
                    >
                      <div className="grid grid-cols-3 gap-3 md:gap-4">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            onClick={() => handleAnswer("hard")}
                            variant="outline"
                            disabled={disabled}
                            className="w-full text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 text-sm md:text-base py-3 md:py-4 h-auto font-semibold bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border-2 hover:border-red-300 transition-all duration-300"
                          >
                            Hard
                          </Button>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            onClick={() => handleAnswer("medium")}
                            variant="outline"
                            disabled={disabled}
                            className="w-full text-amber-600 border-amber-200 hover:bg-amber-50 dark:hover:bg-amber-900/20 disabled:opacity-50 text-sm md:text-base py-3 md:py-4 h-auto font-semibold bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border-2 hover:border-amber-300 transition-all duration-300"
                          >
                            Medium
                          </Button>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            onClick={() => handleAnswer("easy")}
                            variant="outline"
                            disabled={disabled}
                            className="w-full text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 disabled:opacity-50 text-sm md:text-base py-3 md:py-4 h-auto font-semibold bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border-2 hover:border-emerald-300 transition-all duration-300"
                          >
                            Easy
                          </Button>
                        </motion.div>
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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-4 md:mt-6"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFlip}
            disabled={disabled}
            className="text-muted-foreground hover:text-foreground transition-colors bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-slate-700/20"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Flip back to word
          </Button>
        </motion.div>
      )}
    </div>
  );
}
