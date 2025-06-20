/**
 * 间隔重复算法 (Spaced Repetition System)
 * 基于艾宾浩斯遗忘曲线和 SM-2 算法的实现
 */

export type Difficulty = "hard" | "medium" | "easy";
export type MasteryLevel = "NEW" | "LEARNING" | "REVIEW" | "MASTERED";

export interface ReviewResult {
  newStage: number;
  newInterval: number;
  newEaseFactor: number;
  nextReviewDate: Date;
  masteryLevel: MasteryLevel;
}

/**
 * 计算下次复习的时间间隔
 * 基于 SM-2 算法，但做了一些调整以适合中文用户
 */
export function calculateNextReview(
  currentStage: number,
  currentInterval: number,
  currentEaseFactor: number,
  difficulty: Difficulty,
  reviewCount: number
): ReviewResult {
  let newStage = currentStage;
  let newInterval = currentInterval;
  let newEaseFactor = currentEaseFactor;

  // 根据难度调整参数
  switch (difficulty) {
    case "hard":
      // 困难：重置到较早阶段，缩短间隔
      newStage = Math.max(0, currentStage - 1);
      newInterval = Math.max(1, Math.floor(currentInterval * 0.6));
      newEaseFactor = Math.max(1.3, currentEaseFactor - 0.2);
      break;

    case "medium":
      // 中等：保持当前阶段，正常间隔
      newStage = currentStage;
      newInterval = Math.max(1, Math.floor(currentInterval * newEaseFactor));
      // 轻微降低难度系数
      newEaseFactor = Math.max(1.3, currentEaseFactor - 0.05);
      break;

    case "easy":
      // 简单：提升阶段，延长间隔
      newStage = currentStage + 1;
      newInterval = Math.floor(currentInterval * newEaseFactor);
      // 提高难度系数
      newEaseFactor = Math.min(2.5, currentEaseFactor + 0.1);
      break;
  }

  // 新单词的特殊处理
  if (currentStage === 0) {
    switch (difficulty) {
      case "hard":
        newStage = 0;
        newInterval = 1; // 1天后再复习
        break;
      case "medium":
        newStage = 1;
        newInterval = 3; // 3天后复习
        break;
      case "easy":
        newStage = 2;
        newInterval = 7; // 1周后复习
        break;
    }
  }

  // 设置间隔上限和下限
  newInterval = Math.max(1, Math.min(365, newInterval));

  // 计算下次复习日期
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

  // 确定掌握程度
  const masteryLevel = determineMasteryLevel(
    newStage,
    reviewCount,
    newEaseFactor
  );

  return {
    newStage,
    newInterval,
    newEaseFactor,
    nextReviewDate,
    masteryLevel,
  };
}

/**
 * 确定单词的掌握程度
 */
function determineMasteryLevel(
  stage: number,
  reviewCount: number,
  easeFactor: number
): MasteryLevel {
  if (stage === 0) {
    return "NEW";
  }

  if (stage >= 6 && reviewCount >= 8 && easeFactor >= 2.2) {
    return "MASTERED";
  }

  if (stage >= 3 && reviewCount >= 4) {
    return "REVIEW";
  }

  return "LEARNING";
}

/**
 * 获取需要复习的单词查询条件
 */
export function getReviewWordsFilter() {
  const now = new Date();

  return {
    AND: [
      {
        isLearning: true,
      },
      {
        nextReviewDate: {
          lte: now,
        },
      },
      {
        masteryLevel: {
          not: "MASTERED",
        },
      },
    ],
  };
}

/**
 * 计算复习优先级
 * 越早需要复习的单词优先级越高
 */
export function calculateReviewPriority(nextReviewDate: Date): number {
  const now = new Date();
  const diffMs = now.getTime() - nextReviewDate.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  // 超期越久，优先级越高
  return Math.max(0, diffDays);
}

/**
 * 获取复习统计信息
 */
export function getReviewStats(
  words: Array<{
    masteryLevel: string;
    reviewStage: number;
    nextReviewDate: Date;
    reviewCount: number;
    correctCount: number;
  }>
) {
  const now = new Date();

  const stats = {
    total: words.length,
    new: 0,
    learning: 0,
    review: 0,
    mastered: 0,
    dueToday: 0,
    overdue: 0,
    accuracy: 0,
  };

  let totalReviews = 0;
  let totalCorrect = 0;

  words.forEach(word => {
    // 统计掌握程度
    switch (word.masteryLevel) {
      case "NEW":
        stats.new++;
        break;
      case "LEARNING":
        stats.learning++;
        break;
      case "REVIEW":
        stats.review++;
        break;
      case "MASTERED":
        stats.mastered++;
        break;
    }

    // 统计复习情况
    if (word.nextReviewDate <= now) {
      const diffMs = now.getTime() - word.nextReviewDate.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);

      if (diffDays < 1) {
        stats.dueToday++;
      } else {
        stats.overdue++;
      }
    }

    // 统计准确率
    totalReviews += word.reviewCount;
    totalCorrect += word.correctCount;
  });

  stats.accuracy =
    totalReviews > 0 ? Math.round((totalCorrect / totalReviews) * 100) : 0;

  return stats;
}
