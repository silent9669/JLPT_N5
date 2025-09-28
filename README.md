# JLPT N5 Study App

A comprehensive web application for JLPT N5 preparation featuring a 36-day structured study plan, interactive quizzes, practice tests with detailed statistics, and extensive vocabulary, kanji, and grammar resources.

![JLPT N5 Study App](https://img.shields.io/badge/JLPT-N5-green) ![Version](https://img.shields.io/badge/version-3.0.0-blue) ![License](https://img.shields.io/badge/license-MIT-green) ![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)

## 🌟 Features

### 📚 **36-Day Study Plan**
- **Structured Learning**: Daily lessons with vocabulary, kanji, and grammar
- **Progressive Difficulty**: Content builds from basic to intermediate N5 level
- **Cumulative Tracking**: See your total progress across all study days
- **Animated Dashboard**: Visual statistics with smooth counting animations

### 📖 **Comprehensive Vocabulary System**
- **800+ Words**: Mix of N5 and N4 vocabulary for thorough preparation
- **Smart Search**: Real-time search by word number, romaji, kanji, hiragana, or English
- **Auto-numbered List**: Easy navigation through extensive vocabulary
- **Unlimited Scrolling**: Smooth browsing through all vocabulary

### 🔤 **Kanji Learning**
- **205+ Kanji Characters**: Essential N5 kanji with readings and meanings
- **Stroke Order**: Learn proper kanji writing techniques
- **Contextual Learning**: Kanji presented with vocabulary examples

### 📝 **Grammar Database**
- **80+ Grammar Points**: Complete N5 and N4 grammar coverage
- **Category Filtering**: Organize by grammar categories
- **Level Filtering**: Focus on N5 or N4 specific grammar
- **Real-time Search**: Find specific grammar points instantly

### 🧠 **Interactive Quizzes**
- **30 Mixed Questions**: Vocabulary, kanji, and grammar combined
- **Day Selection**: Choose any day to quiz yourself
- **Wrong Answer Review**: Learn from mistakes with detailed explanations
- **Timer Support**: Practice under time pressure

### 📋 **Advanced Practice Tests**
- **5 Complete Tests**: Full-length JLPT N5 practice tests (57 questions each)
- **Reading Comprehension**: Short passages, mid passages, and information retrieval
- **Detailed Statistics**: Comprehensive performance analysis by section and question type
- **Question Type Breakdown**: Track performance across kanji reading, grammar forms, reading passages
- **Visual Progress Indicators**: Color-coded progress bars for each section
- **Comprehensive Review**: Detailed answer explanations with question categorization

### 📊 **Detailed Performance Analytics**
- **Section-wise Performance**: Individual scores for Vocabulary, Grammar, and Reading
- **Question Type Analysis**: Breakdown by specific question types (kanji reading, orthography, contextually defined, etc.)
- **Visual Progress Bars**: Color-coded indicators for each section
- **Overall Performance**: Total score with percentage and time tracking
- **Question-by-Question Review**: See your answer vs correct answer for each question

## 🚀 Quick Start

### Prerequisites
- Python 3.x (for local development server)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/silent9669/JLPT_N5.git
   cd JLPT_N5
   ```

2. **Start the development server**
   ```bash
   python -m http.server 8000
   # or
   python3 -m http.server 8000
   ```

3. **Open your browser**
   ```
   http://localhost:8000
   ```

### GitHub Pages Deployment

1. **Enable GitHub Pages** in your repository settings
2. **Select source**: Deploy from a branch (main/master)
3. **Access your app**: `https://yourusername.github.io/JLPT_N5`

## 📁 Project Structure

```
JLPT_N5/
├── index.html              # Main application file
├── styles.css              # Application styling with detailed statistics
├── app.js                  # Core application logic with enhanced features
├── package.json            # Project configuration
├── LICENSE                 # MIT License
├── README.md              # This file
├── data/
│   ├── daily/             # 36 daily study files
│   │   ├── jlpt_n5_day_01.json
│   │   ├── jlpt_n5_day_02.json
│   │   └── ... (up to day 36)
│   ├── vocabulary/        # Vocabulary databases
│   │   ├── n5_vocabulary.json
│   │   ├── jlpt_n5_vocabulary_database.json
│   │   └── jlpt_n5_kanji_database.json
│   ├── grammar/           # Grammar databases
│   │   └── jlpt_n5_grammar_database.json
│   └── tests/             # Practice test files (5 comprehensive tests)
│       ├── jlpt_n5_test_1.json
│       ├── jlpt_n5_test_2.json
│       ├── jlpt_n5_test_3.json
│       ├── jlpt_n5_test_4.json
│       ├── jlpt_n5_test_5.json
│       └── jlpt_n5_master_practice_tests.json
└── scripts/               # Utility scripts
    ├── chart_script.py
    └── ... (other scripts)
```

## 🎯 How to Use

### Dashboard
- **Study Statistics**: View total vocabulary, kanji, grammar, and study days
- **Animated Counters**: Watch numbers animate to show your progress
- **Support Section**: Star the project and contact information

### Daily Study
1. **Select a Day**: Choose from 1-36 days of content
2. **Study Materials**: Review vocabulary, kanji, and grammar for that day
3. **Cumulative Progress**: See total learned content up to selected day

### Vocabulary
1. **Browse 800+ Words**: Scroll through comprehensive vocabulary list
2. **Real-time Search**: Find words instantly by number, romaji, kanji, or English
3. **Auto-numbered**: Easy navigation with numbered entries

### Grammar
1. **Filter by Level**: N5 or N4 grammar points
2. **Filter by Category**: Organize by grammar categories
3. **Real-time Search**: Find specific grammar points instantly

### Quiz
1. **Select Day**: Choose which day's content to quiz
2. **Answer Questions**: 30 mixed questions from vocabulary, kanji, grammar
3. **Review Mistakes**: Learn from wrong answers with explanations

### Practice Tests
1. **Select Test**: Choose from 5 comprehensive practice tests
2. **Take Test**: Complete 57 questions with timer (60 minutes total)
3. **View Results**: See detailed statistics including:
   - Overall score and percentage
   - Section-wise performance (Vocabulary, Grammar, Reading)
   - Question type breakdown
   - Visual progress indicators
4. **Review Answers**: Detailed review of all questions with explanations

## 🆕 New Features in v3.0

### Enhanced Test System
- **5 Comprehensive Tests**: Each test contains 57 questions (25 vocabulary + 26 grammar + 6 reading)
- **Reading Comprehension**: Full support for short passages, mid passages, and information retrieval
- **Official JLPT Format**: Tests follow the exact structure of real JLPT N5 exams

### Detailed Performance Analytics
- **Section Performance**: Track your progress in Vocabulary, Grammar, and Reading separately
- **Question Type Analysis**: See how you perform on specific question types
- **Visual Progress Bars**: Color-coded indicators for easy performance assessment
- **Comprehensive Statistics**: Detailed breakdown of correct/incorrect answers

### Improved User Experience
- **Real-time Search**: Instant filtering for vocabulary and grammar
- **Enhanced Reading Passages**: Properly formatted reading comprehension sections
- **Mobile Responsive**: Optimized for all device sizes
- **Better Navigation**: Improved test navigation and question flow

## 🛠️ Technical Details

### Technologies Used
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Data Format**: JSON
- **Deployment**: GitHub Pages (static hosting)
- **Development**: Python HTTP server

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Performance
- **Lightweight**: Pure client-side application
- **Fast Loading**: Optimized JSON data structures
- **Responsive**: Mobile-friendly design
- **Offline Capable**: Works without internet after initial load

## 📊 Study Statistics

- **Total Vocabulary**: 800+ words (N5 + N4)
- **Total Kanji**: 205+ characters
- **Total Grammar**: 80+ points
- **Study Days**: 36 days
- **Practice Tests**: 5 comprehensive tests (57 questions each)
- **Quiz Questions**: 30 per quiz
- **Question Types**: 8+ different question types across all sections

## 🎯 Test Structure

Each practice test includes:

### Vocabulary Section (25 questions)
- **Kanji Reading**: Read kanji in context
- **Orthography**: Choose correct kanji for hiragana
- **Contextually Defined**: Choose appropriate words for context
- **Paraphrases**: Find equivalent expressions

### Grammar Section (26 questions)
- **Grammar Form Selection**: Choose correct particles and grammar forms
- **Sentence Composition**: Arrange words in correct order
- **Text Grammar**: Complete conversations and dialogues

### Reading Section (6 questions)
- **Short Passages**: Brief conversations and dialogues
- **Mid Passages**: Longer descriptive texts
- **Information Retrieval**: Charts, schedules, and notices

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Areas for Contribution
- Additional vocabulary words
- More practice tests
- UI/UX improvements
- Bug fixes
- Documentation updates
- Performance optimizations

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

**Phuc Dang**  
Email: [phuc.dangcs2007@hcmut.edu.vn](mailto:phuc.dangcs2007@hcmut.edu.vn)  
GitHub: [@silent9669](https://github.com/silent9669)

## 🙏 Acknowledgments

- JLPT vocabulary data from various open sources
- Japanese language learning community
- Contributors and testers
- Perplexity AI for test content research

## ⭐ Support

If you find this app helpful for your JLPT N5 preparation, please consider:

- ⭐ **Starring the repository**
- 🐛 **Reporting bugs**
- 💡 **Suggesting features**
- 📤 **Sharing with others**

---

**Happy studying! がんばってください！** 🎌