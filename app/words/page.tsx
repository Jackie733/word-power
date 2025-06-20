"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Search,
  Filter,
  Plus,
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AnimatedContainer } from "@/components/animated-container";
import { StatCard } from "@/components/ui/stat-card";

interface Word {
  id: number;
  word: string;
  pronunciation: string;
  meaning: string;
  example: string;
  addedDate: string;
  reviewCount: number;
  masteryLevel: number;
  nextReviewDate: string;
}

export default function WordsManagement() {
  // Mock word data
  const [words] = useState<Word[]>([
    {
      id: 1,
      word: "serendipity",
      pronunciation: "/ˌserənˈdɪpəti/",
      meaning:
        "The faculty of making happy and unexpected discoveries by accident.",
      example: "It was pure serendipity that led me to find this book.",
      addedDate: "2024-01-15",
      reviewCount: 3,
      masteryLevel: 65,
      nextReviewDate: "2024-01-20",
    },
    {
      id: 2,
      word: "ubiquitous",
      pronunciation: "/juːˈbɪkwɪtəs/",
      meaning: "Present, appearing, or found everywhere.",
      example: "Smartphones have become ubiquitous in modern society.",
      addedDate: "2024-01-14",
      reviewCount: 2,
      masteryLevel: 45,
      nextReviewDate: "2024-01-19",
    },
    {
      id: 3,
      word: "ephemeral",
      pronunciation: "/ɪˈfem(ə)rəl/",
      meaning: "Lasting for a very short time.",
      example: "The beauty of cherry blossoms is ephemeral.",
      addedDate: "2024-01-13",
      reviewCount: 4,
      masteryLevel: 80,
      nextReviewDate: "2024-01-25",
    },
    {
      id: 4,
      word: "eloquent",
      pronunciation: "/ˈeləkwənt/",
      meaning: "Fluent or persuasive in speaking or writing.",
      example: "She gave an eloquent speech about climate change.",
      addedDate: "2024-01-12",
      reviewCount: 1,
      masteryLevel: 25,
      nextReviewDate: "2024-01-18",
    },
    {
      id: 5,
      word: "paradigm",
      pronunciation: "/ˈpærəˌdaɪm/",
      meaning: "A typical example or pattern of something; a model.",
      example: "The new theory represents a paradigm shift in physics.",
      addedDate: "2024-01-11",
      reviewCount: 5,
      masteryLevel: 90,
      nextReviewDate: "2024-02-01",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"word" | "addedDate" | "masteryLevel">(
    "addedDate"
  );
  const [filterBy, setFilterBy] = useState<"all" | "learning" | "mastered">(
    "all"
  );

  // Filter and sort words
  const filteredAndSortedWords = words
    .filter(word => {
      const matchesSearch =
        word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.meaning.toLowerCase().includes(searchTerm.toLowerCase());

      if (filterBy === "learning")
        return matchesSearch && word.masteryLevel < 80;
      if (filterBy === "mastered")
        return matchesSearch && word.masteryLevel >= 80;
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "word") return a.word.localeCompare(b.word);
      if (sortBy === "addedDate")
        return (
          new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
        );
      if (sortBy === "masteryLevel") return b.masteryLevel - a.masteryLevel;
      return 0;
    });

  const getMasteryVariant = (
    level: number
  ): "default" | "secondary" | "destructive" => {
    if (level >= 80) return "default";
    if (level >= 50) return "secondary";
    return "destructive";
  };

  const getMasteryText = (level: number) => {
    if (level >= 80) return "Mastered";
    if (level >= 50) return "Learning";
    return "Needs Improvement";
  };

  const totalWords = words.length;
  const masteredWords = words.filter(w => w.masteryLevel >= 80).length;
  const learningWords = words.filter(w => w.masteryLevel < 80).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <AnimatedContainer variant="fadeIn">
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center mb-4"
            >
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
            </motion.div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-2">
                  Word Management
                </h1>
                <p className="text-slate-600 text-lg">
                  Manage your word library, {totalWords} words in total
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Button
                  asChild
                  className="mt-4 sm:mt-0 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Link href="/learn/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Word
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </AnimatedContainer>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Words"
            value={totalWords.toString()}
            icon={<BookOpen className="h-6 w-6" />}
            trend="up"
            trendValue="+12"
            className="delay-0"
          />
          <StatCard
            title="Mastered"
            value={masteredWords.toString()}
            icon={<CheckCircle className="h-6 w-6" />}
            trend="up"
            trendValue="+8"
            className="delay-100"
          />
          <StatCard
            title="Learning"
            value={learningWords.toString()}
            icon={<Clock className="h-6 w-6" />}
            trend="neutral"
            trendValue="0"
            className="delay-200"
          />
        </div>

        {/* Search and Filter */}
        <AnimatedContainer variant="slideUp" className="mb-8">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Search & Filter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Search Words
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="text"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="pl-10"
                      placeholder="Enter word or definition..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as typeof sortBy)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="addedDate">By Date Added</option>
                    <option value="word">Alphabetically</option>
                    <option value="masteryLevel">By Mastery Level</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Filter By
                  </label>
                  <select
                    value={filterBy}
                    onChange={e =>
                      setFilterBy(e.target.value as typeof filterBy)
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="all">All Words</option>
                    <option value="learning">Learning</option>
                    <option value="mastered">Mastered</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedContainer>

        {/* Word List */}
        <AnimatedContainer variant="slideUp" delay={0.2}>
          <div className="space-y-4">
            {filteredAndSortedWords.map((word, index) => (
              <motion.div
                key={word.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="shadow-md hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm group">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                            {word.word}
                          </h3>
                          <Badge variant={getMasteryVariant(word.masteryLevel)}>
                            {getMasteryText(word.masteryLevel)}
                          </Badge>
                        </div>

                        <p className="text-slate-600 mb-1">
                          {word.pronunciation}
                        </p>
                        <p className="text-slate-700 mb-2 font-medium">
                          {word.meaning}
                        </p>
                        <p className="text-slate-600 text-sm italic">
                          &ldquo;{word.example}&rdquo;
                        </p>

                        <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                          <span>Added: {word.addedDate}</span>
                          <span>Reviewed: {word.reviewCount} times</span>
                          <span>Next Review: {word.nextReviewDate}</span>
                        </div>
                      </div>

                      <div className="lg:w-48 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-slate-700">
                            Mastery Level
                          </span>
                          <span className="text-sm font-bold">
                            {word.masteryLevel}%
                          </span>
                        </div>
                        <Progress value={word.masteryLevel} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredAndSortedWords.length === 0 && (
            <Card className="shadow-md border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <div className="text-slate-400 mb-4">
                  <BookOpen className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-slate-600 mb-2">
                  No matching words found
                </h3>
                <p className="text-slate-500">
                  Try adjusting your search criteria or adding a new word
                </p>
                <Button asChild className="mt-4">
                  <Link href="/learn/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Word
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </AnimatedContainer>
      </div>
    </div>
  );
}
