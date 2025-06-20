import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { calculateNextReview, type Difficulty } from "@/lib/spaced-repetition";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { wordId, difficulty, responseTime, wasCorrect } = body;

    if (!wordId || !difficulty) {
      return NextResponse.json(
        { error: "Missing required fields: wordId, difficulty" },
        { status: 400 }
      );
    }

    if (!["hard", "medium", "easy"].includes(difficulty)) {
      return NextResponse.json(
        { error: "Invalid difficulty. Must be 'hard', 'medium', or 'easy'" },
        { status: 400 }
      );
    }

    // 获取当前单词状态
    const word = await prisma.word.findUnique({
      where: { id: wordId },
    });

    if (!word) {
      return NextResponse.json({ error: "Word not found" }, { status: 404 });
    }

    // 计算新的复习参数
    const reviewResult = calculateNextReview(
      word.reviewStage,
      word.interval,
      word.easeFactor,
      difficulty as Difficulty,
      word.reviewCount
    );

    // 使用事务更新单词和创建复习记录
    const result = await prisma.$transaction(async tx => {
      // 更新单词状态
      const updatedWord = await tx.word.update({
        where: { id: wordId },
        data: {
          reviewStage: reviewResult.newStage,
          interval: reviewResult.newInterval,
          easeFactor: reviewResult.newEaseFactor,
          nextReviewDate: reviewResult.nextReviewDate,
          masteryLevel: reviewResult.masteryLevel,
          reviewCount: word.reviewCount + 1,
          correctCount: wasCorrect ? word.correctCount + 1 : word.correctCount,
          updatedAt: new Date(),
        },
      });

      // 创建复习记录
      const review = await tx.review.create({
        data: {
          wordId,
          difficulty,
          responseTime: responseTime || null,
          wasCorrect: wasCorrect ?? true, // 默认为正确
          oldStage: word.reviewStage,
          newStage: reviewResult.newStage,
          oldInterval: word.interval,
          newInterval: reviewResult.newInterval,
        },
      });

      return { word: updatedWord, review };
    });

    return NextResponse.json({
      success: true,
      word: result.word,
      review: result.review,
      nextReview: {
        stage: reviewResult.newStage,
        interval: reviewResult.newInterval,
        nextDate: reviewResult.nextReviewDate,
        masteryLevel: reviewResult.masteryLevel,
      },
    });
  } catch (error) {
    console.error("Error submitting review:", error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
