"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  BookOpen,
  RotateCcw,
  TrendingUp,
  MoveRight,
  Plus,
  RefreshCw,
  Library,
  BarChart3,
  Calendar,
  Clock,
  Award,
  Target,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/stat-card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { DashboardStats } from "@/lib/database";

interface DashboardClientProps {
  dashboardData: DashboardStats;
}

export default function DashboardClient({
  dashboardData,
}: DashboardClientProps) {
  const quickActions = [
    {
      href: "/learn/new",
      title: "Learn New Words",
      description: "Add new words to your vocabulary",
      icon: Plus,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      borderColor: "border-emerald-200 dark:border-emerald-800",
    },
    {
      href: "/learn/review",
      title: "Review Words",
      description: "Review words due for practice",
      icon: RefreshCw,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
    {
      href: "/words",
      title: "Word Library",
      description: "Browse and manage your word collection",
      icon: Library,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-200 dark:border-purple-800",
    },
    {
      href: "/stats",
      title: "Learning Stats",
      description: "Check your learning progress and statistics",
      icon: BarChart3,
      color: "text-amber-500",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      borderColor: "border-amber-200 dark:border-amber-800",
    },
  ];

  const masteryLevels = [
    {
      label: "New",
      count: dashboardData.masteryStats.new,
      color: "text-slate-600",
      bgColor: "bg-slate-100 dark:bg-slate-800",
      icon: "🌱",
    },
    {
      label: "Learning",
      count: dashboardData.masteryStats.learning,
      color: "text-amber-600",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
      icon: "📚",
    },
    {
      label: "Review",
      count: dashboardData.masteryStats.review,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      icon: "🔄",
    },
    {
      label: "Mastered",
      count: dashboardData.masteryStats.mastered,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
      icon: "✨",
    },
  ];

  const getTrendData = (
    current: number,
    type: string
  ): { trend: "up" | "down" | "neutral"; trendValue: string } => {
    const mockTrend = Math.floor(Math.random() * 5) + 1;
    const isPositive = Math.random() > 0.3;

    switch (type) {
      case "newWords":
        return {
          trend: isPositive ? "up" : "neutral",
          trendValue: isPositive
            ? `+${mockTrend} vs yesterday`
            : "Same as yesterday",
        };
      case "reviewWords":
        return {
          trend: "neutral",
          trendValue: current > 0 ? "On schedule" : "No reviews due",
        };
      case "completedWords":
        return {
          trend: isPositive ? "up" : "down",
          trendValue: isPositive
            ? `+${mockTrend} vs yesterday`
            : `-${mockTrend} vs yesterday`,
        };
      case "accuracy":
        return {
          trend: current >= 80 ? "up" : current >= 60 ? "neutral" : "down",
          trendValue:
            current >= 80
              ? "Excellent performance"
              : current >= 60
                ? "Good performance"
                : "Needs improvement",
        };
      default:
        return { trend: "neutral", trendValue: "No data" };
    }
  };

  const totalWords = dashboardData.totalWords;
  const masteredWords = dashboardData.masteryStats.mastered;
  const learningProgress =
    totalWords > 0 ? (masteredWords / totalWords) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        {/* Hero Section */}
        <motion.div
          className="mb-8 md:mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent leading-tight">
                Word Power
              </h1>
              <p className="text-base md:text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
                English word learning system based on the Ebbinghaus forgetting
                curve
              </p>
            </motion.div>

            {/* Progress Overview */}
            <motion.div
              className="max-w-md mx-auto bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-slate-700/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Learning Progress
                  </span>
                </div>
                <span className="text-2xl font-bold text-foreground">
                  {Math.round(learningProgress)}%
                </span>
              </div>
              <Progress value={learningProgress} className="mb-2" />
              <p className="text-xs text-muted-foreground text-center">
                Mastered {masteredWords} / {totalWords} words
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Today's Stats Grid */}
        <motion.div
          className="mb-8 md:mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Today&apos;s Overview
            </h2>
            <p className="text-sm text-muted-foreground">
              Track your daily learning progress
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <StatCard
              title="New Words"
              value={dashboardData.todayStats.newWords}
              description="Words learned today"
              icon={<BookOpen className="w-6 h-6" />}
              delay={0.8}
              {...getTrendData(dashboardData.todayStats.newWords, "newWords")}
            />
            <StatCard
              title="To Review"
              value={dashboardData.todayStats.reviewWords}
              description="Words due for review"
              icon={<RotateCcw className="w-6 h-6" />}
              delay={0.9}
              {...getTrendData(
                dashboardData.todayStats.reviewWords,
                "reviewWords"
              )}
            />
            <StatCard
              title="Completed"
              value={dashboardData.todayStats.completedWords}
              description="Words reviewed today"
              icon={<TrendingUp className="w-6 h-6" />}
              delay={1.0}
              {...getTrendData(
                dashboardData.todayStats.completedWords,
                "completedWords"
              )}
            />
            <StatCard
              title="Accuracy"
              value={`${dashboardData.todayStats.accuracy}%`}
              description="Today's review accuracy"
              icon={<Target className="w-6 h-6" />}
              delay={1.1}
              {...getTrendData(dashboardData.todayStats.accuracy, "accuracy")}
            />
          </div>
        </motion.div>

        {/* Mastery Level Distribution */}
        <motion.div
          className="mb-8 md:mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Mastery Distribution
            </h2>
            <p className="text-sm text-muted-foreground">
              Word count by learning stage
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {masteryLevels.map((level, index) => (
              <motion.div
                key={level.label}
                className="group"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4 + index * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <Card className="text-center border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <motion.div
                      className="text-3xl mb-3"
                      whileHover={{ scale: 1.2 }}
                      transition={{ duration: 0.2 }}
                    >
                      {level.icon}
                    </motion.div>
                    <motion.div
                      className={cn("text-3xl font-bold mb-2", level.color)}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.5 + index * 0.1, duration: 0.3 }}
                    >
                      {level.count}
                    </motion.div>
                    <div className="text-sm font-medium text-muted-foreground">
                      {level.label}
                    </div>
                    <div
                      className={cn(
                        "h-1 rounded-full mt-3 transition-all duration-300 group-hover:h-2",
                        level.bgColor
                      )}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Quick Actions */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.6 }}
          >
            <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <motion.div
                    className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.span
                      className="text-white text-lg"
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      ⚡
                    </motion.span>
                  </motion.div>
                  Quick Learning Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <motion.div
                        key={action.href}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: 2.0 + index * 0.15,
                          duration: 0.5,
                        }}
                        whileHover={{ y: -4 }}
                        className="h-full"
                      >
                        <Button
                          asChild
                          variant="outline"
                          className={cn(
                            "w-full h-full p-6 text-left flex-col items-start justify-between space-y-3 group transition-all duration-300 border-2",
                            action.bgColor,
                            action.borderColor,
                            "hover:shadow-lg hover:scale-[1.02]"
                          )}
                        >
                          <Link href={action.href}>
                            <div className="w-full">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-white dark:bg-slate-700 rounded-lg shadow-sm">
                                  <Icon
                                    className={cn("w-6 h-6", action.color)}
                                  />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground">
                                  {action.title}
                                </h3>
                              </div>
                              <p className="text-muted-foreground text-sm leading-relaxed">
                                {action.description}
                              </p>
                            </div>
                            <div className="flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                              Start Learning
                              <MoveRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                            </div>
                          </Link>
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Upcoming Reviews */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.6 }}
          >
            <Card className="border-0 shadow-lg h-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  Words to Review
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.upcomingReviews.length > 0 ? (
                    dashboardData.upcomingReviews.map((review, index) => (
                      <motion.div
                        key={review.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 2.4 + index * 0.1, duration: 0.4 }}
                        whileHover={{ scale: 1.02, x: 4 }}
                        className="group flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-blue-50/50 dark:from-slate-700 dark:to-slate-600 rounded-xl border border-slate-200 dark:border-slate-600 transition-all duration-300 hover:shadow-md cursor-pointer"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-foreground group-hover:text-blue-600 transition-colors">
                            {review.word}
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <Calendar className="w-3 h-3" />
                            {review.nextReview}
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className="text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                        >
                          Stage {review.stage}
                        </Badge>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      className="text-center py-12 text-muted-foreground"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 2.4, duration: 0.5 }}
                    >
                      <motion.div
                        className="text-6xl mb-4"
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        🎉
                      </motion.div>
                      <p className="text-lg font-medium mb-2">
                        No words to review
                      </p>
                      <p className="text-sm">
                        Great job! You&apos;re all caught up!
                      </p>
                    </motion.div>
                  )}
                </div>
                {dashboardData.upcomingReviews.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.8, duration: 0.5 }}
                  >
                    <Button
                      asChild
                      className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Link href="/learn/review">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Start Review
                      </Link>
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
