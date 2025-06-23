"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  BookOpen,
  Search,
  Volume2,
  Loader2,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Globe,
  MessageSquare,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
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
    setSubmitError(null);
    setSubmitSuccess(false);

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
      setSubmitSuccess(true);
      setSubmitError(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setSubmitError(error.message);
      } else {
        setSubmitError("An unknown error occurred.");
      }
      setSubmitSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setWord("");
    setPronunciation("");
    setMeaning("");
    setExample("");
    setWordData(null);
    setWordToSearch("");
    setSubmitSuccess(false);
    setSubmitError(null);
    setSearchError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-900/20">
      <div className="container mx-auto px-4 py-2 md:py-6 max-w-4xl">
        <motion.div
          className="text-center mb-4 md:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-3 p-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-slate-700/50"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-foreground">
                Smart Word Discovery
              </h3>
              <p className="text-sm text-muted-foreground">
                AI-powered definitions and translations
              </p>
            </div>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                    <Search className="w-5 h-5 text-emerald-600" />
                  </div>
                  Word Search
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="space-y-4">
                  <div>
                    <Input
                      placeholder="Enter a word to look up..."
                      value={wordToSearch}
                      onChange={e => setWordToSearch(e.target.value)}
                      disabled={isSearching}
                      className="text-lg py-3 border-2 focus:border-emerald-500 transition-colors"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSearching || !wordToSearch.trim()}
                    className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isSearching ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Search Word
                      </>
                    )}
                  </Button>
                </form>

                {searchError && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <p className="text-sm text-red-700 dark:text-red-400">
                        {searchError}
                      </p>
                    </div>
                  </motion.div>
                )}

                <motion.div
                  className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 rounded-lg border border-blue-200/50 dark:border-blue-800/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Learning Tips
                  </h4>
                  <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
                    <li>• Try searching for words you encounter in reading</li>
                    <li>• Focus on words relevant to your interests</li>
                    <li>• Review pronunciation and example sentences</li>
                  </ul>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Word Form Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  Word Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">
                      Word
                    </label>
                    <Input
                      placeholder="English word"
                      value={word}
                      onChange={e => setWord(e.target.value)}
                      required
                      className="border-2 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">
                      Pronunciation
                    </label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="/pronunciation/"
                        value={pronunciation}
                        onChange={e => setPronunciation(e.target.value)}
                        className="border-2 focus:border-blue-500 transition-colors"
                      />
                      {wordData?.audioUrl && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            const audio = new Audio(wordData.audioUrl);
                            audio.play().catch(console.error);
                          }}
                        >
                          <Volume2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">
                      Meaning
                    </label>
                    <Textarea
                      placeholder="Chinese translation or definition"
                      value={meaning}
                      onChange={e => setMeaning(e.target.value)}
                      required
                      rows={3}
                      className="border-2 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">
                      Example Sentence
                    </label>
                    <Textarea
                      placeholder="Example sentence in English"
                      value={example}
                      onChange={e => setExample(e.target.value)}
                      rows={2}
                      className="border-2 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="submit"
                      disabled={isSubmitting || !wordData}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <BookOpen className="w-4 h-4 mr-2" />
                          Add Word
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                      disabled={isSubmitting}
                      className="border-2"
                    >
                      Reset
                    </Button>
                  </div>
                </form>

                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <p className="text-sm text-red-700 dark:text-red-400">
                        {submitError}
                      </p>
                    </div>
                  </motion.div>
                )}

                {submitSuccess && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <p className="text-sm text-emerald-700 dark:text-emerald-400">
                        Word added successfully! Ready to learn more?
                      </p>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Learning Strategy Section */}
        <motion.div
          className="mt-8 md:mt-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                </div>
                Learning Strategy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    title: "Spaced Repetition",
                    description:
                      "Words are reviewed at increasing intervals for better retention",
                    icon: "🔄",
                  },
                  {
                    title: "Contextual Learning",
                    description:
                      "Example sentences help you understand usage in context",
                    icon: "📝",
                  },
                  {
                    title: "Progress Tracking",
                    description:
                      "Monitor your learning progress and mastery levels",
                    icon: "📊",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    className="p-4 bg-gradient-to-br from-slate-50 to-white dark:from-slate-700 dark:to-slate-600 rounded-xl border border-slate-200 dark:border-slate-600"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <h4 className="font-semibold text-foreground mb-1">
                      {item.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
