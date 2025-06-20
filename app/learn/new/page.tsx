"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowLeft,
  BookOpen,
  Volume2,
  Info,
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

export default function LearnNewWords() {
  const [word, setWord] = useState("");
  const [pronunciation, setPronunciation] = useState("");
  const [meaning, setMeaning] = useState("");
  const [example, setExample] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // This will be connected to the database later
    console.log("Adding new word:", { word, pronunciation, meaning, example });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Reset form
    setWord("");
    setPronunciation("");
    setMeaning("");
    setExample("");
    setIsSubmitting(false);

    alert("Word added successfully!");
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
                      placeholder="Enter an English word"
                      required
                      className="transition-all duration-200"
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
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-6"
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
                      placeholder="Enter the definition"
                      required
                      className="transition-all duration-200 resize-none"
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
                      placeholder="Enter an example sentence"
                      className="transition-all duration-200 resize-none"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.3 }}
                  >
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full"
                      size="lg"
                    >
                      {isSubmitting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                      ) : (
                        <BookOpen className="w-4 h-4 mr-2" />
                      )}
                      {isSubmitting ? "Adding..." : "Add Word"}
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
                      The system will schedule reviews based on the Ebbinghaus
                      forgetting curve.
                    </li>
                    <li>It is recommended to learn 10-20 new words daily.</li>
                    <li>
                      You can add personalized example sentences to aid memory.
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
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Review schedule for new words:</p>
                    <ul className="space-y-1 pl-4 list-disc">
                      <li>1st: Review immediately</li>
                      <li>2nd: After 1 day</li>
                      <li>3rd: After 3 days</li>
                      <li>4th: After 7 days</li>
                      <li>5th: After 15 days</li>
                      <li>6th: After 30 days</li>
                    </ul>
                  </div>
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
                      Association: Connect the word with something you already
                      know.
                    </li>
                    <li>Root words: Learn common prefixes and suffixes.</li>
                    <li>
                      Contextual memory: Memorize words in specific contexts.
                    </li>
                    <li>
                      Multi-sensory memory: Combine listening, speaking,
                      reading, and writing.
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
