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
        this.vocabData = [];
        this.filteredVocabData = [];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadDayData(this.currentDay);
    }

    setupEventListeners() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.attachEventListeners();
            });
        } else {
            this.attachEventListeners();
        }
    }

    attachEventListeners() {
        // Navigation
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.dataset.section;
                this.showSection(section);
            });
        });

        // Day selector
        const daySelect = document.getElementById('daySelect');
        if (daySelect) {
            daySelect.addEventListener('change', (e) => {
                this.currentDay = parseInt(e.target.value);
                this.loadDayData(this.currentDay);
            });
        }

        // Study tabs
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.showTab(tab);
            });
        });

        // Quiz controls
        const startQuizBtn = document.getElementById('startQuizBtn');
        if (startQuizBtn) {
            startQuizBtn.addEventListener('click', () => {
                this.startQuiz();
            });
        }

        const retakeQuizBtn = document.getElementById('retakeQuizBtn');
        if (retakeQuizBtn) {
            retakeQuizBtn.addEventListener('click', () => {
                this.retakeQuiz();
            });
        }

        const reviewAnswersBtn = document.getElementById('reviewAnswersBtn');
        if (reviewAnswersBtn) {
            reviewAnswersBtn.addEventListener('click', () => {
                this.showReview();
            });
        }

        const backToResultsBtn = document.getElementById('backToResultsBtn');
        if (backToResultsBtn) {
            backToResultsBtn.addEventListener('click', () => {
                this.hideReview();
            });
        }

        // Quiz navigation
        const nextQuestionBtn = document.getElementById('nextQuestionBtn');
        if (nextQuestionBtn) {
            nextQuestionBtn.addEventListener('click', () => {
                this.nextQuestion();
            });
        }

        const prevQuestionBtn = document.getElementById('prevQuestionBtn');
        if (prevQuestionBtn) {
            prevQuestionBtn.addEventListener('click', () => {
                this.prevQuestion();
            });
        }

        const submitQuizBtn = document.getElementById('submitQuizBtn');
        if (submitQuizBtn) {
            submitQuizBtn.addEventListener('click', () => {
                this.finishQuiz();
            });
        }

        // Vocabulary controls
        const loadAllVocabBtn = document.getElementById('loadAllVocabBtn');
        if (loadAllVocabBtn) {
            loadAllVocabBtn.addEventListener('click', () => {
                this.loadVocabularyFromAPI();
            });
        }

        const searchBtn = document.getElementById('searchBtn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.searchVocabulary();
            });
        }

        const vocabSearch = document.getElementById('vocabSearch');
        if (vocabSearch) {
            vocabSearch.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchVocabulary();
                }
            });
        }
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Show selected section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeBtn = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        this.currentSection = sectionName;

        // Load section-specific data
        if (sectionName === 'daily') {
            this.loadDayData(this.currentDay);
        } else if (sectionName === 'vocabulary') {
            // Always load vocabulary when visiting the section
            console.log('Vocabulary section accessed, vocabData length:', this.vocabData.length);
            if (this.vocabData.length === 0) {
                console.log('Loading vocabulary from API...');
                this.loadVocabularyFromAPI();
            } else {
                console.log('Vocabulary already loaded, rendering table...');
                // If already loaded, just render it
                this.renderVocabularyTable();
            }
        }
    }

    showTab(tabName) {
        // Hide all tabs
        document.querySelectorAll('.tab-panel').forEach(tab => {
            tab.classList.remove('active');
        });

        // Show selected tab
        const targetTab = document.getElementById(tabName);
        if (targetTab) {
            targetTab.classList.add('active');
        }

        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeTabBtn = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeTabBtn) {
            activeTabBtn.classList.add('active');
        }

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

        if (!container) return;

        if (!vocabulary || !vocabulary.new_words) {
            container.innerHTML = '<p>No vocabulary data available for this day.</p>';
            return;
        }

        if (countElement) {
            countElement.textContent = vocabulary.total_learned || vocabulary.new_words.length;
        }

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

        if (!container) return;

        if (!kanji || !kanji.new_kanji) {
            container.innerHTML = '<p>No kanji data available for this day.</p>';
            return;
        }

        if (countElement) {
            countElement.textContent = kanji.total_learned || kanji.new_kanji.length;
        }

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

        if (!container) return;

        if (!grammar || !grammar.new_points) {
            container.innerHTML = '<p>No grammar data available for this day.</p>';
            return;
        }

        if (countElement) {
            countElement.textContent = grammar.total_learned || grammar.new_points.length;
        }

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

    // N5 Vocabulary List Integration
    async loadVocabularyFromAPI() {
        try {
            const container = document.getElementById('vocabularyDatabase');
            if (!container) {
                console.error('Vocabulary container not found');
                return;
            }

            container.innerHTML = '<div class="loading-message">Loading N5 vocabulary list...</div>';
            
            // Load from local JSON file for faster loading
            const response = await fetch('n5_vocabulary.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Loaded vocabulary data:', data);
            
            this.vocabData = data.vocabulary || [];
            this.filteredVocabData = [...this.vocabData];
            
            console.log('Processed vocabulary data:', this.vocabData.length, 'words');
            
            this.updateVocabStats();
            console.log('About to call renderVocabularyTable');
            this.renderVocabularyTable();
            console.log('renderVocabularyTable call completed');
        } catch (error) {
            console.error('Error loading vocabulary:', error);
            const container = document.getElementById('vocabularyDatabase');
            if (container) {
                container.innerHTML = `
                    <div class="loading-message">
                        <p>Unable to load vocabulary data. Please try again.</p>
                        <button class="btn primary" onclick="window.jlptApp.loadVocabularyFromAPI()">Retry</button>
                    </div>
                `;
            }
        }
    }

    searchVocabulary() {
        const searchInput = document.getElementById('vocabSearch');
        if (!searchInput) return;

        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (!searchTerm) {
            this.filteredVocabData = [...this.vocabData];
        } else {
            this.filteredVocabData = this.vocabData.filter(word => {
                // Search by word number
                if (word.number && word.number.toString().includes(searchTerm)) {
                    return true;
                }
                // Search by romaji
                if (word.romaji && word.romaji.toLowerCase().includes(searchTerm)) {
                    return true;
                }
                // Search by other fields as well
                if (word.kanji && word.kanji.toLowerCase().includes(searchTerm)) {
                    return true;
                }
                if (word.hiragana && word.hiragana.toLowerCase().includes(searchTerm)) {
                    return true;
                }
                if (word.english && word.english.toLowerCase().includes(searchTerm)) {
                    return true;
                }
                return false;
            });
        }
        
        this.updateVocabStats();
        this.renderVocabularyTable();
    }

    updateVocabStats() {
        const totalCount = document.getElementById('totalVocabCount');
        const filteredCount = document.getElementById('filteredVocabCount');
        
        if (totalCount) {
            totalCount.textContent = this.vocabData.length;
        }
        if (filteredCount) {
            filteredCount.textContent = this.filteredVocabData.length;
        }
    }

    renderVocabularyTable() {
        console.log('renderVocabularyTable called');
        const container = document.getElementById('vocabularyDatabase');
        console.log('Container found:', container);
        
        if (!container) {
            console.error('Vocabulary container not found!');
            return;
        }
        
        console.log('Filtered vocab data length:', this.filteredVocabData.length);
        console.log('First few words:', this.filteredVocabData.slice(0, 3));
        
        if (this.filteredVocabData.length === 0) {
            container.innerHTML = '<div class="loading-message">No vocabulary found matching your search criteria.</div>';
            return;
        }
        
        // First try a simple test table
        const testHTML = `
            <div style="background: yellow; padding: 10px; margin: 10px;">
                <h3>Test: Vocabulary Table</h3>
                <p>Data loaded: ${this.filteredVocabData.length} words</p>
                <p>First word: ${this.filteredVocabData[0] ? this.filteredVocabData[0].kanji : 'None'}</p>
            </div>
        `;
        
        const tableHTML = `
            <table class="vocab-table" style="width: 100%; border-collapse: collapse; background: white;">
                <thead>
                    <tr style="background: #4CAF50; color: white;">
                        <th style="padding: 10px; border: 1px solid #ddd;">#</th>
                        <th style="padding: 10px; border: 1px solid #ddd;">Kanji</th>
                        <th style="padding: 10px; border: 1px solid #ddd;">Hiragana</th>
                        <th style="padding: 10px; border: 1px solid #ddd;">Romaji</th>
                        <th style="padding: 10px; border: 1px solid #ddd;">English</th>
                        <th style="padding: 10px; border: 1px solid #ddd;">Level</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.filteredVocabData.slice(0, 10).map(word => `
                        <tr style="border-bottom: 1px solid #ddd;">
                            <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${word.number}</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${word.kanji || '-'}</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${word.hiragana || '-'}</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${word.romaji || '-'}</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${word.english || '-'}</td>
                            <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${word.level || 'N5'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        const finalHTML = testHTML + tableHTML;
        
        console.log('Setting innerHTML with table');
        container.innerHTML = finalHTML;
        console.log('Table rendered successfully');
        console.log('Container innerHTML length:', container.innerHTML.length);
        console.log('Container children count:', container.children.length);
        
        // Test if table is visible
        const table = container.querySelector('.vocab-table');
        if (table) {
            console.log('Table found in DOM');
            console.log('Table display style:', window.getComputedStyle(table).display);
            console.log('Table visibility:', window.getComputedStyle(table).visibility);
            console.log('Table height:', window.getComputedStyle(table).height);
        } else {
            console.error('Table not found in DOM after rendering!');
        }
    }

    // Quiz functionality (simplified)
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
        const quizSettings = document.getElementById('quizSettings');
        const quizArea = document.getElementById('quizArea');
        const quizResults = document.getElementById('quizResults');
        const reviewArea = document.getElementById('reviewArea');

        if (quizSettings) quizSettings.classList.add('hidden');
        if (quizArea) quizArea.classList.remove('hidden');
        if (quizResults) quizResults.classList.add('hidden');
        if (reviewArea) reviewArea.classList.add('hidden');
    }

    startQuizTimer() {
        this.quizTimer = setInterval(() => {
            const now = new Date();
            const elapsed = Math.floor((now - this.quizStartTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            const timerElement = document.getElementById('quizTimer');
            if (timerElement) {
                timerElement.textContent = 
                    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }

    renderQuestion() {
        if (!this.quizData || this.currentQuestion >= this.quizData.length) {
            this.finishQuiz();
            return;
        }

        const question = this.quizData[this.currentQuestion];
        const progress = ((this.currentQuestion + 1) / this.quizData.length) * 100;

        const progressElement = document.getElementById('quizProgress');
        if (progressElement) {
            progressElement.textContent = `Question ${this.currentQuestion + 1} of ${this.quizData.length}`;
        }

        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }

        const questionContent = document.getElementById('questionContent');
        if (questionContent) {
            questionContent.innerHTML = `
                <div class="question-type">${question.type.toUpperCase()}</div>
                <div class="question-text">${question.question}</div>
            `;
        }

        const optionsContainer = document.getElementById('answerOptions');
        if (optionsContainer) {
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
        }

        // Update navigation buttons
        const prevBtn = document.getElementById('prevQuestionBtn');
        const nextBtn = document.getElementById('nextQuestionBtn');
        const submitBtn = document.getElementById('submitQuizBtn');

        if (prevBtn) prevBtn.disabled = this.currentQuestion === 0;
        if (nextBtn) nextBtn.style.display = this.currentQuestion === this.quizData.length - 1 ? 'none' : 'inline-block';
        if (submitBtn) submitBtn.style.display = this.currentQuestion === this.quizData.length - 1 ? 'inline-block' : 'none';
    }

    selectAnswer(answer) {
        // Remove previous selection
        document.querySelectorAll('.answer-option').forEach(option => {
            option.classList.remove('selected');
        });

        // Add selection to clicked option
        const selectedOption = document.querySelector(`[data-answer="${answer}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }

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
        if (this.quizTimer) {
            clearInterval(this.quizTimer);
        }
        
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

        const scoreElement = document.getElementById('quizScore');
        const percentageElement = document.getElementById('quizPercentage');
        const timeElement = document.getElementById('quizTime');

        if (scoreElement) scoreElement.textContent = `${correctAnswers}/${this.quizData.length}`;
        if (percentageElement) percentageElement.textContent = `${percentage}%`;
        if (timeElement) {
            timeElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }

        const quizArea = document.getElementById('quizArea');
        const quizResults = document.getElementById('quizResults');

        if (quizArea) quizArea.classList.add('hidden');
        if (quizResults) quizResults.classList.remove('hidden');
    }

    showReview() {
        if (this.wrongAnswers.length === 0) {
            alert('No wrong answers to review!');
            return;
        }

        const quizResults = document.getElementById('quizResults');
        const reviewArea = document.getElementById('reviewArea');

        if (quizResults) quizResults.classList.add('hidden');
        if (reviewArea) reviewArea.classList.remove('hidden');
        this.renderReview();
    }

    hideReview() {
        const reviewArea = document.getElementById('reviewArea');
        const quizResults = document.getElementById('quizResults');

        if (reviewArea) reviewArea.classList.add('hidden');
        if (quizResults) quizResults.classList.remove('hidden');
    }

    renderReview() {
        const container = document.getElementById('reviewContent');
        if (!container) return;
        
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
        const quizResults = document.getElementById('quizResults');
        const quizSettings = document.getElementById('quizSettings');

        if (quizResults) quizResults.classList.add('hidden');
        if (quizSettings) quizSettings.classList.remove('hidden');
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
    console.log('Initializing JLPT App...');
    window.jlptApp = new JLPTApp();
    console.log('JLPT App initialized successfully');
});

// Global functions for onclick handlers
window.startDailyStudy = () => {
    if (window.jlptApp) {
        window.jlptApp.showSection('daily');
    }
};

window.showVocabList = () => {
    if (window.jlptApp) {
        window.jlptApp.showSection('vocabulary');
    }
};

window.takeQuiz = () => {
    if (window.jlptApp) {
        window.jlptApp.showSection('quiz');
    }
};