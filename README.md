# JLPT N5 Study App

A comprehensive web application for JLPT N5 preparation featuring a 36-day structured study plan, interactive quizzes, practice tests, and extensive vocabulary, kanji, and grammar resources.

![JLPT N5 Study App](https://img.shields.io/badge/JLPT-N5-green) ![Version](https://img.shields.io/badge/version-2.0.0-blue) ![License](https://img.shields.io/badge/license-MIT-green) ![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)

## 🌟 Features

### 📚 **36-Day Study Plan**
- **Structured Learning**: Daily lessons with vocabulary, kanji, and grammar
- **Progressive Difficulty**: Content builds from basic to intermediate N5 level
- **Cumulative Tracking**: See your total progress across all study days
- **Animated Dashboard**: Visual statistics with smooth counting animations

### 📖 **Comprehensive Vocabulary System**
- **800+ Words**: Mix of N5 and N4 vocabulary for thorough preparation
- **Smart Search**: Search by word number, romaji, kanji, hiragana, or English
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
- **Search Functionality**: Find specific grammar points quickly

### 🧠 **Interactive Quizzes**
- **30 Mixed Questions**: Vocabulary, kanji, and grammar combined
- **Day Selection**: Choose any day to quiz yourself
- **Wrong Answer Review**: Learn from mistakes with detailed explanations
- **Timer Support**: Practice under time pressure

### 📋 **Practice Tests**
- **10 Complete Tests**: Full-length JLPT N5 practice tests
- **Comprehensive Review**: Detailed answer explanations
- **Performance Tracking**: Score, percentage, and time tracking
- **Question Types**: Multiple choice, reading comprehension, and grammar

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
   npm start
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
├── styles.css              # Application styling
├── app.js                  # Core application logic
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
│   └── tests/             # Practice test files
│       ├── jlpt_n5_practice_test_01.json
│       ├── jlpt_n5_practice_test_02.json
│       └── ... (up to test 10)
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
2. **Search Function**: Find words by number, romaji, kanji, or English
3. **Auto-numbered**: Easy navigation with numbered entries

### Grammar
1. **Filter by Level**: N5 or N4 grammar points
2. **Filter by Category**: Organize by grammar categories
3. **Search**: Find specific grammar points quickly

### Quiz
1. **Select Day**: Choose which day's content to quiz
2. **Answer Questions**: 30 mixed questions from vocabulary, kanji, grammar
3. **Review Mistakes**: Learn from wrong answers with explanations

### Practice Tests
1. **Select Test**: Choose from 10 available practice tests
2. **Take Test**: Complete all questions with timer
3. **View Results**: See score, percentage, and time
4. **Review Answers**: Detailed review of all questions and answers

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
- **Practice Tests**: 10 complete tests
- **Quiz Questions**: 30 per quiz

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

## ⭐ Support

If you find this app helpful for your JLPT N5 preparation, please consider:

- ⭐ **Starring the repository**
- 🐛 **Reporting bugs**
- 💡 **Suggesting features**
- 📤 **Sharing with others**

---

**Happy studying! がんばってください！** 🎌