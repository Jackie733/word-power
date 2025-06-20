"use client";

import { motion } from "motion/react";
import {
  BookOpen,
  CheckCircle,
  Flame,
  Target,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";

export default function StatsPage() {
  // Mock stats data
  const stats = {
    totalWords: 25,
    masteredWords: 8,
    learningWords: 17,
    todayReviewed: 12,
    streakDays: 7,
    totalReviews: 156,
    averageAccuracy: 85,
    weeklyGoal: 50,
    weeklyProgress: 32,
  };

  const recentActivity = [
    { date: "2024-01-18", newWords: 3, reviews: 8, accuracy: 87 },
    { date: "2024-01-17", newWords: 2, reviews: 6, accuracy: 82 },
    { date: "2024-01-16", newWords: 4, reviews: 10, accuracy: 89 },
    { date: "2024-01-15", newWords: 1, reviews: 5, accuracy: 91 },
    { date: "2024-01-14", newWords: 3, reviews: 7, accuracy: 78 },
  ];

  const masteryDistribution = [
    { level: "Mastered (80-100%)", count: 8, color: "bg-green-500" },
    { level: "Good (60-79%)", count: 7, color: "bg-blue-500" },
    { level: "Okay (40-59%)", count: 6, color: "bg-yellow-500" },
    { level: "Needs Improvement (0-39%)", count: 4, color: "bg-red-500" },
  ];

  const getAccuracyBadgeVariant = (
    accuracy: number
  ): "default" | "secondary" | "destructive" => {
    if (accuracy >= 85) return "default";
    if (accuracy >= 70) return "secondary";
    return "destructive";
  };

  return (
    <div className="bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Page Title */}
        <PageHeader
          title="Learning Statistics"
          description="Review your learning progress and achievements"
        />

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <StatCard
            title="Total Words"
            value={stats.totalWords.toString()}
            icon={<BookOpen className="h-6 w-6" />}
            trend="up"
            trendValue="+5"
            className="delay-0"
          />
          <StatCard
            title="Mastered"
            value={stats.masteredWords.toString()}
            description={`${Math.round(
              (stats.masteredWords / stats.totalWords) * 100
            )}% mastery`}
            icon={<CheckCircle className="h-6 w-6" />}
            trend="up"
            trendValue="+3"
            className="delay-100"
          />
          <StatCard
            title="Streak"
            value={`${stats.streakDays} days`}
            icon={<Flame className="h-6 w-6" />}
            trend="up"
            trendValue="+2"
            className="delay-200"
          />
          <StatCard
            title="Average Accuracy"
            value={`${stats.averageAccuracy}%`}
            icon={<Target className="h-6 w-6" />}
            trend="up"
            trendValue="+5%"
            className="delay-300"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Weekly Goal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  This Week&apos;s Goal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700">
                      Review Progress
                    </span>
                    <span className="text-sm font-bold text-slate-600">
                      {stats.weeklyProgress} / {stats.weeklyGoal}
                    </span>
                  </div>
                  <Progress
                    value={Math.min(
                      (stats.weeklyProgress / stats.weeklyGoal) * 100,
                      100
                    )}
                    className="h-3"
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    Need to review{" "}
                    {Math.max(0, stats.weeklyGoal - stats.weeklyProgress)} more
                    words to complete this week&apos;s goal
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    className="rounded-lg border bg-muted/30 p-4 text-center"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="text-2xl font-bold text-primary">
                      {stats.todayReviewed}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Reviewed Today
                    </div>
                  </motion.div>
                  <motion.div
                    className="rounded-lg border bg-muted/30 p-4 text-center"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="text-2xl font-bold text-primary">
                      {stats.totalReviews}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Reviews
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Mastery Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Mastery Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {masteryDistribution.map((item, index) => (
                    <motion.div
                      key={item.level}
                      className="flex items-center justify-between"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded ${item.color}`} />
                        <span className="text-sm font-medium">
                          {item.level}
                        </span>
                      </div>
                      <Badge variant="outline" className="font-mono">
                        {item.count}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <motion.div
          className="mt-6 md:mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.3 }}
        >
          <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((day, index) => (
                  <motion.div
                    key={day.date}
                    className="flex items-center justify-between p-4 rounded-lg border bg-muted/30"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.05, duration: 0.3 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div>
                      <div className="font-medium">
                        {new Date(day.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {day.newWords} new • {day.reviews} reviews
                      </div>
                    </div>
                    <Badge variant={getAccuracyBadgeVariant(day.accuracy)}>
                      {day.accuracy}% accuracy
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
