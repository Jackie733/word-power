# Word Power - Project Design Document

## 📖 Project Overview

Word Power is an English word learning application based on the Ebbinghaus forgetting curve, designed to help users efficiently learn and remember English words.

## 🎯 Core Features

### 1. Dashboard

- **Path**: `/`
- **Functionality**:
  - Display today's learning statistics (new words, words reviewed, completed, accuracy)
  - Quick access to main features (Learn New Words, Review Words, Manage Words, Learning Stats)
  - Display list of words due for review
- **Design Philosophy**: An at-a-glance overview interface that allows users to quickly understand their learning progress.

### 2. Learn New Words

- **Path**: `/learn/new`
- **Functionality**:
  - Form to add new words (word, pronunciation, definition, example sentence)
  - Learning tips and review schedule explanation
  - Suggestions for memorization techniques
- **Design Philosophy**: A clean input interface combined with learning guidance.

### 3. Review Words

- **Path**: `/learn/review`
- **Functionality**:
  - Flashcard-style review interface
  - Progress bar to show review progress
  - Difficulty feedback system (Easy/Medium/Hard)
  - Completion status page
- **Design Philosophy**: A focused learning experience with minimal distractions.

### 4. Words Management

- **Path**: `/words`
- **Functionality**:
  - Overview and statistics of the word library
  - Search and filter functions
  - Visualization of mastery level
  - Detailed word information display
- **Design Philosophy**: A comprehensive word management interface.

### 5. Learning Statistics

- **Path**: `/stats`
- **Functionality**:
  - Display of learning achievements
  - Weekly goal progress tracking
  - Mastery level distribution chart
  - Record of recent learning activities
  - Personalized learning suggestions
- **Design Philosophy**: Data-driven learning feedback.

## 🧠 Ebbinghaus Forgetting Curve Algorithm

### Review Intervals

- **1st Review**: Immediately
- **2nd Review**: After 1 day
- **3rd Review**: After 3 days
- **4th Review**: After 7 days
- **5th Review**: After 15 days
- **6th Review**: After 30 days

### Difficulty Adjustment Mechanism

- **Easy**: Extend the next review interval (×1.5)
- **Medium**: Maintain the standard interval (×1.0)
- **Hard**: Shorten the next review interval (×0.6)

## 🎨 UI/UX Design Principles

### Visual Design

- **Color Scheme**: Blue as the primary color, supplemented with green (success), yellow (warning), and red (error).
- **Layout**: Responsive design, supporting both desktop and mobile.
- **Typography**: Use the Geist font family for good readability.

### Interaction Design

- **Navigation**: Top navigation bar with a clear page hierarchy.
- **Feedback**: Timely feedback for user actions.
- **Progressive Disclosure**: Avoid information overload by showing details on demand.

### User Experience

- **Learning Flow**: Simplified learning path to reduce cognitive load.
- **Sense of Achievement**: Enhance user's sense of achievement through statistics and progress bars.
- **Personalization**: Provide personalized suggestions based on the user's learning situation.

## 🏗️ Technical Architecture

### Frontend Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **Code Style**: ESLint + Prettier

### Component Structure

```
app/
├── components/
│   └── Navigation.tsx          # Navigation component
├── learn/
│   ├── new/
│   │   └── page.tsx           # Learn New Words page
│   └── review/
│       └── page.tsx           # Review Words page
├── words/
│   └── page.tsx               # Word Management page
├── stats/
│   └── page.tsx               # Learning Stats page
├── layout.tsx                 # Root layout
└── page.tsx                   # Dashboard page
```

## 📊 Data Model

### Word Model

```typescript
interface Word {
  id: number;
  word: string; // The word itself
  pronunciation: string; // Phonetic transcription
  meaning: string; // Definition in English
  example: string; // Example sentence
  addedDate: string; // Date added
  reviewCount: number; // Number of reviews
  masteryLevel: number; // Mastery level (0-100)
  nextReviewDate: string; // Next review date
  reviewStage: number; // Review stage (1-6)
}
```

### ReviewSession Model

```typescript
interface ReviewSession {
  id: number;
  wordId: number;
  reviewDate: string;
  difficulty: "easy" | "medium" | "hard";
  responseTime: number; // Response time in seconds
  isCorrect: boolean; // Was the answer correct
}
```

## 🚀 Future Development Plan

### Phase 1: Core Feature Refinement

- [ ] Data persistence (localStorage/IndexedDB)
- [ ] Word import/export functionality
- [ ] Audio playback feature

### Phase 2: Advanced Features

- [ ] Word categorization and tagging system
- [ ] Learning reminder notifications
- [ ] Exportable learning reports

### Phase 3: Smart Features

- [ ] Optimization of the smart review algorithm
- [ ] Recommended learning paths
- [ ] Word difficulty assessment

### Phase 4: Social Features

- [ ] Shareable learning check-ins
- [ ] Study group functionality
- [ ] Leaderboard system

## 🔧 Development Environment Setup

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

### Format Code

```bash
npm run format
```

### Lint Code

```bash
npm run lint
```

## 📝 Contribution Guide

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
