"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  Sprout,
  Flower,
  TreePine,
  MoveRight,
  Wind,
  Leaf,
  Library,
  Calendar,
  Clock,
  Award,
  Target,
  Cloud,
  Sun,
  Star,
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
  const magicalActions = [
    {
      href: "/learn/new",
      title: "Plant New Seeds",
      description: "Discover new words to grow your vocabulary garden",
      icon: Sprout,
      color: "text-ghibli-green",
      bgColor: "bg-green-50/80 dark:bg-green-900/20",
      borderColor: "border-green-200/50 dark:border-green-800/50",
      decoration: "🌱",
    },
    {
      href: "/learn/review",
      title: "Tend Your Garden",
      description: "Nurture words that are ready to bloom",
      icon: Flower,
      color: "text-ghibli-red",
      bgColor: "bg-red-50/80 dark:bg-red-900/20",
      borderColor: "border-red-200/50 dark:border-red-800/50",
      decoration: "🌸",
    },
    {
      href: "/words",
      title: "Magical Library",
      description: "Browse your collection of enchanted words",
      icon: Library,
      color: "text-purple-600",
      bgColor: "bg-purple-50/80 dark:bg-purple-900/20",
      borderColor: "border-purple-200/50 dark:border-purple-800/50",
      decoration: "📚",
    },
    {
      href: "/stats",
      title: "Growth Chronicle",
      description: "Track your magical learning journey",
      icon: TreePine,
      color: "text-amber-600",
      bgColor: "bg-amber-50/80 dark:bg-amber-900/20",
      borderColor: "border-amber-200/50 dark:border-amber-800/50",
      decoration: "🌳",
    },
  ];

  const growthStages = [
    {
      label: "Tiny Seeds",
      count: dashboardData.masteryStats.new,
      color: "text-ghibli-green",
      bgColor: "bg-green-100/80 dark:bg-green-900/30",
      icon: "🌱",
      description: "Just planted",
    },
    {
      label: "Sprouting",
      count: dashboardData.masteryStats.learning,
      color: "text-amber-600",
      bgColor: "bg-amber-100/80 dark:bg-amber-900/30",
      icon: "🌿",
      description: "Growing strong",
    },
    {
      label: "Budding",
      count: dashboardData.masteryStats.review,
      color: "text-ghibli-blue",
      bgColor: "bg-blue-100/80 dark:bg-blue-900/30",
      icon: "🌺",
      description: "Almost blooming",
    },
    {
      label: "Full Bloom",
      count: dashboardData.masteryStats.mastered,
      color: "text-ghibli-red",
      bgColor: "bg-red-100/80 dark:bg-red-900/30",
      icon: "🌸",
      description: "Beautifully mastered",
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
            ? `+${mockTrend} seeds planted today`
            : "Ready to plant more seeds",
        };
      case "reviewWords":
        return {
          trend: "neutral",
          trendValue:
            current > 0 ? "Garden needs tending" : "Garden is pristine",
        };
      case "completedWords":
        return {
          trend: isPositive ? "up" : "down",
          trendValue: isPositive
            ? `+${mockTrend} flowers bloomed today`
            : `${mockTrend} less than yesterday`,
        };
      case "accuracy":
        return {
          trend: current >= 80 ? "up" : current >= 60 ? "neutral" : "down",
          trendValue:
            current >= 80
              ? "Magical progress!"
              : current >= 60
                ? "Steady growth"
                : "Needs more sunlight",
        };
      default:
        return { trend: "neutral", trendValue: "Growing quietly" };
    }
  };

  const totalWords = dashboardData.totalWords;
  const masteredWords = dashboardData.masteryStats.mastered;
  const magicalProgress =
    totalWords > 0 ? (masteredWords / totalWords) * 100 : 0;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Magical Forest Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating elements */}
        <motion.div
          className="absolute top-20 left-10 text-ghibli-green/20"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Leaf className="w-8 h-8" />
        </motion.div>

        <motion.div
          className="absolute top-32 right-20 text-ghibli-blue/20"
          animate={{
            y: [0, 15, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        >
          <Cloud className="w-6 h-6" />
        </motion.div>

        <motion.div
          className="absolute bottom-40 left-32 text-amber-400/30"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <Sun className="w-5 h-5" />
        </motion.div>

        <motion.div
          className="absolute top-60 right-40 text-ghibli-blue/25"
          animate={{
            rotate: [0, 180, 360],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Star className="w-4 h-4" />
        </motion.div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl relative z-10">
        {/* Magical Hero Section */}
        <motion.div
          className="mb-8 md:mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="text-center space-y-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              <motion.h1
                className="text-4xl md:text-6xl font-handwritten-bold text-ghibli-blue mb-4"
                animate={{
                  textShadow: [
                    "0 0 20px rgba(136, 170, 204, 0.3)",
                    "0 0 30px rgba(136, 170, 204, 0.5)",
                    "0 0 20px rgba(136, 170, 204, 0.3)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Welcome to Your Magical Garden
              </motion.h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Where words grow like flowers and knowledge blooms like an
                enchanted forest
              </p>
            </motion.div>

            {/* Magical Progress Circle */}
            <motion.div
              className="max-w-sm mx-auto watercolor-bg rounded-3xl p-8 shadow-natural-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Award className="w-6 h-6 text-amber-500" />
                  </motion.div>
                  <span className="font-handwritten text-ghibli-green">
                    Garden Progress
                  </span>
                </div>
                <span className="text-3xl font-handwritten-bold text-ghibli-blue">
                  {Math.round(magicalProgress)}%
                </span>
              </div>
              <Progress
                value={magicalProgress}
                className="mb-3 h-3 rounded-full"
              />
              <p className="text-sm text-muted-foreground text-center font-medium">
                {masteredWords} flowers in full bloom / {totalWords} seeds
                planted
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Today's Magical Stats */}
        <motion.div
          className="mb-8 md:mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-handwritten-bold text-ghibli-green mb-3">
              Today&apos;s Garden Activity
            </h2>
            <p className="text-muted-foreground">
              Watch your magical vocabulary garden flourish
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <StatCard
              title="New Seeds"
              value={dashboardData.todayStats.newWords}
              description="Fresh plantings today"
              icon={<Sprout className="w-6 h-6" />}
              delay={1.0}
              {...getTrendData(dashboardData.todayStats.newWords, "newWords")}
            />
            <StatCard
              title="Need Tending"
              value={dashboardData.todayStats.reviewWords}
              description="Plants awaiting care"
              icon={<Wind className="w-6 h-6" />}
              delay={1.1}
              {...getTrendData(
                dashboardData.todayStats.reviewWords,
                "reviewWords"
              )}
            />
            <StatCard
              title="Bloomed Today"
              value={dashboardData.todayStats.completedWords}
              description="Words that flowered"
              icon={<Flower className="w-6 h-6" />}
              delay={1.2}
              {...getTrendData(
                dashboardData.todayStats.completedWords,
                "completedWords"
              )}
            />
            <StatCard
              title="Garden Health"
              value={`${dashboardData.todayStats.accuracy}%`}
              description="Growth success rate"
              icon={<Target className="w-6 h-6" />}
              delay={1.3}
              {...getTrendData(dashboardData.todayStats.accuracy, "accuracy")}
            />
          </div>
        </motion.div>

        {/* Growth Stages Distribution */}
        <motion.div
          className="mb-8 md:mb-12"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.7 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-handwritten-bold text-ghibli-blue mb-3">
              Your Garden&apos;s Growth Stages
            </h2>
            <p className="text-muted-foreground">
              From tiny seeds to magnificent blooming flowers
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {growthStages.map((stage, index) => (
              <motion.div
                key={stage.label}
                className="group motion-safe hover-fix"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 1.6 + index * 0.15, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Card className="text-center shadow-natural hover:shadow-natural-lg transition-all duration-300 page-turn">
                  <CardContent className="p-6">
                    <motion.div
                      className="text-4xl mb-4"
                      whileHover={{ scale: 1.3, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      {stage.icon}
                    </motion.div>
                    <motion.div
                      className={cn(
                        "text-3xl font-handwritten-bold mb-2",
                        stage.color
                      )}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.7 + index * 0.1, duration: 0.4 }}
                    >
                      {stage.count}
                    </motion.div>
                    <div className="font-handwritten text-lg font-medium text-foreground mb-1">
                      {stage.label}
                    </div>
                    <div className="text-xs text-muted-foreground mb-3">
                      {stage.description}
                    </div>
                    <motion.div
                      className={cn(
                        "h-2 rounded-full transition-all duration-300 group-hover:h-3",
                        stage.bgColor
                      )}
                      whileHover={{ scaleY: 1.5 }}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Magical Actions */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.0, duration: 0.7 }}
          >
            <Card className="shadow-natural-lg hover:shadow-xl transition-all duration-500">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-4 text-2xl">
                  <motion.div
                    className="relative p-3 ghibli-blue rounded-2xl shadow-natural"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.span
                      className="text-white text-2xl"
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      ✨
                    </motion.span>
                    <motion.div
                      className="absolute -inset-2 ghibli-blue rounded-2xl opacity-20 blur-sm"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.4, 0.2],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                      }}
                    />
                  </motion.div>
                  <span className="font-handwritten-bold text-ghibli-green">
                    Magical Learning Spells
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {magicalActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <motion.div
                        key={action.href}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: 2.2 + index * 0.2,
                          duration: 0.6,
                        }}
                        whileHover={{ y: -8, scale: 1.02 }}
                        className="h-full"
                      >
                        <Button
                          asChild
                          variant="outline"
                          className={cn(
                            "w-full h-full p-6 text-left flex-col items-start justify-between space-y-4 group transition-all duration-400 border-2 rounded-2xl hover:shadow-natural-lg",
                            action.bgColor,
                            action.borderColor,
                            "watercolor-bg"
                          )}
                        >
                          <Link href={action.href}>
                            <div className="w-full">
                              <div className="flex items-center gap-4 mb-4">
                                <motion.div
                                  className="relative p-3 bg-white/80 dark:bg-slate-700/80 rounded-2xl shadow-natural"
                                  whileHover={{ rotate: 10, scale: 1.1 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <Icon
                                    className={cn("w-6 h-6", action.color)}
                                  />
                                </motion.div>
                                <div>
                                  <h3 className="text-lg font-handwritten-bold text-foreground group-hover:text-ghibli-blue transition-colors">
                                    {action.title}
                                  </h3>
                                  <div className="text-2xl">
                                    {action.decoration}
                                  </div>
                                </div>
                              </div>
                              <p className="text-muted-foreground text-sm leading-relaxed">
                                {action.description}
                              </p>
                            </div>
                            <div className="flex items-center text-sm font-medium text-ghibli-green opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-3 group-hover:translate-y-0">
                              Begin Magic
                              <MoveRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-2" />
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

          {/* Words Awaiting Care */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4, duration: 0.7 }}
          >
            <Card className="shadow-natural-lg h-full">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <motion.div
                    className="p-2 bg-blue-100/80 dark:bg-blue-900/30 rounded-2xl"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <Clock className="w-5 h-5 text-ghibli-blue" />
                  </motion.div>
                  <span className="font-handwritten-bold text-ghibli-blue">
                    Plants Needing Care
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.upcomingReviews.length > 0 ? (
                    dashboardData.upcomingReviews.map((review, index) => (
                      <motion.div
                        key={review.id}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 2.6 + index * 0.15,
                          duration: 0.5,
                        }}
                        whileHover={{ scale: 1.03, x: 5 }}
                        className="group flex items-center justify-between p-4 watercolor-bg rounded-2xl border border-border/30 transition-all duration-300 hover:shadow-natural cursor-pointer"
                      >
                        <div className="flex-1">
                          <p className="font-handwritten font-medium text-lg text-foreground group-hover:text-ghibli-blue transition-colors">
                            {review.word}
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                            <Calendar className="w-3 h-3" />
                            {review.nextReview}
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className="text-xs font-medium bg-blue-100/80 text-ghibli-blue dark:bg-blue-900/30 border border-blue-200/50"
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
                      transition={{ delay: 2.6, duration: 0.6 }}
                    >
                      <motion.div
                        className="text-6xl mb-4"
                        animate={{
                          scale: [1, 1.2, 1],
                          rotate: [0, 10, -10, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        🌺
                      </motion.div>
                      <p className="text-lg font-handwritten font-medium mb-2 text-ghibli-green">
                        Garden is in Perfect Harmony
                      </p>
                      <p className="text-sm">
                        All your word-flowers are blooming beautifully!
                      </p>
                    </motion.div>
                  )}
                </div>
                {dashboardData.upcomingReviews.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3.0, duration: 0.6 }}
                  >
                    <Button
                      asChild
                      className="w-full mt-6 ghibli-green hover:bg-ghibli-green/90 text-white shadow-natural hover:shadow-natural-lg transition-all duration-300 rounded-2xl font-handwritten"
                    >
                      <Link href="/learn/review">
                        <Wind className="w-4 h-4 mr-2" />
                        Tend Garden
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
