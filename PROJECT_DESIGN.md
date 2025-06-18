# Word Power - 项目设计说明

## 📖 项目概述

Word Power 是一个基于艾宾浩斯遗忘曲线的英语单词学习应用，旨在帮助用户高效地学习和记忆英语单词。

## 🎯 核心功能

### 1. 仪表板 (Dashboard)

- **路径**: `/`
- **功能**:
  - 显示今日学习统计（新学单词、复习单词、已完成、正确率）
  - 快速访问主要功能（学习新单词、复习单词、单词管理、学习统计）
  - 显示待复习单词列表
- **设计理念**: 一目了然的概览界面，让用户快速了解学习进度

### 2. 学习新单词 (Learn New Words)

- **路径**: `/learn/new`
- **功能**:
  - 添加新单词表单（单词、音标、释义、例句）
  - 学习提示和复习计划说明
  - 记忆技巧建议
- **设计理念**: 简洁的输入界面，配合学习指导

### 3. 复习单词 (Review Words)

- **路径**: `/learn/review`
- **功能**:
  - 单词卡片式复习界面
  - 进度条显示复习进度
  - 难度反馈系统（简单/一般/困难）
  - 完成状态页面
- **设计理念**: 专注的学习体验，减少干扰

### 4. 单词管理 (Words Management)

- **路径**: `/words`
- **功能**:
  - 单词库总览和统计
  - 搜索和筛选功能
  - 掌握程度可视化
  - 单词详细信息展示
- **设计理念**: 全面的单词管理界面

### 5. 学习统计 (Learning Statistics)

- **路径**: `/stats`
- **功能**:
  - 学习成就展示
  - 本周目标进度跟踪
  - 掌握程度分布图
  - 最近学习活动记录
  - 个性化学习建议
- **设计理念**: 数据驱动的学习反馈

## 🧠 艾宾浩斯遗忘曲线算法

### 复习时间间隔

- **第1次**: 立即复习
- **第2次**: 1天后
- **第3次**: 3天后
- **第4次**: 7天后
- **第5次**: 15天后
- **第6次**: 30天后

### 难度调整机制

- **简单**: 延长下次复习间隔 (×1.5)
- **一般**: 保持标准间隔 (×1.0)
- **困难**: 缩短下次复习间隔 (×0.6)

## 🎨 UI/UX 设计原则

### 视觉设计

- **色彩方案**: 以蓝色为主色调，辅以绿色（成功）、黄色（警告）、红色（错误）
- **布局**: 响应式设计，支持桌面端和移动端
- **字体**: 使用 Geist 字体族，保证良好的可读性

### 交互设计

- **导航**: 顶部导航栏，清晰的页面层级
- **反馈**: 及时的用户操作反馈
- **渐进式披露**: 避免信息过载，按需显示详细信息

### 用户体验

- **学习流程**: 简化的学习路径，减少认知负担
- **成就感**: 通过统计和进度条增强用户成就感
- **个性化**: 根据用户学习情况提供个性化建议

## 🏗️ 技术架构

### 前端技术栈

- **框架**: Next.js 15 (App Router)
- **UI库**: React 19
- **样式**: Tailwind CSS 4
- **语言**: TypeScript
- **代码规范**: ESLint + Prettier

### 组件结构

```
app/
├── components/
│   └── Navigation.tsx          # 导航组件
├── learn/
│   ├── new/
│   │   └── page.tsx           # 学习新单词页面
│   └── review/
│       └── page.tsx           # 复习单词页面
├── words/
│   └── page.tsx               # 单词管理页面
├── stats/
│   └── page.tsx               # 学习统计页面
├── layout.tsx                 # 根布局
└── page.tsx                   # 仪表板页面
```

## 📊 数据模型

### Word 单词模型

```typescript
interface Word {
  id: number;
  word: string; // 单词
  pronunciation: string; // 音标
  meaning: string; // 中文释义
  example: string; // 例句
  addedDate: string; // 添加日期
  reviewCount: number; // 复习次数
  masteryLevel: number; // 掌握程度 (0-100)
  nextReviewDate: string; // 下次复习日期
  reviewStage: number; // 复习阶段 (1-6)
}
```

### ReviewSession 复习会话模型

```typescript
interface ReviewSession {
  id: number;
  wordId: number;
  reviewDate: string;
  difficulty: "easy" | "medium" | "hard";
  responseTime: number; // 响应时间(秒)
  isCorrect: boolean; // 是否正确
}
```

## 🚀 后续开发计划

### Phase 1: 基础功能完善

- [ ] 数据持久化（localStorage/IndexedDB）
- [ ] 单词导入/导出功能
- [ ] 音频播放功能

### Phase 2: 高级功能

- [ ] 单词分类和标签系统
- [ ] 学习提醒功能
- [ ] 学习报告导出

### Phase 3: 智能化功能

- [ ] 智能复习算法优化
- [ ] 学习路径推荐
- [ ] 单词难度评估

### Phase 4: 社交功能

- [ ] 学习打卡分享
- [ ] 学习小组功能
- [ ] 排行榜系统

## 🔧 开发环境配置

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 代码格式化

```bash
npm run format
```

### 代码检查

```bash
npm run lint
```

## 📝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。
