import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const sampleWords = [
  {
    text: "serendipity",
    pronunciation: "/ˌsɛrənˈdɪpɪti/",
    meaning:
      "The occurrence and development of events by chance in a happy or beneficial way",
    example:
      "A fortunate stroke of serendipity brought them together at the coffee shop.",
  },
  {
    text: "ephemeral",
    pronunciation: "/ɪˈfɛmərəl/",
    meaning: "Lasting for a very short time",
    example:
      "The beauty of cherry blossoms is ephemeral, lasting only a few weeks.",
  },
  {
    text: "ubiquitous",
    pronunciation: "/yuˈbɪkwɪtəs/",
    meaning: "Present, appearing, or found everywhere",
    example: "Smartphones have become ubiquitous in modern society.",
  },
  {
    text: "mellifluous",
    pronunciation: "/məˈlɪfluəs/",
    meaning: "Sweet or musical; pleasant to hear",
    example: "Her mellifluous voice made everyone stop and listen.",
  },
  {
    text: "perspicacious",
    pronunciation: "/ˌpɜrspɪˈkeɪʃəs/",
    meaning: "Having a ready insight into and understanding of things",
    example:
      "His perspicacious analysis of the market trends impressed the investors.",
  },
  {
    text: "quintessential",
    pronunciation: "/ˌkwɪntɪˈsɛnʃəl/",
    meaning: "Representing the most perfect example of a quality or class",
    example:
      "She is the quintessential professional, always punctual and well-prepared.",
  },
  {
    text: "sanguine",
    pronunciation: "/ˈsæŋɡwɪn/",
    meaning:
      "Optimistic or positive, especially in an apparently bad situation",
    example:
      "Despite the challenges, she remained sanguine about the project's success.",
  },
  {
    text: "verbose",
    pronunciation: "/vərˈboʊs/",
    meaning: "Using or expressed in more words than are needed",
    example:
      "His verbose explanation confused rather than clarified the issue.",
  },
  {
    text: "zenith",
    pronunciation: "/ˈziːnɪθ/",
    meaning: "The time at which something is most powerful or successful",
    example: "The company reached its zenith in the 1990s before declining.",
  },
  {
    text: "altruistic",
    pronunciation: "/ˌæltruˈɪstɪk/",
    meaning:
      "Showing a disinterested and selfless concern for the well-being of others",
    example:
      "Her altruistic nature led her to volunteer at the homeless shelter every weekend.",
  },
];

async function main() {
  console.log("开始种子数据填充...");

  // 清理现有数据
  await prisma.review.deleteMany();
  await prisma.word.deleteMany();

  // 创建单词
  const words = [];
  for (const wordData of sampleWords) {
    const word = await prisma.word.create({
      data: {
        text: wordData.text,
        pronunciation: wordData.pronunciation,
        meaning: wordData.meaning,
        example: wordData.example,
        reviewStage: Math.floor(Math.random() * 4), // 随机设置复习阶段 0-3
        nextReviewDate: new Date(
          Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000
        ), // 随机设置未来7天内的复习时间
        reviewCount: Math.floor(Math.random() * 10), // 随机复习次数
        correctCount: Math.floor(Math.random() * 8), // 随机正确次数
        easeFactor: 2.5 + (Math.random() - 0.5) * 0.6, // 随机难度系数 2.2-2.8
        interval: Math.floor(Math.random() * 30) + 1, // 随机间隔 1-30天
        masteryLevel: ["NEW", "LEARNING", "REVIEW"][
          Math.floor(Math.random() * 3)
        ], // 随机掌握程度
      },
    });
    words.push(word);
  }

  // 创建一些复习记录
  const difficulties = ["easy", "medium", "hard"];
  const today = new Date();

  for (let i = 0; i < 20; i++) {
    const word = words[Math.floor(Math.random() * words.length)];
    const difficulty =
      difficulties[Math.floor(Math.random() * difficulties.length)];
    const wasCorrect = Math.random() > 0.3; // 70% 正确率

    // 创建复习记录
    await prisma.review.create({
      data: {
        wordId: word.id,
        difficulty,
        responseTime: Math.floor(Math.random() * 10000) + 1000, // 1-11秒
        wasCorrect,
        oldStage: word.reviewStage,
        newStage: word.reviewStage + (wasCorrect ? 1 : 0),
        oldInterval: word.interval,
        newInterval: word.interval + Math.floor(Math.random() * 5),
        createdAt: new Date(
          today.getTime() - Math.random() * 24 * 60 * 60 * 1000
        ), // 今天内随机时间
      },
    });
  }

  // 设置一些单词需要立即复习
  const wordsToReview = words.slice(0, 5);
  for (const word of wordsToReview) {
    await prisma.word.update({
      where: { id: word.id },
      data: {
        nextReviewDate: new Date(
          Date.now() - Math.random() * 2 * 60 * 60 * 1000
        ), // 过去2小时内
      },
    });
  }

  console.log(`已创建 ${words.length} 个单词和 20 条复习记录`);
  console.log("种子数据填充完成!");
}

main()
  .catch(e => {
    console.error("种子数据填充失败:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
