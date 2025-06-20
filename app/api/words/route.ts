import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const words = await prisma.word.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(words);
  } catch (error) {
    console.error("Error fetching words:", error);
    return NextResponse.json(
      { error: "Failed to fetch words" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { word, pronunciation, meaning, example, audioUrl } = body;

    if (!word || !meaning) {
      return NextResponse.json(
        { error: "Word and meaning are required" },
        { status: 400 }
      );
    }

    // 设置新单词的初始复习状态
    const now = new Date();

    const newWord = await prisma.word.upsert({
      where: { text: word },
      update: {
        pronunciation,
        meaning,
        example,
        audioUrl,
        updatedAt: now,
      },
      create: {
        text: word,
        pronunciation,
        meaning,
        example,
        audioUrl,
        // 复习相关的初始状态
        reviewStage: 0,
        nextReviewDate: now, // 立即可以复习
        reviewCount: 0,
        correctCount: 0,
        easeFactor: 2.5,
        interval: 1,
        isLearning: true,
        masteryLevel: "NEW",
      },
    });

    return NextResponse.json(newWord, { status: 201 });
  } catch (error) {
    console.error("Error creating word:", error);
    return NextResponse.json(
      { error: "Failed to save word. It may already exist." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
