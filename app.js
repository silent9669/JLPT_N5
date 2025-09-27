// JLPT N5 Study App - Main JavaScript
class JLPTApp {
    constructor() {
        this.currentDay = 1;
        this.currentSection = 'dashboard';
        this.currentTab = 'vocabulary';
        this.quizData = null;
        this.currentQuestion = 0;
        this.quizAnswers = [];
        this.quizStartTime = null;
        this.quizTimer = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadDayData(this.currentDay);
        this.updateProgress();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.dataset.section;
                this.showSection(section);
            });
        });

        // Day selector
        document.getElementById('daySelect').addEventListener('change', (e) => {
            this.currentDay = parseInt(e.target.value);
            this.loadDayData(this.currentDay);
        });

        // Study tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.showTab(tab);
            });
        });

        // Quiz controls
        document.getElementById('startQuizBtn').addEventListener('click', () => {
            this.startQuiz();
        });

        document.getElementById('retakeQuizBtn').addEventListener('click', () => {
            this.retakeQuiz();
        });

        document.getElementById('reviewAnswersBtn').addEventListener('click', () => {
            this.reviewAnswers();
        });

        // Quick actions
        window.startDailyStudy = () => this.showSection('daily');
        window.takeQuiz = () => this.showSection('quiz');
        window.viewProgress = () => this.showSection('progress');
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Show selected section
        document.getElementById(sectionName).classList.add('active');

        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        this.currentSection = sectionName;

        // Load section-specific data
        if (sectionName === 'daily') {
            this.loadDayData(this.currentDay);
        } else if (sectionName === 'progress') {
            this.updateProgress();
        }
    }

    showTab(tabName) {
        // Hide all tabs
        document.querySelectorAll('.tab-panel').forEach(tab => {
            tab.classList.remove('active');
        });

        // Show selected tab
        document.getElementById(tabName).classList.add('active');

        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        this.currentTab = tabName;
    }

    async loadDayData(day) {
        try {
            const response = await fetch(`jlpt_n5_day_${day.toString().padStart(2, '0')}.json`);
            const data = await response.json();
            
            this.currentDayData = data;
            this.renderVocabulary(data.vocabulary);
            this.renderKanji(data.kanji);
            this.renderGrammar(data.grammar);
        } catch (error) {
            console.error('Error loading day data:', error);
            this.showError('Failed to load study data for day ' + day);
        }
    }

    renderVocabulary(vocabulary) {
        const container = document.getElementById('vocabularyList');
        const countElement = document.getElementById('vocabCount');
        const categoryElement = document.getElementById('vocabCategory');

        if (!vocabulary || !vocabulary.new_words) {
            container.innerHTML = '<p>No vocabulary data available for this day.</p>';
            return;
        }

        countElement.textContent = vocabulary.total_learned || vocabulary.new_words.length;
        categoryElement.textContent = vocabulary.category_focus || 'Mixed';

        container.innerHTML = vocabulary.new_words.map(word => `
            <div class="word-card">
                <div class="word-kanji">${word.kanji}</div>
                <div class="word-hiragana">${word.hiragana}</div>
                <div class="word-romaji">${word.romaji}</div>
                <div class="word-english">${word.english}</div>
                <div class="word-category">${word.category}</div>
            </div>
        `).join('');
    }

    renderKanji(kanji) {
        const container = document.getElementById('kanjiList');
        const countElement = document.getElementById('kanjiCount');

        if (!kanji || !kanji.new_kanji) {
            container.innerHTML = '<p>No kanji data available for this day.</p>';
            return;
        }

        countElement.textContent = kanji.total_learned || kanji.new_kanji.length;

        container.innerHTML = kanji.new_kanji.map(char => `
            <div class="kanji-card">
                <div class="kanji-strokes">${char.strokes} strokes</div>
                <div class="kanji-character">${char.kanji}</div>
                <div class="kanji-meaning">${char.meaning}</div>
                <div class="kanji-readings">
                    <div class="kanji-reading"><strong>On'yomi:</strong> ${char.onyomi}</div>
                    <div class="kanji-reading"><strong>Kun'yomi:</strong> ${char.kunyomi}</div>
                </div>
                <div class="kanji-vocabulary">
                    ${char.vocabulary.map(vocab => `<span class="kanji-vocab-item">${vocab}</span>`).join('')}
                </div>
            </div>
        `).join('');
    }

    renderGrammar(grammar) {
        const container = document.getElementById('grammarList');
        const countElement = document.getElementById('grammarCount');
        const categoryElement = document.getElementById('grammarCategory');

        if (!grammar || !grammar.new_points) {
            container.innerHTML = '<p>No grammar data available for this day.</p>';
            return;
        }

        countElement.textContent = grammar.total_learned || grammar.new_points.length;
        categoryElement.textContent = grammar.focus_category || 'Mixed';

        container.innerHTML = grammar.new_points.map(point => `
            <div class="grammar-card">
                <div class="grammar-point">${point.grammar}</div>
                <div class="grammar-meaning">${point.meaning}</div>
                <div class="grammar-formation">${point.formation}</div>
                <div class="grammar-example">
                    <div class="grammar-example-jp">${point.example_jp}</div>
                    <div class="grammar-example-en">${point.example_en}</div>
                </div>
                <div class="grammar-category">${point.category}</div>
            </div>
        `).join('');
    }

    async startQuiz() {
        const quizType = document.getElementById('quizType').value;
        const questionCount = parseInt(document.getElementById('questionCount').value);
        const quizDay = parseInt(document.getElementById('quizDay').value);

        try {
            this.quizData = await this.generateQuiz(quizType, questionCount, quizDay);
            this.currentQuestion = 0;
            this.quizAnswers = [];
            this.quizStartTime = new Date();
            
            this.showQuizArea();
            this.startQuizTimer();
            this.renderQuestion();
        } catch (error) {
            console.error('Error starting quiz:', error);
            this.showError('Failed to start quiz');
        }
    }

    async generateQuiz(type, count, day) {
        let questions = [];

        if (type === 'daily') {
            const dayData = await this.loadDayDataForQuiz(day);
            questions = this.generateDailyQuiz(dayData, count);
        } else if (type === 'vocabulary') {
            const vocabData = await this.loadVocabularyDatabase();
            questions = this.generateVocabularyQuiz(vocabData, count);
        } else if (type === 'kanji') {
            const kanjiData = await this.loadKanjiDatabase();
            questions = this.generateKanjiQuiz(kanjiData, count);
        } else if (type === 'grammar') {
            const grammarData = await this.loadGrammarDatabase();
            questions = this.generateGrammarQuiz(grammarData, count);
        } else if (type === 'mixed') {
            questions = await this.generateMixedQuiz(count);
        }

        return questions;
    }

    async loadDayDataForQuiz(day) {
        const response = await fetch(`jlpt_n5_day_${day.toString().padStart(2, '0')}.json`);
        return await response.json();
    }

    async loadVocabularyDatabase() {
        const response = await fetch('jlpt_n5_vocabulary_database.json');
        return await response.json();
    }

    async loadKanjiDatabase() {
        const response = await fetch('jlpt_n5_kanji_database.json');
        return await response.json();
    }

    async loadGrammarDatabase() {
        const response = await fetch('jlpt_n5_grammar_database.json');
        return await response.json();
    }

    generateDailyQuiz(dayData, count) {
        const questions = [];
        const { vocabulary, kanji, grammar } = dayData;

        // Vocabulary questions
        if (vocabulary && vocabulary.new_words) {
            vocabulary.new_words.forEach(word => {
                questions.push({
                    type: 'vocabulary',
                    question: `What does "${word.kanji}" (${word.hiragana}) mean?`,
                    correct: word.english,
                    options: this.generateVocabularyOptions(word.english, vocabulary.new_words)
                });
            });
        }

        // Kanji questions
        if (kanji && kanji.new_kanji) {
            kanji.new_kanji.forEach(char => {
                questions.push({
                    type: 'kanji',
                    question: `What is the meaning of this kanji: ${char.kanji}?`,
                    correct: char.meaning,
                    options: this.generateKanjiOptions(char.meaning, kanji.new_kanji)
                });
            });
        }

        // Grammar questions
        if (grammar && grammar.new_points) {
            grammar.new_points.forEach(point => {
                questions.push({
                    type: 'grammar',
                    question: `What does "${point.grammar}" mean?`,
                    correct: point.meaning,
                    options: this.generateGrammarOptions(point.meaning, grammar.new_points)
                });
            });
        }

        return this.shuffleArray(questions).slice(0, count);
    }

    generateVocabularyOptions(correct, words) {
        const options = [correct];
        const otherWords = words.filter(w => w.english !== correct);
        
        while (options.length < 4 && otherWords.length > 0) {
            const randomWord = otherWords[Math.floor(Math.random() * otherWords.length)];
            if (!options.includes(randomWord.english)) {
                options.push(randomWord.english);
            }
        }
        
        return this.shuffleArray(options);
    }

    generateKanjiOptions(correct, kanji) {
        const options = [correct];
        const otherKanji = kanji.filter(k => k.meaning !== correct);
        
        while (options.length < 4 && otherKanji.length > 0) {
            const randomKanji = otherKanji[Math.floor(Math.random() * otherKanji.length)];
            if (!options.includes(randomKanji.meaning)) {
                options.push(randomKanji.meaning);
            }
        }
        
        return this.shuffleArray(options);
    }

    generateGrammarOptions(correct, grammar) {
        const options = [correct];
        const otherGrammar = grammar.filter(g => g.meaning !== correct);
        
        while (options.length < 4 && otherGrammar.length > 0) {
            const randomGrammar = otherGrammar[Math.floor(Math.random() * otherGrammar.length)];
            if (!options.includes(randomGrammar.meaning)) {
                options.push(randomGrammar.meaning);
            }
        }
        
        return this.shuffleArray(options);
    }

    generateVocabularyQuiz(vocabData, count) {
        const questions = [];
        const words = vocabData.vocabulary || [];
        
        for (let i = 0; i < Math.min(count, words.length); i++) {
            const word = words[i];
            questions.push({
                type: 'vocabulary',
                question: `What does "${word.kanji}" (${word.hiragana}) mean?`,
                correct: word.english,
                options: this.generateVocabularyOptions(word.english, words)
            });
        }
        
        return this.shuffleArray(questions);
    }

    generateKanjiQuiz(kanjiData, count) {
        const questions = [];
        const kanji = kanjiData.kanji || [];
        
        for (let i = 0; i < Math.min(count, kanji.length); i++) {
            const char = kanji[i];
            questions.push({
                type: 'kanji',
                question: `What is the meaning of this kanji: ${char.kanji}?`,
                correct: char.meaning,
                options: this.generateKanjiOptions(char.meaning, kanji)
            });
        }
        
        return this.shuffleArray(questions);
    }

    generateGrammarQuiz(grammarData, count) {
        const questions = [];
        const grammar = grammarData.grammar_points || [];
        
        for (let i = 0; i < Math.min(count, grammar.length); i++) {
            const point = grammar[i];
            questions.push({
                type: 'grammar',
                question: `What does "${point.grammar}" mean?`,
                correct: point.meaning,
                options: this.generateGrammarOptions(point.meaning, grammar)
            });
        }
        
        return this.shuffleArray(questions);
    }

    async generateMixedQuiz(count) {
        const [vocabData, kanjiData, grammarData] = await Promise.all([
            this.loadVocabularyDatabase(),
            this.loadKanjiDatabase(),
            this.loadGrammarDatabase()
        ]);

        const questions = [];
        const vocabCount = Math.ceil(count * 0.4);
        const kanjiCount = Math.ceil(count * 0.3);
        const grammarCount = count - vocabCount - kanjiCount;

        questions.push(...this.generateVocabularyQuiz(vocabData, vocabCount));
        questions.push(...this.generateKanjiQuiz(kanjiData, kanjiCount));
        questions.push(...this.generateGrammarQuiz(grammarData, grammarCount));

        return this.shuffleArray(questions).slice(0, count);
    }

    showQuizArea() {
        document.getElementById('quizSettings').classList.add('hidden');
        document.getElementById('quizArea').classList.remove('hidden');
        document.getElementById('quizResults').classList.add('hidden');
    }

    startQuizTimer() {
        this.quizTimer = setInterval(() => {
            const now = new Date();
            const elapsed = Math.floor((now - this.quizStartTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            document.getElementById('quizTimer').textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    renderQuestion() {
        if (!this.quizData || this.currentQuestion >= this.quizData.length) {
            this.finishQuiz();
            return;
        }

        const question = this.quizData[this.currentQuestion];
        const progress = ((this.currentQuestion + 1) / this.quizData.length) * 100;

        document.getElementById('quizProgress').textContent = 
            `Question ${this.currentQuestion + 1} of ${this.quizData.length}`;
        document.getElementById('progressFill').style.width = `${progress}%`;

        document.getElementById('questionContent').innerHTML = `
            <div class="question-type">${question.type.toUpperCase()}</div>
            <div class="question-text">${question.question}</div>
        `;

        const optionsContainer = document.getElementById('answerOptions');
        optionsContainer.innerHTML = question.options.map((option, index) => `
            <div class="answer-option" data-answer="${option}">
                ${String.fromCharCode(65 + index)}. ${option}
            </div>
        `).join('');

        // Add click listeners to options
        optionsContainer.querySelectorAll('.answer-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.selectAnswer(e.target.dataset.answer);
            });
        });

        // Update navigation buttons
        document.getElementById('prevQuestionBtn').disabled = this.currentQuestion === 0;
        document.getElementById('nextQuestionBtn').style.display = 
            this.currentQuestion === this.quizData.length - 1 ? 'none' : 'inline-block';
        document.getElementById('submitQuizBtn').style.display = 
            this.currentQuestion === this.quizData.length - 1 ? 'inline-block' : 'none';
    }

    selectAnswer(answer) {
        // Remove previous selection
        document.querySelectorAll('.answer-option').forEach(option => {
            option.classList.remove('selected');
        });

        // Add selection to clicked option
        document.querySelector(`[data-answer="${answer}"]`).classList.add('selected');

        // Store answer
        this.quizAnswers[this.currentQuestion] = answer;
    }

    nextQuestion() {
        if (this.currentQuestion < this.quizData.length - 1) {
            this.currentQuestion++;
            this.renderQuestion();
        }
    }

    prevQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.renderQuestion();
        }
    }

    finishQuiz() {
        clearInterval(this.quizTimer);
        
        const correctAnswers = this.quizData.filter((question, index) => 
            this.quizAnswers[index] === question.correct
        ).length;

        const percentage = Math.round((correctAnswers / this.quizData.length) * 100);
        const timeElapsed = Math.floor((new Date() - this.quizStartTime) / 1000);
        const minutes = Math.floor(timeElapsed / 60);
        const seconds = timeElapsed % 60;

        document.getElementById('quizScore').textContent = `${correctAnswers}/${this.quizData.length}`;
        document.getElementById('quizPercentage').textContent = `${percentage}%`;
        document.getElementById('quizTime').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        document.getElementById('quizArea').classList.add('hidden');
        document.getElementById('quizResults').classList.remove('hidden');
    }

    retakeQuiz() {
        document.getElementById('quizResults').classList.add('hidden');
        document.getElementById('quizSettings').classList.remove('hidden');
    }

    reviewAnswers() {
        // Implementation for reviewing answers
        console.log('Review answers functionality to be implemented');
    }

    updateProgress() {
        // Update progress circles
        this.updateProgressCircle('vocabProgressCircle', 'vocabProgressNumber', 0, 591);
        this.updateProgressCircle('kanjiProgressCircle', 'kanjiProgressNumber', 0, 205);
        this.updateProgressCircle('grammarProgressCircle', 'grammarProgressNumber', 0, 80);
    }

    updateProgressCircle(circleId, numberId, current, total) {
        const percentage = (current / total) * 100;
        const circumference = 2 * Math.PI * 45; // radius = 45
        const offset = circumference - (percentage / 100) * circumference;

        document.getElementById(circleId).style.strokeDashoffset = offset;
        document.getElementById(numberId).textContent = current;
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    showError(message) {
        alert(message); // Simple error handling
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.jlptApp = new JLPTApp();
});

// Add event listeners for quiz navigation
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('nextQuestionBtn').addEventListener('click', () => {
        window.jlptApp.nextQuestion();
    });

    document.getElementById('prevQuestionBtn').addEventListener('click', () => {
        window.jlptApp.prevQuestion();
    });

    document.getElementById('submitQuizBtn').addEventListener('click', () => {
        window.jlptApp.finishQuiz();
    });
});
