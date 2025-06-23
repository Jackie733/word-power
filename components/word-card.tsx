"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { type Word } from "@prisma/client";
import { Trash2, Volume2, Calendar, Clock, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface WordCardProps {
  word: Word;
  onDelete: (id: string) => void;
  className?: string;
}

const masteryLevelConfig = {
  NEW: {
    label: "New",
    color: "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300",
    icon: "🆕",
  },
  LEARNING: {
    label: "Learning",
    color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
    icon: "📚",
  },
  REVIEWING: {
    label: "Reviewing",
    color:
      "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
    icon: "🔄",
  },
  MASTERED: {
    label: "Mastered",
    color:
      "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
    icon: "✨",
  },
};

export function WordCard({ word, onDelete, className }: WordCardProps) {
  const playAudio = () => {
    if (word.audioUrl) {
      new Audio(word.audioUrl).play().catch(console.error);
    }
  };

  const masteryConfig =
    masteryLevelConfig[word.masteryLevel as keyof typeof masteryLevelConfig] ||
    masteryLevelConfig.NEW;

  return (
    <motion.div
      className={cn("group", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -2 }}
    >
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-purple-200/20 dark:from-blue-800/20 dark:to-purple-800/20 rounded-full blur-3xl -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-200/20 to-blue-200/20 dark:from-emerald-800/20 dark:to-blue-800/20 rounded-full blur-2xl translate-y-12 -translate-x-12" />

        <CardContent className="p-6 relative z-10">
          {/* Header with Word and Mastery Level */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1 min-w-0">
              <motion.h2
                className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent break-words mb-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                {word.text}
              </motion.h2>
              {word.pronunciation && (
                <motion.div
                  className="flex items-center gap-2 text-muted-foreground"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <span className="text-lg font-medium">
                    {word.pronunciation}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={playAudio}
                    disabled={!word.audioUrl}
                    className="h-7 w-7 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                    aria-label="Play pronunciation"
                  >
                    <Volume2 className="w-3 h-3" />
                  </Button>
                </motion.div>
              )}
            </div>

            <motion.div
              className={cn(
                "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium",
                masteryConfig.color
              )}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <span>{masteryConfig.icon}</span>
              <span>{masteryConfig.label}</span>
            </motion.div>
          </div>

          {/* Content Sections */}
          <div className="space-y-5">
            <motion.div
              className="bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm rounded-xl p-4 border border-white/20 dark:border-slate-600/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <h4 className="font-semibold text-sm mb-3 text-blue-700 dark:text-blue-300 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Definition
              </h4>
              <p className="text-foreground whitespace-pre-wrap leading-relaxed font-medium">
                {word.meaning}
              </p>
            </motion.div>

            {word.example && (
              <motion.div
                className="bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm rounded-xl p-4 border border-white/20 dark:border-slate-600/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <h4 className="font-semibold text-sm mb-3 text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  Example Usage
                </h4>
                <p className="text-muted-foreground italic leading-relaxed font-medium">
                  &ldquo;{word.example}&rdquo;
                </p>
              </motion.div>
            )}
          </div>

          {/* Footer with Metadata and Actions */}
          <motion.div
            className="flex items-center justify-between pt-6 mt-6 border-t border-gradient-to-r from-transparent via-border to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
          >
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3" />
                <span>
                  Added {new Date(word.createdAt).toLocaleDateString()}
                </span>
              </div>
              {word.nextReviewDate && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  <span>
                    Next: {new Date(word.nextReviewDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Target className="w-3 h-3" />
                <span>Stage {word.reviewStage || 0}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {word.audioUrl && (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={playAudio}
                    className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                    aria-label="Play pronunciation"
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(word.id)}
                  className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  aria-label="Delete word"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
