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
