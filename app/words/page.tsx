import Link from "next/link";
import { ArrowLeft, BookOpen, CheckCircle, Clock, Plus } from "lucide-react";
import { PrismaClient } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { AnimatedContainer } from "@/components/animated-container";
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
      <div className="container mx-auto px-4 py-8">
        <AnimatedContainer variant="fadeIn">
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="hover:bg-white/50"
              >
                <Link href="/" className="text-blue-600 hover:text-blue-800">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-2">
                  Word Library
                </h1>
                <p className="text-muted-foreground text-lg">
                  You have {totalWords} words in your collection.
                </p>
              </div>

              <div>
                <Button
                  asChild
                  className="mt-4 sm:mt-0 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Link href="/learn/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Word
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </AnimatedContainer>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

        <AnimatedContainer variant="slideUp" className="mt-8">
          <WordList initialWords={words} />
        </AnimatedContainer>
      </div>
    </div>
  );
}
