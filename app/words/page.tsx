import Link from "next/link";
import { BookOpen, CheckCircle, Clock, Plus } from "lucide-react";
import { PrismaClient } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { WordList } from "./_components/word-list";
import { type Word } from "@prisma/client";

const prisma = new PrismaClient();

async function getWords(): Promise<Word[]> {
  try {
    const words = await prisma.word.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return words;
  } catch (error) {
    console.error("Error fetching words:", error);
    return []; // Return empty array on error
  } finally {
    await prisma.$disconnect();
  }
}

export default async function WordsManagementPage() {
  const words = await getWords();

  const totalWords = words.length;
  // These stats can be enhanced later (e.g., mastery level)
  const masteredWords = 0;
  const learningWords = totalWords;

  return (
    <div className="bg-gradient-to-br from-background via-muted/20 to-background min-h-screen">
      <div className="container mx-auto px-4 py-4 md:py-8">
        <PageHeader
          title="Word Library"
          description={`You have ${totalWords} words in your collection.`}
          action={
            <Button
              asChild
              className="shadow-lg hover:shadow-xl transition-all duration-300"
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
          />
          <StatCard
            title="Mastered"
            value={masteredWords.toString()}
            icon={<CheckCircle className="h-6 w-6" />}
          />
          <StatCard
            title="Learning"
            value={learningWords.toString()}
            icon={<Clock className="h-6 w-6" />}
          />
        </div>

        <WordList initialWords={words} />
      </div>
    </div>
  );
}
