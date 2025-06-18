"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, BookOpen, Volume2, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

    // 这里后续会连接到数据库
    console.log("添加新单词:", { word, pronunciation, meaning, example });

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 重置表单
    setWord("");
    setPronunciation("");
    setMeaning("");
    setExample("");
    setIsSubmitting(false);

    alert("单词添加成功！");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
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
                返回仪表板
              </Link>
            </Button>
          </motion.div>
          <motion.h1
            className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            学习新单词
          </motion.h1>
          <motion.p
            className="text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            添加新的英语单词到您的学习库
          </motion.p>
        </AnimatedContainer>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 添加单词表单 */}
          <AnimatedContainer variant="slideUp" delay={0.3}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  添加新单词
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
                      单词 *
                    </label>
                    <Input
                      type="text"
                      id="word"
                      value={word}
                      onChange={e => setWord(e.target.value)}
                      placeholder="输入英语单词"
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
                        音标
                      </label>
                      <Input
                        type="text"
                        id="pronunciation"
                        value={pronunciation}
                        onChange={e => setPronunciation(e.target.value)}
                        placeholder="如：/ˈserendɪpɪti/"
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
                      中文释义 *
                    </label>
                    <Textarea
                      id="meaning"
                      value={meaning}
                      onChange={e => setMeaning(e.target.value)}
                      rows={3}
                      placeholder="输入中文释义"
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
                      例句
                    </label>
                    <Textarea
                      id="example"
                      value={example}
                      onChange={e => setExample(e.target.value)}
                      rows={3}
                      placeholder="输入英语例句"
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
                      {isSubmitting ? "添加中..." : "添加单词"}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </AnimatedContainer>

          {/* 学习提示 */}
          <div className="space-y-6">
            <AnimatedContainer variant="slideUp" delay={0.5}>
              <Card className="border-blue-200 bg-blue-50/50">
                <CardHeader>
                  <CardTitle className="text-blue-800 flex items-center gap-2">
                    📚 学习提示
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-blue-700">
                    <motion.li
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6, duration: 0.3 }}
                    >
                      • 添加单词后会立即开始第一次学习
                    </motion.li>
                    <motion.li
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7, duration: 0.3 }}
                    >
                      • 系统会根据艾宾浩斯遗忘曲线安排复习
                    </motion.li>
                    <motion.li
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8, duration: 0.3 }}
                    >
                      • 建议每天学习 10-20 个新单词
                    </motion.li>
                    <motion.li
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9, duration: 0.3 }}
                    >
                      • 可以添加个人化的例句帮助记忆
                    </motion.li>
                  </ul>
                </CardContent>
              </Card>
            </AnimatedContainer>

            <AnimatedContainer variant="slideUp" delay={0.6}>
              <Card className="border-green-200 bg-green-50/50">
                <CardHeader>
                  <CardTitle className="text-green-800 flex items-center gap-2">
                    🔄 复习计划
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-green-700">
                    <p>新单词的复习时间安排：</p>
                    <ul className="space-y-1 ml-4">
                      {[
                        "第1次：立即复习",
                        "第2次：1天后",
                        "第3次：3天后",
                        "第4次：7天后",
                        "第5次：15天后",
                        "第6次：30天后",
                      ].map((item, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: 0.7 + index * 0.1,
                            duration: 0.3,
                          }}
                        >
                          • {item}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </AnimatedContainer>

            <AnimatedContainer variant="slideUp" delay={0.7}>
              <Card className="border-yellow-200 bg-yellow-50/50">
                <CardHeader>
                  <CardTitle className="text-yellow-800 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    记忆技巧
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-yellow-700">
                    {[
                      "联想记忆：将单词与已知事物关联",
                      "词根词缀：学习常见的前缀和后缀",
                      "情境记忆：在具体语境中记忆单词",
                      "多感官记忆：听、说、读、写结合",
                    ].map((tip, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.1, duration: 0.3 }}
                      >
                        • {tip}
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </AnimatedContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
