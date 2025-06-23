import Link from "next/link";
import { BookOpen, CheckCircle, Clock, Plus } from "lucide-react";
import { PrismaClient } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { SimplePageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { WordList } from "./_components/word-list";
import { type Word } from "@prisma/client";

// 强制动态渲染，确保每次都获取最新数据
export const dynamic = "force-dynamic";
export const revalidate = 0;

const prisma = new PrismaClient();

async function getWords(): Promise<Word[]> {
  try {
    console.log("Fetching words from database...");
    const words = await prisma.word.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    console.log(`Found ${words.length} words in database`);
    return words;
  } catch (error) {
    console.error("Error fetching words:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export default async function WordsManagementPage() {
  let words: Word[];

  try {
    words = await getWords();
  } catch (error) {
    console.error("Failed to load words:", error);
    return (
      <div className="bg-gradient-to-br from-background via-muted/20 to-background min-h-screen">
        <div className="container mx-auto px-4 py-4 md:py-8">
          <SimplePageHeader
            title="Word Library"
            description="Error loading words"
          />
          <div className="text-center py-20 text-muted-foreground flex flex-col items-center gap-4">
            <BookOpen className="h-12 w-12" />
            <h3 className="text-xl font-semibold">Failed to Load Words</h3>
            <p>
              There was an error connecting to the database. Please try
              refreshing the page.
            </p>
            <Button onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const totalWords = words.length;
  const masteredWords = words.filter(
    word => word.masteryLevel === "MASTERED"
  ).length;
  const learningWords = words.filter(
    word => word.masteryLevel === "LEARNING"
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-purple-900/20">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <SimplePageHeader
          title="Word Library"
          description={`You have ${totalWords} words in your collection.`}
          action={
            <Button
              asChild
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href="/learn/new">
                <Plus className="h-4 w-4 mr-2" />
                Add New Word
              </Link>
            </Button>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <StatCard
            title="Total Words"
            value={totalWords.toString()}
            icon={<BookOpen className="h-6 w-6" />}
            description="Words in your library"
            trend="neutral"
          />
          <StatCard
            title="Mastered"
            value={masteredWords.toString()}
            icon={<CheckCircle className="h-6 w-6" />}
            description="Fully learned words"
            trend="up"
          />
          <StatCard
            title="Learning"
            value={learningWords.toString()}
            icon={<Clock className="h-6 w-6" />}
            description="In progress"
            trend="neutral"
          />
        </div>

        <WordList initialWords={words} />
      </div>
    </div>
  );
}
