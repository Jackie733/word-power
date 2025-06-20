"use client";

import Link from "next/link";
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
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/stat-card";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  // Mock data - in a real app, this would come from your database
  const todayStats = {
    newWords: 5,
    reviewWords: 12,
    completedWords: 8,
    accuracy: 85,
  };

  const upcomingReviews = [
    { id: 1, word: "serendipity", stage: 3, nextReview: "In 2 hours" },
    { id: 2, word: "ephemeral", stage: 2, nextReview: "In 4 hours" },
    { id: 3, word: "ubiquitous", stage: 1, nextReview: "Tomorrow" },
  ];

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
        </motion.div>

        {/* Today's Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <StatCard
            title="New Words"
            value={todayStats.newWords}
            description="Words learned today"
            icon={<BookOpen className="w-6 h-6" />}
            delay={0}
            trend="up"
            trendValue="+3 vs yesterday"
          />
          <StatCard
            title="Words to Review"
            value={todayStats.reviewWords}
            description="Words due for review"
            icon={<RotateCcw className="w-6 h-6" />}
            delay={0.1}
            trend="neutral"
            trendValue="On schedule"
          />
          <StatCard
            title="Completed"
            value={todayStats.completedWords}
            description="Words reviewed today"
            icon={<TrendingUp className="w-6 h-6" />}
            delay={0.2}
            trend="up"
            trendValue="+5 vs yesterday"
          />
          <StatCard
            title="Accuracy"
            value={`${todayStats.accuracy}%`}
            description="Today's review accuracy"
            icon="🎯"
            delay={0.3}
            trend="up"
            trendValue="+2% vs yesterday"
          />
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Quick Start */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
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
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
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
            transition={{ delay: 0.6, duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📋 Words to Review
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingReviews.map((review, index) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1, duration: 0.3 }}
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
                  ))}
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.3 }}
                >
                  <Button
                    asChild
                    variant="outline"
                    className="w-full mt-4 hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <Link href="/learn/review">View All</Link>
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
