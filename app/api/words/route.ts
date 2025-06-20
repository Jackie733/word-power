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

    const newWord = await prisma.word.upsert({
      where: { text: word },
      update: {
        pronunciation,
        meaning,
        example,
        audioUrl,
      },
      create: {
        text: word,
        pronunciation,
        meaning,
        example,
        audioUrl,
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
