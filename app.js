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
        this.wrongAnswers = [];
        this.apiBaseUrl = 'https://jlpt-vocab-api.vercel.app/api';
        this.vocabData = [];
        this.filteredVocabData = [];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadDayData(this.currentDay);
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
            this.showReview();
        });

        document.getElementById('backToResultsBtn').addEventListener('click', () => {
            this.hideReview();
        });

        // Quiz navigation
        document.getElementById('nextQuestionBtn').addEventListener('click', () => {
            this.nextQuestion();
        });

        document.getElementById('prevQuestionBtn').addEventListener('click', () => {
            this.prevQuestion();
        });

        document.getElementById('submitQuizBtn').addEventListener('click', () => {
            this.finishQuiz();
        });

        // Vocabulary database controls
        document.getElementById('loadAllVocabBtn').addEventListener('click', () => {
            this.loadVocabularyFromAPI();
        });

        document.getElementById('searchBtn').addEventListener('click', () => {
            this.searchVocabulary();
        });

        document.getElementById('vocabSearch').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchVocabulary();
            }
        });

        document.getElementById('levelFilter').addEventListener('change', () => {
            this.filterVocabulary();
        });

        document.getElementById('sortBy').addEventListener('change', () => {
            this.sortVocabulary();
        });

        // Quick actions
        window.startDailyStudy = () => this.showSection('daily');
        window.takeQuiz = () => this.showSection('quiz');
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
        } else if (sectionName === 'vocabulary' && this.vocabData.length === 0) {
            // Auto-load N5 vocabulary when first visiting the section
            this.loadVocabularyFromAPI();
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

        if (!vocabulary || !vocabulary.new_words) {
            container.innerHTML = '<p>No vocabulary data available for this day.</p>';
            return;
        }

        countElement.textContent = vocabulary.total_learned || vocabulary.new_words.length;

        container.innerHTML = vocabulary.new_words.map(word => `
            <div class="word-card">
                <div class="word-kanji">${word.kanji}</div>
                <div class="word-hiragana">${word.hiragana}</div>
                <div class="word-romaji">${word.romaji}</div>
                <div class="word-english">${word.english}</div>
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

        if (!grammar || !grammar.new_points) {
            container.innerHTML = '<p>No grammar data available for this day.</p>';
            return;
        }

        countElement.textContent = grammar.total_learned || grammar.new_points.length;

        container.innerHTML = grammar.new_points.map(point => `
            <div class="grammar-card">
                <div class="grammar-point">${point.grammar}</div>
                <div class="grammar-meaning">${point.meaning}</div>
                <div class="grammar-formation">${point.formation}</div>
                <div class="grammar-example">
                    <div class="grammar-example-jp">${point.example_jp}</div>
                    <div class="grammar-example-en">${point.example_en}</div>
                </div>
            </div>
        `).join('');
    }

    async startQuiz() {
        const quizDay = parseInt(document.getElementById('quizDay').value);

        try {
            this.quizData = await this.generateMixedQuiz(quizDay);
            this.currentQuestion = 0;
            this.quizAnswers = [];
            this.wrongAnswers = [];
            this.quizStartTime = new Date();
            
            this.showQuizArea();
            this.startQuizTimer();
            this.renderQuestion();
        } catch (error) {
            console.error('Error starting quiz:', error);
            this.showError('Failed to start quiz');
        }
    }

    async generateMixedQuiz(day) {
        try {
            // Load day data
            const dayData = await this.loadDayDataForQuiz(day);
            const questions = [];

            // Generate vocabulary questions (10 questions)
            if (dayData.vocabulary && dayData.vocabulary.new_words) {
                const vocabQuestions = this.generateVocabularyQuestions(dayData.vocabulary.new_words, 10);
                questions.push(...vocabQuestions);
            }

            // Generate kanji questions (10 questions)
            if (dayData.kanji && dayData.kanji.new_kanji) {
                const kanjiQuestions = this.generateKanjiQuestions(dayData.kanji.new_kanji, 10);
                questions.push(...kanjiQuestions);
            }

            // Generate grammar questions (10 questions)
            if (dayData.grammar && dayData.grammar.new_points) {
                const grammarQuestions = this.generateGrammarQuestions(dayData.grammar.new_points, 10);
                questions.push(...grammarQuestions);
            }

            return this.shuffleArray(questions);
        } catch (error) {
            console.error('Error generating quiz:', error);
            throw error;
        }
    }

    generateVocabularyQuestions(words, count) {
        const questions = [];
        const selectedWords = this.shuffleArray(words).slice(0, Math.min(count, words.length));

        selectedWords.forEach(word => {
            const otherWords = words.filter(w => w.english !== word.english);
            const options = this.generateOptions(word.english, otherWords.map(w => w.english));
            
            questions.push({
                type: 'vocabulary',
                question: `What does "${word.kanji}" (${word.hiragana}) mean?`,
                correct: word.english,
                options: options,
                data: word
            });
        });

        return questions;
    }

    generateKanjiQuestions(kanji, count) {
        const questions = [];
        const selectedKanji = this.shuffleArray(kanji).slice(0, Math.min(count, kanji.length));

        selectedKanji.forEach(char => {
            const otherKanji = kanji.filter(k => k.meaning !== char.meaning);
            const options = this.generateOptions(char.meaning, otherKanji.map(k => k.meaning));
            
            questions.push({
                type: 'kanji',
                question: `What is the meaning of this kanji: ${char.kanji}?`,
                correct: char.meaning,
                options: options,
                data: char
            });
        });

        return questions;
    }

    generateGrammarQuestions(grammar, count) {
        const questions = [];
        const selectedGrammar = this.shuffleArray(grammar).slice(0, Math.min(count, grammar.length));

        selectedGrammar.forEach(point => {
            const otherGrammar = grammar.filter(g => g.meaning !== point.meaning);
            const options = this.generateOptions(point.meaning, otherGrammar.map(g => g.meaning));
            
            questions.push({
                type: 'grammar',
                question: `What does "${point.grammar}" mean?`,
                correct: point.meaning,
                options: options,
                data: point
            });
        });

        return questions;
    }

    generateOptions(correct, otherOptions) {
        const options = [correct];
        const shuffledOthers = this.shuffleArray(otherOptions);
        
        for (let i = 0; i < Math.min(3, shuffledOthers.length); i++) {
            if (!options.includes(shuffledOthers[i])) {
                options.push(shuffledOthers[i]);
            }
        }
        
        return this.shuffleArray(options);
    }

    async loadDayDataForQuiz(day) {
        const response = await fetch(`jlpt_n5_day_${day.toString().padStart(2, '0')}.json`);
        return await response.json();
    }

    showQuizArea() {
        document.getElementById('quizSettings').classList.add('hidden');
        document.getElementById('quizArea').classList.remove('hidden');
        document.getElementById('quizResults').classList.add('hidden');
        document.getElementById('reviewArea').classList.add('hidden');
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
        
        // Calculate results
        const correctAnswers = this.quizData.filter((question, index) => 
            this.quizAnswers[index] === question.correct
        ).length;

        // Store wrong answers for review
        this.wrongAnswers = this.quizData.filter((question, index) => 
            this.quizAnswers[index] !== question.correct
        ).map((question, originalIndex) => {
            const actualIndex = this.quizData.indexOf(question);
            return {
                ...question,
                userAnswer: this.quizAnswers[actualIndex],
                questionIndex: actualIndex
            };
        });

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

    showReview() {
        if (this.wrongAnswers.length === 0) {
            alert('No wrong answers to review!');
            return;
        }

        document.getElementById('quizResults').classList.add('hidden');
        document.getElementById('reviewArea').classList.remove('hidden');
        this.renderReview();
    }

    hideReview() {
        document.getElementById('reviewArea').classList.add('hidden');
        document.getElementById('quizResults').classList.remove('hidden');
    }

    renderReview() {
        const container = document.getElementById('reviewContent');
        
        container.innerHTML = this.wrongAnswers.map((item, index) => `
            <div class="review-item">
                <div class="review-question">
                    ${index + 1}. ${item.question}
                </div>
                <div class="review-answers">
                    <div class="review-answer correct">
                        ✓ Correct: ${item.correct}
                    </div>
                    <div class="review-answer user-answer">
                        Your answer: ${item.userAnswer || 'No answer'}
                    </div>
                </div>
            </div>
        `).join('');
    }

    retakeQuiz() {
        document.getElementById('quizResults').classList.add('hidden');
        document.getElementById('quizSettings').classList.remove('hidden');
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Vocabulary API Integration
    async loadVocabularyFromAPI() {
        try {
            document.getElementById('vocabularyDatabase').innerHTML = 
                '<div class="loading-message">Loading vocabulary from API...</div>';
            
            const response = await fetch(`${this.apiBaseUrl}/vocab?level=N5`);
            const data = await response.json();
            
            this.vocabData = data.data || data;
            this.filteredVocabData = [...this.vocabData];
            
            this.updateVocabStats();
            this.renderVocabularyDatabase();
        } catch (error) {
            console.error('Error loading vocabulary from API:', error);
            document.getElementById('vocabularyDatabase').innerHTML = 
                '<div class="loading-message">Error loading vocabulary. Please try again later.</div>';
        }
    }

    searchVocabulary() {
        const searchTerm = document.getElementById('vocabSearch').value.toLowerCase();
        
        if (!searchTerm) {
            this.filteredVocabData = [...this.vocabData];
        } else {
            this.filteredVocabData = this.vocabData.filter(word => 
                word.kanji.toLowerCase().includes(searchTerm) ||
                word.hiragana.toLowerCase().includes(searchTerm) ||
                word.romaji.toLowerCase().includes(searchTerm) ||
                word.english.toLowerCase().includes(searchTerm)
            );
        }
        
        this.updateVocabStats();
        this.renderVocabularyDatabase();
    }

    filterVocabulary() {
        const level = document.getElementById('levelFilter').value;
        
        if (!level) {
            this.filteredVocabData = [...this.vocabData];
        } else {
            this.filteredVocabData = this.vocabData.filter(word => 
                word.level === level
            );
        }
        
        this.updateVocabStats();
        this.renderVocabularyDatabase();
    }

    sortVocabulary() {
        const sortBy = document.getElementById('sortBy').value;
        
        this.filteredVocabData.sort((a, b) => {
            switch (sortBy) {
                case 'kanji':
                    return a.kanji.localeCompare(b.kanji);
                case 'hiragana':
                    return a.hiragana.localeCompare(b.hiragana);
                case 'english':
                    return a.english.localeCompare(b.english);
                case 'level':
                    return a.level.localeCompare(b.level);
                default:
                    return 0;
            }
        });
        
        this.renderVocabularyDatabase();
    }

    updateVocabStats() {
        document.getElementById('totalVocabCount').textContent = this.vocabData.length;
        document.getElementById('filteredVocabCount').textContent = this.filteredVocabData.length;
    }

    renderVocabularyDatabase() {
        const container = document.getElementById('vocabularyDatabase');
        
        if (this.filteredVocabData.length === 0) {
            container.innerHTML = '<div class="loading-message">No vocabulary found matching your criteria.</div>';
            return;
        }
        
        container.innerHTML = `
            <div class="vocab-grid">
                ${this.filteredVocabData.map(word => `
                    <div class="vocab-item">
                        <div class="vocab-kanji">${word.kanji || '-'}</div>
                        <div class="vocab-hiragana">${word.hiragana || '-'}</div>
                        <div class="vocab-romaji">${word.romaji || '-'}</div>
                        <div class="vocab-english">${word.english || '-'}</div>
                        <div class="vocab-level">${word.level || 'N5'}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    showError(message) {
        alert(message); // Simple error handling
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.jlptApp = new JLPTApp();
});