import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 检查数据库连接
    await prisma.$connect();

    // 获取数据库统计信息
    const [wordCount, reviewCount, recentWords] = await Promise.all([
      prisma.word.count(),
      prisma.review.count(),
      prisma.word.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          text: true,
          createdAt: true,
          masteryLevel: true,
        },
      }),
    ]);

    // 获取环境信息
    const dbUrl = process.env.DATABASE_URL;
    const nodeEnv = process.env.NODE_ENV;

    return NextResponse.json({
      status: "connected",
      environment: nodeEnv,
      databaseUrl: dbUrl ? `${dbUrl.split("@")[0]}@***` : "not set", // 隐藏敏感信息
      statistics: {
        totalWords: wordCount,
        totalReviews: reviewCount,
      },
      recentWords,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
