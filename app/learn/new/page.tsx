"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowLeft,
  BookOpen,
  Volume2,
  Info,
  Search,
  Loader2,
  AlertCircle,
  History,
  Brain,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AnimatedContainer } from "@/components/animated-container";

interface WordData {
  word: string;
  pronunciation: string;
  meaning: string;
  example: string;
  audioUrl?: string;
}

// --- Type definitions for the APIs ---

// 1. For dictionaryapi.dev
interface DictionaryApiPhonetic {
  text?: string;
  audio?: string;
}
interface DictionaryApiDefinition {
  definition: string;
  example?: string;
}
interface DictionaryApiMeaning {
  partOfSpeech: string;
  definitions: DictionaryApiDefinition[];
}
interface DictionaryApiResponse {
  word: string;
  phonetic?: string;
  phonetics: DictionaryApiPhonetic[];
  meanings: DictionaryApiMeaning[];
}

// 2. For DeepL API
interface DeepLApiResponse {
  code: number;
  data: string;
  alternatives?: string[];
}

export default function LearnNewWords() {
  // State for the main form that gets submitted
  const [word, setWord] = useState("");
  const [pronunciation, setPronunciation] = useState("");
  const [meaning, setMeaning] = useState("");
  const [example, setExample] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for the dictionary search functionality
  const [wordToSearch, setWordToSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [wordData, setWordData] = useState<WordData | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const wordToSearchTrimmed = wordToSearch.trim();
    if (!wordToSearchTrimmed) return;

    setIsSearching(true);
    setSearchError(null);
    setWordData(null);
    setWord("");
    setPronunciation("");
    setMeaning("");
    setExample("");

    try {
      // --- Step 1: Fire both API requests in parallel ---
      const [dictionaryResponse, deeplResponse] = await Promise.all([
        fetch(
          `${process.env.NEXT_PUBLIC_DICTIONARY_API_URL}/${wordToSearchTrimmed}`
        ),
        fetch(process.env.NEXT_PUBLIC_DEEPL_API_URL!, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: wordToSearchTrimmed,
            source_lang: "EN",
            target_lang: "ZH",
          }),
        }),
      ]);

      // --- Step 2: Process both responses ---

      // Process DictionaryAPI response for pronunciation and example
      let pron = "";
      let exampleSentence = "";
      let audioSrc = "";
      if (dictionaryResponse.ok) {
        const dictData: DictionaryApiResponse[] =
          await dictionaryResponse.json();
        const firstEntry = dictData[0];
        if (firstEntry) {
          let rawPron =
            firstEntry.phonetic || firstEntry.phonetics?.[0]?.text || "";
          if (rawPron && !rawPron.startsWith("/")) {
            rawPron = `/${rawPron}/`;
          }
          pron = rawPron;

          exampleSentence =
            firstEntry.meanings?.[0]?.definitions?.[0]?.example || "";
          audioSrc = firstEntry.phonetics.find(p => p.audio)?.audio || "";
        }
      } else {
        console.warn("DictionaryAPI call failed, proceeding without it.");
      }

      // Process DeepL response for Chinese meaning
      if (!deeplResponse.ok) {
        throw new Error("Translation API request failed.");
      }
      const deeplData: DeepLApiResponse = await deeplResponse.json();
      if (deeplData.code !== 200) {
        throw new Error("Translation API returned an error: " + deeplData.data);
      }
      let chineseMeaning = deeplData.data;
      if (deeplData.alternatives && deeplData.alternatives.length > 0) {
        chineseMeaning += `\n(${deeplData.alternatives.join(", ")})`;
      }

      // --- Step 3: Combine data and update state ---
      const processedData: WordData = {
        word: wordToSearchTrimmed,
        pronunciation: pron,
        meaning: chineseMeaning,
        example: exampleSentence,
        audioUrl: audioSrc,
      };

      setWordData(processedData);
      setWord(processedData.word);
      setPronunciation(processedData.pronunciation);
      setMeaning(processedData.meaning);
      setExample(processedData.example);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setSearchError(error.message);
      } else {
        setSearchError("An unknown error occurred.");
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wordData) return;

    setIsSubmitting(true);
    setSearchError(null); // Clear previous errors

    try {
      const response = await fetch("/api/words", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          word: wordData.word,
          pronunciation: wordData.pronunciation,
          meaning: wordData.meaning,
          example: wordData.example,
          audioUrl: wordData.audioUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add word.");
      }

      // Reset form and all state on success
      setWord("");
      setPronunciation("");
      setMeaning("");
      setExample("");
      setWordData(null);
      setWordToSearch("");
      setSearchError(null);
      // Optionally, show a success message here in the future
    } catch (error: unknown) {
      if (error instanceof Error) {
        setSearchError(error.message);
      } else {
        setSearchError("An unknown error occurred while saving the word.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <AnimatedContainer variant="slideDown" className="mb-8">
          <motion.div
            className="flex items-center mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
            </Button>
          </motion.div>
          <motion.h1
            className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            Learn New Words
          </motion.h1>
          <motion.p
            className="text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Add new English words to your learning library
          </motion.p>
        </AnimatedContainer>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Word Form */}
          <AnimatedContainer variant="slideUp" delay={0.3}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Add a New Word
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Search Section */}
                <form
                  onSubmit={handleSearch}
                  className="flex items-center gap-2 mb-6"
                >
                  <Input
                    type="text"
                    value={wordToSearch}
                    onChange={e => setWordToSearch(e.target.value)}
                    placeholder="Enter an English word to look up"
                    required
                    className="flex-1"
                    disabled={isSearching}
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    disabled={isSearching}
                  >
                    {isSearching ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                  </Button>
                </form>

                {searchError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 mb-4 text-sm text-destructive bg-destructive/10 rounded-md flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {searchError}
                  </motion.div>
                )}

                {/* Word Form - populates after search */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                  >
                    <label
                      htmlFor="word"
                      className="block text-sm font-medium mb-2"
                    >
                      Word *
                    </label>
                    <Input
                      type="text"
                      id="word"
                      value={word}
                      onChange={e => setWord(e.target.value)}
                      placeholder="e.g., serendipity"
                      required
                      className="transition-all duration-200"
                      readOnly={!wordData}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                    className="flex items-center gap-2"
                  >
                    <div className="flex-1">
                      <label
                        htmlFor="pronunciation"
                        className="block text-sm font-medium mb-2"
                      >
                        Pronunciation
                      </label>
                      <Input
                        type="text"
                        id="pronunciation"
                        value={pronunciation}
                        onChange={e => setPronunciation(e.target.value)}
                        placeholder="e.g., /ˌserənˈdɪpəti/"
                        className="transition-all duration-200"
                        readOnly={!wordData}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-6"
                      onClick={() => {
                        if (wordData?.audioUrl) {
                          new Audio(wordData.audioUrl).play();
                        }
                      }}
                      disabled={!wordData?.audioUrl}
                    >
                      <Volume2 className="w-4 h-4" />
                    </Button>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.3 }}
                  >
                    <label
                      htmlFor="meaning"
                      className="block text-sm font-medium mb-2"
                    >
                      Definition *
                    </label>
                    <Textarea
                      id="meaning"
                      value={meaning}
                      onChange={e => setMeaning(e.target.value)}
                      rows={3}
                      placeholder="The occurrence and development of events by chance in a happy or beneficial way."
                      required
                      className="transition-all duration-200 resize-none"
                      readOnly={!wordData}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.3 }}
                  >
                    <label
                      htmlFor="example"
                      className="block text-sm font-medium mb-2"
                    >
                      Example Sentence
                    </label>
                    <Textarea
                      id="example"
                      value={example}
                      onChange={e => setExample(e.target.value)}
                      rows={3}
                      placeholder="e.g., 'A fortunate stroke of serendipity led us to the charming café.'"
                      className="transition-all duration-200 resize-none"
                      readOnly={!wordData}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.3 }}
                  >
                    <Button
                      type="submit"
                      disabled={isSubmitting || !wordData}
                      className="w-full"
                      size="lg"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <BookOpen className="w-4 h-4 mr-2" />
                      )}
                      {isSubmitting ? "Adding..." : "Add Word to Library"}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </AnimatedContainer>

          {/* Learning Tips Section */}
          <AnimatedContainer variant="slideUp" delay={0.4}>
            <Accordion
              type="single"
              collapsible
              defaultValue="item-1"
              className="w-full"
            >
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    <span>Learning Tips</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 pl-4 text-sm text-muted-foreground list-disc">
                    <li>
                      After adding a word, the first learning session will start
                      immediately.
                    </li>
                    <li>
                      Try to understand the definition and example sentence
                      thoroughly.
                    </li>
                    <li>
                      Use the pronunciation guide to practice speaking the word
                      aloud.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <History className="w-5 h-5" />
                    <span>Review Plan</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">
                    Words you add will be automatically scheduled for review
                    using a spaced repetition system (SRS) to enhance long-term
                    memory. You&apos;ll be prompted to review them at increasing
                    intervals: 1 day, 3 days, 1 week, and so on.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    <span>Memory Tips</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 pl-4 text-sm text-muted-foreground list-disc">
                    <li>
                      Create a mental image associated with the word&apos;s
                      meaning.
                    </li>
                    <li>
                      Connect the new word to words you already know, either in
                      English or your native language.
                    </li>
                    <li>
                      Try to use the new word in a sentence of your own
                      creation.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </AnimatedContainer>
        </div>
      </div>
    </div>
  );
}
