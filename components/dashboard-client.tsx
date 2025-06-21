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
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/stat-card";
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
      color: "text-green-500",
    },
    {
      href: "/learn/review",
      title: "Review Words",
      description: "Review words due for practice",
      icon: RefreshCw,
      color: "text-blue-500",
    },
    {
      href: "/words",
      title: "Word Library",
      description: "Browse and manage your word collection",
      icon: Library,
      color: "text-purple-500",
    },
    {
      href: "/stats",
      title: "Learning Stats",
      description: "Check your learning progress and statistics",
      icon: BarChart3,
      color: "text-orange-500",
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

  return (
    <div className="bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Page Title */}
        <motion.div
          className="mb-6 md:mb-8"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent leading-tight mb-1">
            Word Power
          </h1>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            English word learning system based on the Ebbinghaus forgetting
            curve
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Total vocabulary: {dashboardData.totalWords} words
          </p>
        </motion.div>

        {/* Today's Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <StatCard
            title="New Words"
            value={dashboardData.todayStats.newWords}
            description="Words learned today"
            icon={<BookOpen className="w-6 h-6" />}
            delay={0}
            {...getTrendData(dashboardData.todayStats.newWords, "newWords")}
          />
          <StatCard
            title="Words to Review"
            value={dashboardData.todayStats.reviewWords}
            description="Words due for review"
            icon={<RotateCcw className="w-6 h-6" />}
            delay={0.1}
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
            delay={0.2}
            {...getTrendData(
              dashboardData.todayStats.completedWords,
              "completedWords"
            )}
          />
          <StatCard
            title="Accuracy"
            value={`${dashboardData.todayStats.accuracy}%`}
            description="Today's review accuracy"
            icon="🎯"
            delay={0.3}
            {...getTrendData(dashboardData.todayStats.accuracy, "accuracy")}
          />
        </div>

        {/* Mastery Level Statistics */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 md:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <Card className="text-center">
            <CardContent className="p-4">
              <motion.div
                className="text-2xl font-bold text-blue-600"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                {dashboardData.masteryStats.new}
              </motion.div>
              <div className="text-sm text-muted-foreground">New</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <motion.div
                className="text-2xl font-bold text-orange-600"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, duration: 0.3 }}
              >
                {dashboardData.masteryStats.learning}
              </motion.div>
              <div className="text-sm text-muted-foreground">Learning</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <motion.div
                className="text-2xl font-bold text-purple-600"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, duration: 0.3 }}
              >
                {dashboardData.masteryStats.review}
              </motion.div>
              <div className="text-sm text-muted-foreground">Review</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <motion.div
                className="text-2xl font-bold text-green-600"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, duration: 0.3 }}
              >
                {dashboardData.masteryStats.mastered}
              </motion.div>
              <div className="text-sm text-muted-foreground">Mastered</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Quick Start */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <motion.span
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    ⚡
                  </motion.span>
                  Today&apos;s Learning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <motion.div
                        key={action.href}
                        className="h-full"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.0 + index * 0.1, duration: 0.3 }}
                      >
                        <Button
                          asChild
                          variant="outline"
                          className="w-full h-full p-6 text-left flex-col items-start justify-between space-y-2 group hover:bg-muted/50 transition-all duration-300"
                        >
                          <Link href={action.href}>
                            <div>
                              <Icon
                                className={cn(
                                  "w-8 h-8 mb-2 transition-colors",
                                  action.color
                                )}
                              />
                              <h3 className="text-lg font-semibold">
                                {action.title}
                              </h3>
                              <p className="text-muted-foreground text-sm">
                                {action.description}
                              </p>
                            </div>
                            <div className="flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                              Go
                              <MoveRight className="w-4 h-4 ml-1" />
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

          {/* Words to Review */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📋 Words to Review
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
                        transition={{ delay: 1.2 + index * 0.1, duration: 0.3 }}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border transition-all duration-200 hover:shadow-sm"
                      >
                        <div>
                          <p className="font-medium">{review.word}</p>
                          <p className="text-sm text-muted-foreground">
                            {review.nextReview}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          Stage {review.stage}
                        </Badge>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      className="text-center py-8 text-muted-foreground"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.2, duration: 0.3 }}
                    >
                      <div className="text-4xl mb-2">🎉</div>
                      <p>No words to review</p>
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
                    transition={{ delay: 1.5, duration: 0.3 }}
                  >
                    <Button
                      asChild
                      variant="outline"
                      className="w-full mt-4 hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <Link href="/learn/review">Start Review</Link>
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
