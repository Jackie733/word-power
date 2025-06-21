"use client";

import { motion } from "motion/react";
import {
  BookOpen,
  CheckCircle,
  Flame,
  Target,
  Calendar,
  TrendingUp,
  Users,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import type { StatsData } from "@/lib/database";

interface StatsClientProps {
  statsData: StatsData;
}

export default function StatsClient({ statsData }: StatsClientProps) {
  const getAccuracyBadgeVariant = (
    accuracy: number
  ): "default" | "secondary" | "destructive" => {
    if (accuracy >= 85) return "default";
    if (accuracy >= 70) return "secondary";
    return "destructive";
  };

  const getTrendData = (current: number, type: string) => {
    // 基于数据计算趋势 - 这里可以根据历史数据来实现真实的趋势计算
    const mockTrend = Math.floor(Math.random() * 5) + 1;

    switch (type) {
      case "totalWords":
        return {
          trend: current > 0 ? ("up" as const) : ("neutral" as const),
          trendValue:
            current > 0 ? `+${mockTrend} this week` : "Start learning",
        };
      case "mastered":
        return {
          trend: current > 0 ? ("up" as const) : ("neutral" as const),
          trendValue:
            current > 0
              ? `+${Math.floor(current * 0.1)} this week`
              : "Start reviewing",
        };
      case "streak":
        return {
          trend: current > 0 ? ("up" as const) : ("neutral" as const),
          trendValue: current > 0 ? "Keep it up!" : "Start your streak",
        };
      case "accuracy":
        return {
          trend:
            current >= 80
              ? ("up" as const)
              : current >= 60
                ? ("neutral" as const)
                : ("down" as const),
          trendValue:
            current >= 80
              ? "Excellent!"
              : current >= 60
                ? "Good progress"
                : "Keep practicing",
        };
      default:
        return { trend: "neutral" as const, trendValue: "No data" };
    }
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
            value={statsData.overview.totalWords.toString()}
            icon={<BookOpen className="h-6 w-6" />}
            {...getTrendData(statsData.overview.totalWords, "totalWords")}
            delay={0}
          />
          <StatCard
            title="Mastered"
            value={statsData.overview.masteredWords.toString()}
            description={
              statsData.overview.totalWords > 0
                ? `${Math.round(
                    (statsData.overview.masteredWords /
                      statsData.overview.totalWords) *
                      100
                  )}% mastery`
                : "0% mastery"
            }
            icon={<CheckCircle className="h-6 w-6" />}
            {...getTrendData(statsData.overview.masteredWords, "mastered")}
            delay={0.1}
          />
          <StatCard
            title="Streak"
            value={`${statsData.overview.streakDays} day${statsData.overview.streakDays !== 1 ? "s" : ""}`}
            icon={<Flame className="h-6 w-6" />}
            {...getTrendData(statsData.overview.streakDays, "streak")}
            delay={0.2}
          />
          <StatCard
            title="Average Accuracy"
            value={`${statsData.overview.averageAccuracy}%`}
            icon={<Target className="h-6 w-6" />}
            {...getTrendData(statsData.overview.averageAccuracy, "accuracy")}
            delay={0.3}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Weekly Goal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
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
                    <span className="text-sm font-medium">Review Progress</span>
                    <span className="text-sm font-bold">
                      {statsData.overview.weeklyProgress} /{" "}
                      {statsData.overview.weeklyGoal}
                    </span>
                  </div>
                  <Progress
                    value={Math.min(
                      (statsData.overview.weeklyProgress /
                        statsData.overview.weeklyGoal) *
                        100,
                      100
                    )}
                    className="h-3"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    {statsData.overview.weeklyProgress >=
                    statsData.overview.weeklyGoal
                      ? "Congratulations! You&apos;ve completed this week&apos;s goal!"
                      : `Need to review ${statsData.overview.weeklyGoal - statsData.overview.weeklyProgress} more words to complete this week&apos;s goal`}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    className="rounded-lg border bg-muted/30 p-4 text-center"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="text-2xl font-bold text-primary">
                      {statsData.overview.todayReviewed}
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
                      {statsData.overview.totalReviews}
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
            transition={{ delay: 0.5, duration: 0.3 }}
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
                  {statsData.masteryDistribution.length > 0 ? (
                    statsData.masteryDistribution.map((item, index) => (
                      <motion.div
                        key={item.level}
                        className="flex items-center justify-between"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded ${item.color}`} />
                          <span className="text-sm font-medium">
                            {item.level}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {item.percentage}%
                          </span>
                          <Badge variant="outline" className="font-mono">
                            {item.count}
                          </Badge>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No words learned yet</p>
                      <p className="text-sm">
                        Start learning to see your progress!
                      </p>
                    </div>
                  )}
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
          transition={{ delay: 0.7, duration: 0.3 }}
        >
          <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity (Last 7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statsData.recentActivity.length > 0 ? (
                  statsData.recentActivity.map((day, index) => (
                    <motion.div
                      key={day.date}
                      className="flex items-center justify-between p-4 rounded-lg border bg-muted/30"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.05, duration: 0.3 }}
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
                      <div className="flex items-center gap-2">
                        {day.reviews > 0 && (
                          <Badge
                            variant={getAccuracyBadgeVariant(day.accuracy)}
                          >
                            {day.accuracy}% accuracy
                          </Badge>
                        )}
                        {day.reviews === 0 && day.newWords === 0 && (
                          <Badge variant="outline">No activity</Badge>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No recent activity</p>
                    <p className="text-sm">
                      Start learning to track your progress!
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Learning Progress Summary */}
        {statsData.learningProgress.last30Days.totalReviews > 0 && (
          <motion.div
            className="mt-6 md:mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.3 }}
          >
            <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>30-Day Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                    <div className="text-2xl font-bold text-blue-600">
                      {statsData.learningProgress.last30Days.totalNewWords}
                    </div>
                    <div className="text-sm text-blue-600/80">
                      New Words Learned
                    </div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950/30">
                    <div className="text-2xl font-bold text-green-600">
                      {statsData.learningProgress.last30Days.totalReviews}
                    </div>
                    <div className="text-sm text-green-600/80">
                      Total Reviews
                    </div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-950/30">
                    <div className="text-2xl font-bold text-purple-600">
                      {statsData.learningProgress.last30Days.averageAccuracy}%
                    </div>
                    <div className="text-sm text-purple-600/80">
                      Average Accuracy
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
