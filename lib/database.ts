import { PrismaClient } from "@prisma/client";
import { getReviewWordsFilter, getReviewStats } from "./spaced-repetition";

const prisma = new PrismaClient();

export interface DashboardStats {
  todayStats: {
    newWords: number;
    reviewWords: number;
    completedWords: number;
    accuracy: number;
  };
  upcomingReviews: Array<{
    id: string;
    word: string;
    stage: number;
    nextReview: string;
  }>;
  totalWords: number;
  masteryStats: {
    new: number;
    learning: number;
    review: number;
    mastered: number;
  };
}

export interface StatsData {
  overview: {
    totalWords: number;
    masteredWords: number;
    learningWords: number;
    newWords: number;
    todayReviewed: number;
    totalReviews: number;
    averageAccuracy: number;
    streakDays: number;
    weeklyGoal: number;
    weeklyProgress: number;
  };
  masteryDistribution: Array<{
    level: string;
    count: number;
    percentage: number;
    color: string;
  }>;
  recentActivity: Array<{
    date: string;
    newWords: number;
    reviews: number;
    accuracy: number;
  }>;
  learningProgress: {
    last7Days: Array<{
      date: string;
      newWords: number;
      reviewsCompleted: number;
      accuracy: number;
    }>;
    last30Days: {
      totalNewWords: number;
      totalReviews: number;
      averageAccuracy: number;
    };
  };
}

/**
 * 获取Dashboard所需的所有统计数据
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const today = new Date();
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

    // 并行获取所有数据
    const [allWords, todayWords, todayReviews, reviewWords] = await Promise.all(
      [
        // 获取所有单词
        prisma.word.findMany({
          orderBy: { createdAt: "desc" },
        }),

        // 今天新增的单词
        prisma.word.findMany({
          where: {
            createdAt: {
              gte: todayStart,
              lt: todayEnd,
            },
          },
        }),

        // 今天的复习记录
        prisma.review.findMany({
          where: {
            createdAt: {
              gte: todayStart,
              lt: todayEnd,
            },
          },
          include: {
            word: true,
          },
        }),

        // 需要复习的单词
        prisma.word.findMany({
          where: getReviewWordsFilter(),
          orderBy: [{ nextReviewDate: "asc" }, { reviewStage: "asc" }],
          take: 10,
        }),
      ]
    );

    // 计算今天的统计数据
    const newWordsToday = todayWords.length;
    const reviewWordsCount = reviewWords.length;
    const completedReviewsToday = todayReviews.length;

    // 计算今天的准确率
    const correctReviewsToday = todayReviews.filter(
      review => review.wasCorrect
    ).length;
    const accuracy =
      completedReviewsToday > 0
        ? Math.round((correctReviewsToday / completedReviewsToday) * 100)
        : 0;

    // 获取掌握程度统计
    const masteryStats = getReviewStats(allWords);

    // 格式化即将复习的单词
    const upcomingReviews = reviewWords.slice(0, 5).map(word => ({
      id: word.id,
      word: word.text,
      stage: word.reviewStage,
      nextReview: formatNextReviewTime(word.nextReviewDate),
    }));

    return {
      todayStats: {
        newWords: newWordsToday,
        reviewWords: reviewWordsCount,
        completedWords: completedReviewsToday,
        accuracy,
      },
      upcomingReviews,
      totalWords: allWords.length,
      masteryStats: {
        new: masteryStats.new,
        learning: masteryStats.learning,
        review: masteryStats.review,
        mastered: masteryStats.mastered,
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    // 返回默认值
    return {
      todayStats: {
        newWords: 0,
        reviewWords: 0,
        completedWords: 0,
        accuracy: 0,
      },
      upcomingReviews: [],
      totalWords: 0,
      masteryStats: {
        new: 0,
        learning: 0,
        review: 0,
        mastered: 0,
      },
    };
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * 格式化下次复习时间
 */
function formatNextReviewTime(nextReviewDate: Date): string {
  const now = new Date();
  const diffMs = nextReviewDate.getTime() - now.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMs < 0) {
    const overdueDays = Math.abs(diffDays);
    const overdueHours = Math.abs(diffHours % 24);
    if (overdueDays > 0) {
      return `${overdueDays} day${overdueDays > 1 ? "s" : ""} overdue`;
    } else if (overdueHours > 0) {
      return `${overdueHours} hour${overdueHours > 1 ? "s" : ""} overdue`;
    } else {
      return "Overdue";
    }
  }

  if (diffDays > 0) {
    return `In ${diffDays} day${diffDays > 1 ? "s" : ""}`;
  } else if (diffHours > 0) {
    return `In ${diffHours} hour${diffHours > 1 ? "s" : ""}`;
  } else if (diffMinutes > 0) {
    return `In ${diffMinutes} minute${diffMinutes > 1 ? "s" : ""}`;
  } else {
    return "Now";
  }
}

/**
 * 获取最近学习活动
 */
export async function getRecentActivity(limit: number = 10) {
  try {
    const recentReviews = await prisma.review.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        word: {
          select: {
            text: true,
          },
        },
      },
    });

    return recentReviews.map(review => ({
      id: review.id,
      word: review.word.text,
      difficulty: review.difficulty,
      wasCorrect: review.wasCorrect,
      createdAt: review.createdAt,
    }));
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * 获取Stats页面所需的全部统计数据
 */
export async function getStatsData(): Promise<StatsData> {
  try {
    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

    // 获取本周开始时间（周一）
    const weekStart = new Date(todayStart);
    weekStart.setDate(todayStart.getDate() - todayStart.getDay() + 1);

    // 获取过去7天和30天的时间范围
    const sevenDaysAgo = new Date(
      todayStart.getTime() - 7 * 24 * 60 * 60 * 1000
    );
    const thirtyDaysAgo = new Date(
      todayStart.getTime() - 30 * 24 * 60 * 60 * 1000
    );

    // 并行获取所有数据
    const [
      allWords,
      todayReviews,
      weekReviews,
      last7DaysReviews,
      last30DaysReviews,
    ] = await Promise.all([
      // 获取所有单词
      prisma.word.findMany({
        orderBy: { createdAt: "desc" },
      }),

      // 今天的复习记录
      prisma.review.findMany({
        where: {
          createdAt: {
            gte: todayStart,
            lt: todayEnd,
          },
        },
        include: {
          word: {
            select: {
              text: true,
            },
          },
        },
      }),

      // 本周的复习记录
      prisma.review.findMany({
        where: {
          createdAt: {
            gte: weekStart,
            lt: todayEnd,
          },
        },
      }),

      // 过去7天详细数据
      prisma.review.findMany({
        where: {
          createdAt: {
            gte: sevenDaysAgo,
            lt: todayEnd,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),

      // 过去30天数据
      prisma.review.findMany({
        where: {
          createdAt: {
            gte: thirtyDaysAgo,
            lt: todayEnd,
          },
        },
        include: {
          word: {
            select: {
              createdAt: true,
            },
          },
        },
      }),
    ]);

    // 计算基本统计
    const totalWords = allWords.length;
    const masteredWords = allWords.filter(
      word => word.masteryLevel === "MASTERED"
    ).length;
    const learningWords = allWords.filter(
      word => word.masteryLevel === "LEARNING"
    ).length;
    const newWords = allWords.filter(
      word => word.masteryLevel === "NEW"
    ).length;

    const todayReviewedCount = todayReviews.length;
    const totalReviewsCount = await prisma.review.count();

    // 计算平均准确率
    const allReviewsCount = await prisma.review.count();
    const correctReviewsCount = await prisma.review.count({
      where: { wasCorrect: true },
    });
    const averageAccuracy =
      allReviewsCount > 0
        ? Math.round((correctReviewsCount / allReviewsCount) * 100)
        : 0;

    // 计算学习连续天数
    const streakDays = await calculateLearningStreak();

    // 本周目标和进度
    const weeklyGoal = 50; // 可以从用户设置中获取
    const weeklyProgress = weekReviews.length;

    // 计算掌握程度分布
    const masteryDistribution = [
      {
        level: "Mastered (Stage 6+)",
        count: masteredWords,
        percentage:
          totalWords > 0 ? Math.round((masteredWords / totalWords) * 100) : 0,
        color: "bg-green-500",
      },
      {
        level: "Review Stage (3-5)",
        count: allWords.filter(
          word => word.reviewStage >= 3 && word.reviewStage <= 5
        ).length,
        percentage:
          totalWords > 0
            ? Math.round(
                (allWords.filter(
                  word => word.reviewStage >= 3 && word.reviewStage <= 5
                ).length /
                  totalWords) *
                  100
              )
            : 0,
        color: "bg-blue-500",
      },
      {
        level: "Learning (Stage 1-2)",
        count: allWords.filter(
          word => word.reviewStage >= 1 && word.reviewStage <= 2
        ).length,
        percentage:
          totalWords > 0
            ? Math.round(
                (allWords.filter(
                  word => word.reviewStage >= 1 && word.reviewStage <= 2
                ).length /
                  totalWords) *
                  100
              )
            : 0,
        color: "bg-yellow-500",
      },
      {
        level: "New (Stage 0)",
        count: newWords,
        percentage:
          totalWords > 0 ? Math.round((newWords / totalWords) * 100) : 0,
        color: "bg-gray-500",
      },
    ];

    // 生成过去7天的活动数据
    const recentActivity = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(todayStart.getTime() - i * 24 * 60 * 60 * 1000);
      const nextDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);

      const dayReviews = last7DaysReviews.filter(
        review => review.createdAt >= date && review.createdAt < nextDate
      );

      const dayNewWords = last30DaysReviews.filter(
        review =>
          review.word.createdAt >= date && review.word.createdAt < nextDate
      ).length;

      const dayAccuracy =
        dayReviews.length > 0
          ? Math.round(
              (dayReviews.filter(r => r.wasCorrect).length /
                dayReviews.length) *
                100
            )
          : 0;

      recentActivity.push({
        date: date.toISOString().split("T")[0],
        newWords: dayNewWords,
        reviews: dayReviews.length,
        accuracy: dayAccuracy,
      });
    }

    // 生成过去7天详细数据
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(todayStart.getTime() - i * 24 * 60 * 60 * 1000);
      const nextDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);

      const dayReviews = last7DaysReviews.filter(
        review => review.createdAt >= date && review.createdAt < nextDate
      );

      const dayNewWords = last30DaysReviews.filter(
        review =>
          review.word.createdAt >= date && review.word.createdAt < nextDate
      ).length;

      const dayAccuracy =
        dayReviews.length > 0
          ? Math.round(
              (dayReviews.filter(r => r.wasCorrect).length /
                dayReviews.length) *
                100
            )
          : 0;

      last7Days.push({
        date: date.toISOString().split("T")[0],
        newWords: dayNewWords,
        reviewsCompleted: dayReviews.length,
        accuracy: dayAccuracy,
      });
    }

    // 过去30天汇总
    const last30DaysNewWords = last30DaysReviews.filter(
      review => review.word.createdAt >= thirtyDaysAgo
    ).length;

    const last30DaysReviewsCount = last30DaysReviews.length;
    const last30DaysAccuracy =
      last30DaysReviewsCount > 0
        ? Math.round(
            (last30DaysReviews.filter(r => r.wasCorrect).length /
              last30DaysReviewsCount) *
              100
          )
        : 0;

    return {
      overview: {
        totalWords,
        masteredWords,
        learningWords,
        newWords,
        todayReviewed: todayReviewedCount,
        totalReviews: totalReviewsCount,
        averageAccuracy,
        streakDays,
        weeklyGoal,
        weeklyProgress,
      },
      masteryDistribution,
      recentActivity,
      learningProgress: {
        last7Days,
        last30Days: {
          totalNewWords: last30DaysNewWords,
          totalReviews: last30DaysReviewsCount,
          averageAccuracy: last30DaysAccuracy,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching stats data:", error);
    // 返回默认值
    return {
      overview: {
        totalWords: 0,
        masteredWords: 0,
        learningWords: 0,
        newWords: 0,
        todayReviewed: 0,
        totalReviews: 0,
        averageAccuracy: 0,
        streakDays: 0,
        weeklyGoal: 50,
        weeklyProgress: 0,
      },
      masteryDistribution: [],
      recentActivity: [],
      learningProgress: {
        last7Days: [],
        last30Days: {
          totalNewWords: 0,
          totalReviews: 0,
          averageAccuracy: 0,
        },
      },
    };
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * 计算学习连续天数
 */
async function calculateLearningStreak(): Promise<number> {
  try {
    const today = new Date();
    let streakDays = 0;
    const currentDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    // 向前查找连续学习天数
    while (true) {
      const dayStart = new Date(currentDate);
      const dayEnd = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);

      const dayActivity = await prisma.review.count({
        where: {
          createdAt: {
            gte: dayStart,
            lt: dayEnd,
          },
        },
      });

      if (dayActivity > 0) {
        streakDays++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }

      // 防止无限循环，最多查找100天
      if (streakDays >= 100) break;
    }

    return streakDays;
  } catch (error) {
    console.error("Error calculating learning streak:", error);
    return 0;
  }
}
