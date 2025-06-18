"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Flame,
  Target,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { StatCard } from "@/components/ui/stat-card";

export default function StatsPage() {
  // 模拟统计数据
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
    { level: "已掌握 (80-100%)", count: 8, color: "bg-green-500" },
    { level: "良好 (60-79%)", count: 7, color: "bg-blue-500" },
    { level: "一般 (40-59%)", count: 6, color: "bg-yellow-500" },
    { level: "待加强 (0-39%)", count: 4, color: "bg-red-500" },
  ];

  const getAccuracyBadgeVariant = (
    accuracy: number
  ): "default" | "secondary" | "destructive" => {
    if (accuracy >= 85) return "default";
    if (accuracy >= 70) return "secondary";
    return "destructive";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <AnimatedContainer variant="fadeIn">
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center mb-4"
            >
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="hover:bg-white/50"
              >
                <Link href="/" className="text-blue-600 hover:text-blue-800">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  返回仪表板
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-2">
                学习统计
              </h1>
              <p className="text-slate-600 text-lg">查看您的学习进度和成就</p>
            </motion.div>
          </div>
        </AnimatedContainer>

        {/* 主要统计指标 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="总单词数"
            value={stats.totalWords.toString()}
            icon={<BookOpen className="h-6 w-6" />}
            trend="up"
            trendValue="+5"
            className="delay-0"
          />
          <StatCard
            title="已掌握"
            value={stats.masteredWords.toString()}
            description={`${Math.round((stats.masteredWords / stats.totalWords) * 100)}% 掌握率`}
            icon={<CheckCircle className="h-6 w-6" />}
            trend="up"
            trendValue="+3"
            className="delay-100"
          />
          <StatCard
            title="连续学习"
            value={`${stats.streakDays} 天`}
            icon={<Flame className="h-6 w-6" />}
            trend="up"
            trendValue="+2"
            className="delay-200"
          />
          <StatCard
            title="平均正确率"
            value={`${stats.averageAccuracy}%`}
            icon={<Target className="h-6 w-6" />}
            trend="up"
            trendValue="+5%"
            className="delay-300"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 本周目标 */}
          <AnimatedContainer variant="slideUp" delay={0.2}>
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  本周学习目标
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700">
                      复习进度
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
                    还需复习{" "}
                    {Math.max(0, stats.weeklyGoal - stats.weeklyProgress)}{" "}
                    个单词完成本周目标
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="text-2xl font-bold text-blue-600">
                      {stats.todayReviewed}
                    </div>
                    <div className="text-sm text-blue-600">今日复习</div>
                  </motion.div>
                  <motion.div
                    className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="text-2xl font-bold text-green-600">
                      {stats.totalReviews}
                    </div>
                    <div className="text-sm text-green-600">总复习次数</div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </AnimatedContainer>

          {/* 掌握程度分布 */}
          <AnimatedContainer variant="slideUp" delay={0.3}>
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  掌握程度分布
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {masteryDistribution.map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center justify-between"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                    >
                      <div className="flex items-center flex-1">
                        <div className={`w-4 h-4 rounded ${item.color} mr-3`} />
                        <span className="text-sm text-slate-700">
                          {item.level}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-semibold text-slate-800 min-w-[2rem] text-right">
                          {item.count}
                        </span>
                        <div className="w-20 bg-slate-200 rounded-full h-2">
                          <motion.div
                            className={`h-2 rounded-full ${item.color}`}
                            initial={{ width: 0 }}
                            animate={{
                              width: `${(item.count / stats.totalWords) * 100}%`,
                            }}
                            transition={{
                              duration: 0.8,
                              delay: 0.5 + index * 0.1,
                            }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </AnimatedContainer>
        </div>

        {/* 最近活动 */}
        <AnimatedContainer variant="slideUp" delay={0.4} className="mt-8">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                最近学习活动
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 font-medium text-slate-600">
                        日期
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">
                        新增单词
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">
                        复习次数
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-slate-600">
                        正确率
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivity.map((activity, index) => (
                      <motion.tr
                        key={activity.date}
                        className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                      >
                        <td className="py-3 px-4 text-slate-700 font-medium">
                          {new Date(activity.date).toLocaleDateString("zh-CN", {
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="secondary" className="text-xs">
                            +{activity.newWords}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          {activity.reviews}
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant={getAccuracyBadgeVariant(activity.accuracy)}
                            className="text-xs"
                          >
                            {activity.accuracy}%
                          </Badge>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </AnimatedContainer>
      </div>
    </div>
  );
}
