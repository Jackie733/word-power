import Link from "next/link";
import * as motion from "motion/react-client";
import {
  BookOpen,
  RotateCcw,
  Library,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnimatedContainer } from "@/components/ui/animated-container";

export default function Dashboard() {
  // 模拟数据 - 后续会从数据库获取
  const todayStats = {
    newWords: 12,
    reviewWords: 8,
    completedWords: 15,
    accuracy: 85,
  };

  const upcomingReviews = [
    { id: 1, word: "serendipity", nextReview: "今天", stage: 1 },
    { id: 2, word: "ubiquitous", nextReview: "今天", stage: 2 },
    { id: 3, word: "ephemeral", nextReview: "明天", stage: 3 },
  ];

  const quickActions = [
    {
      href: "/learn/new",
      title: "学习新单词",
      description: "添加并学习新的单词",
      icon: BookOpen,
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      emoji: "📚",
    },
    {
      href: "/learn/review",
      title: "复习单词",
      description: "根据遗忘曲线复习单词",
      icon: RotateCcw,
      color: "bg-gradient-to-r from-green-500 to-green-600",
      emoji: "🔄",
    },
    {
      href: "/words",
      title: "单词管理",
      description: "查看和管理所有单词",
      icon: Library,
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      emoji: "📖",
    },
    {
      href: "/stats",
      title: "学习统计",
      description: "查看学习进度和统计",
      icon: BarChart3,
      color: "bg-gradient-to-r from-orange-500 to-orange-600",
      emoji: "📊",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <AnimatedContainer variant="slideDown" className="mb-8">
          <motion.h1
            className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-2"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            Word Power
          </motion.h1>
          <motion.p
            className="text-muted-foreground text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            基于艾宾浩斯遗忘曲线的英语单词学习系统
          </motion.p>
        </AnimatedContainer>

        {/* 今日统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="新学单词"
            value={todayStats.newWords}
            icon={<BookOpen className="w-6 h-6" />}
            delay={0}
            trend="up"
            trendValue="+3 较昨日"
          />
          <StatCard
            title="复习单词"
            value={todayStats.reviewWords}
            icon={<RotateCcw className="w-6 h-6" />}
            delay={0.1}
            trend="neutral"
            trendValue="按计划进行"
          />
          <StatCard
            title="已完成"
            value={todayStats.completedWords}
            icon={<TrendingUp className="w-6 h-6" />}
            delay={0.2}
            trend="up"
            trendValue="+5 较昨日"
          />
          <StatCard
            title="正确率"
            value={`${todayStats.accuracy}%`}
            icon="🎯"
            delay={0.3}
            trend="up"
            trendValue="+2% 较昨日"
          />
        </div>

        {/* 主要操作区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 快速开始 */}
          <AnimatedContainer
            variant="slideUp"
            delay={0.4}
            className="lg:col-span-2"
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
                  今日学习
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <motion.div
                        key={action.href}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          asChild
                          className={`${action.color} h-auto p-6 text-left flex-col items-start space-y-2 hover:shadow-lg transition-all duration-300`}
                        >
                          <Link href={action.href}>
                            <div className="flex items-center gap-3 mb-2">
                              <motion.span
                                className="text-2xl"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                              >
                                {action.emoji}
                              </motion.span>
                              <Icon className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-semibold text-white">
                              {action.title}
                            </h3>
                            <p className="text-white/80 text-sm">
                              {action.description}
                            </p>
                          </Link>
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </AnimatedContainer>

          {/* 待复习单词 */}
          <AnimatedContainer variant="slideUp" delay={0.6}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📋 待复习单词
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
                        第{review.stage}次
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
                    <Link href="/learn/review">查看全部</Link>
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </AnimatedContainer>
        </div>
      </div>
    </div>
  );
}
