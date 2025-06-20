import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import {
  getReviewWordsFilter,
  calculateReviewPriority,
} from "@/lib/spaced-repetition";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");

    // 获取需要复习的单词
    const reviewWords = await prisma.word.findMany({
      where: getReviewWordsFilter(),
      orderBy: [
        // 按优先级排序：越早需要复习的越靠前
        { nextReviewDate: "asc" },
        { reviewStage: "asc" },
      ],
      take: limit,
    });

    // 计算优先级并排序
    const wordsWithPriority = reviewWords.map(word => ({
      ...word,
      priority: calculateReviewPriority(word.nextReviewDate),
    }));

    // 按优先级重新排序
    wordsWithPriority.sort((a, b) => b.priority - a.priority);

    return NextResponse.json({
      words: wordsWithPriority,
      total: wordsWithPriority.length,
    });
  } catch (error) {
    console.error("Error fetching review words:", error);
    return NextResponse.json(
      { error: "Failed to fetch review words" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
