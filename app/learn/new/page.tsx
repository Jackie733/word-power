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
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";

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
    } catch (error: unknown) {
      if (error instanceof Error) {
        setSubmitError(error.message);
      } else {
        setSubmitError("An unknown error occurred while saving the word.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Page Title */}
        <PageHeader
          title="Learn New Words"
          description="Add new English words to your learning library"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Add Word Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
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
                      className="w-full"
                      disabled={isSubmitting || !wordData}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Adding Word...
                        </>
                      ) : (
                        <>
                          <BookOpen className="w-4 h-4 mr-2" />
                          Add to Library
                        </>
                      )}
                    </Button>
                  </motion.div>

                  {submitError && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 text-sm text-destructive bg-destructive/10 rounded-md flex items-center gap-2"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {submitError}
                    </motion.div>
                  )}

                  {submitSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 text-sm text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-900/20 rounded-md flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Word added successfully! You can now review it.
                    </motion.div>
                  )}
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Preview Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                {wordData ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-primary">
                        {word}
                      </h3>
                      {pronunciation && (
                        <p className="text-muted-foreground text-sm mt-1">
                          {pronunciation}
                        </p>
                      )}
                    </div>

                    {meaning && (
                      <div>
                        <h4 className="font-semibold mb-2">Definition</h4>
                        <p className="text-sm leading-relaxed">{meaning}</p>
                      </div>
                    )}

                    {example && (
                      <div>
                        <h4 className="font-semibold mb-2">Example</h4>
                        <p className="text-sm leading-relaxed italic">
                          &ldquo;{example}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>Search for a word to see the preview</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
