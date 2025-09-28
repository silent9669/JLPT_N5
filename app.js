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
        this.grammarData = [];
        this.filteredGrammarData = [];
        this.totalStats = {
            vocabulary: 0,
            kanji: 0,
            grammar: 0,
            days: 36
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadDayData(this.currentDay);
        this.calculateTotalStats();
        
        // Don't pre-load vocabulary data - load it when section is accessed
        // this.loadVocabularyFromAPI();
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

        // Grammar search
        const grammarSearchBtn = document.getElementById('grammarSearchBtn');
        if (grammarSearchBtn) {
            grammarSearchBtn.addEventListener('click', () => {
                this.searchGrammar();
            });
        }

        const grammarSearchInput = document.getElementById('grammarSearch');
        if (grammarSearchInput) {
            grammarSearchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchGrammar();
                }
            });
        }

        // Grammar filters
        const levelFilter = document.getElementById('levelFilter');
        if (levelFilter) {
            levelFilter.addEventListener('change', () => {
                this.searchGrammar();
            });
        }

        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => {
                this.searchGrammar();
            });
        }

        // Clear filters button
        const clearFiltersBtn = document.getElementById('clearFiltersBtn');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                this.clearGrammarFilters();
            });
        }

        // Test controls
        const startTestBtn = document.getElementById('startTestBtn');
        if (startTestBtn) {
            startTestBtn.addEventListener('click', () => {
                this.startTest();
            });
        }

        const testPrevQuestionBtn = document.getElementById('prevQuestionBtn');
        if (testPrevQuestionBtn) {
            testPrevQuestionBtn.addEventListener('click', () => {
                this.prevTestQuestion();
            });
        }

        const testNextQuestionBtn = document.getElementById('nextQuestionBtn');
        if (testNextQuestionBtn) {
            testNextQuestionBtn.addEventListener('click', () => {
                this.nextTestQuestion();
            });
        }

        const finishTestBtn = document.getElementById('finishTestBtn');
        if (finishTestBtn) {
            finishTestBtn.addEventListener('click', () => {
                this.finishTest();
            });
        }

        const reviewTestBtn = document.getElementById('reviewTestBtn');
        if (reviewTestBtn) {
            reviewTestBtn.addEventListener('click', () => {
                this.reviewTest();
            });
        }

        const retakeTestBtn = document.getElementById('retakeTestBtn');
        if (retakeTestBtn) {
            retakeTestBtn.addEventListener('click', () => {
                this.retakeTest();
            });
        }

        const backToTestResultsBtn = document.getElementById('backToResultsBtn');
        if (backToTestResultsBtn) {
            backToTestResultsBtn.addEventListener('click', () => {
                this.backToResults();
            });
        }

        const retakeFromReviewBtn = document.getElementById('retakeFromReviewBtn');
        if (retakeFromReviewBtn) {
            retakeFromReviewBtn.addEventListener('click', () => {
                this.retakeTest();
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
            console.log('Loading vocabulary section, vocabData length:', this.vocabData.length);
            if (this.vocabData.length === 0) {
                this.loadVocabularyFromAPI();
            } else {
                this.renderVocabularyTable();
            }
        } else if (sectionName === 'grammar') {
            this.loadGrammarDatabase();
        } else if (sectionName === 'test') {
            this.loadTestList();
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
        
        // Special handling for daily study tabs
        if (this.currentSection === 'daily') {
            // For daily study, we don't need special handling as the data is already loaded
            // The renderVocabulary, renderKanji, and renderGrammar functions handle daily study content
        } else if (tabName === 'vocabulary') {
            // This is for the main vocabulary section, not daily study
            if (this.vocabData.length === 0) {
                this.loadVocabularyFromAPI();
            } else {
                this.renderVocabularyTable();
            }
        }
    }

    async loadDayData(day) {
        try {
            const response = await fetch(`data/daily/jlpt_n5_day_${day.toString().padStart(2, '0')}.json`);
            const data = await response.json();
            
            this.currentDayData = data;
            
            // Calculate cumulative totals
            const cumulativeTotals = await this.calculateCumulativeTotals(day);
            
            this.renderVocabulary(data.vocabulary, cumulativeTotals.vocabulary);
            this.renderKanji(data.kanji, cumulativeTotals.kanji);
            this.renderGrammar(data.grammar, cumulativeTotals.grammar);
        } catch (error) {
            console.error('Error loading day data:', error);
            this.showError('Failed to load study data for day ' + day);
        }
    }

    async calculateCumulativeTotals(day) {
        let totalVocabulary = 0;
        let totalKanji = 0;
        let totalGrammar = 0;

        for (let i = 1; i <= day; i++) {
            try {
                const response = await fetch(`data/daily/jlpt_n5_day_${i.toString().padStart(2, '0')}.json`);
                const data = await response.json();
                
                if (data.vocabulary && data.vocabulary.new_words) {
                    totalVocabulary += data.vocabulary.new_words.length;
                }
                if (data.kanji && data.kanji.new_kanji) {
                    totalKanji += data.kanji.new_kanji.length;
                }
                if (data.grammar && data.grammar.new_points) {
                    totalGrammar += data.grammar.new_points.length;
                }
            } catch (error) {
                console.warn(`Could not load day ${i} data for cumulative calculation`);
            }
        }

        return {
            vocabulary: totalVocabulary,
            kanji: totalKanji,
            grammar: totalGrammar
        };
    }

    async calculateTotalStats() {
        let totalVocabulary = 0;
        let totalKanji = 0;
        let totalGrammar = 0;

        for (let i = 1; i <= 36; i++) {
            try {
                const response = await fetch(`data/daily/jlpt_n5_day_${i.toString().padStart(2, '0')}.json`);
                const data = await response.json();
                
                if (data.vocabulary && data.vocabulary.new_words) {
                    totalVocabulary += data.vocabulary.new_words.length;
                }
                if (data.kanji && data.kanji.new_kanji) {
                    totalKanji += data.kanji.new_kanji.length;
                }
                if (data.grammar && data.grammar.new_points) {
                    totalGrammar += data.grammar.new_points.length;
                }
            } catch (error) {
                console.warn(`Could not load day ${i} data for total calculation`);
            }
        }

        this.totalStats = {
            vocabulary: totalVocabulary,
            kanji: totalKanji,
            grammar: totalGrammar,
            days: 36
        };

        this.updateDashboardStats();
    }

    updateDashboardStats() {
        this.animateNumber('vocab-count', this.totalStats.vocabulary);
        this.animateNumber('kanji-count', this.totalStats.kanji);
        this.animateNumber('grammar-count', this.totalStats.grammar);
        this.animateNumber('days-count', this.totalStats.days);
    }

    animateNumber(elementId, targetNumber) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const duration = 2000; // 2 seconds
        const startTime = performance.now();
        const startNumber = 0;

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentNumber = Math.floor(startNumber + (targetNumber - startNumber) * easeOutQuart);
            
            element.textContent = currentNumber;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = targetNumber;
            }
        };

        requestAnimationFrame(animate);
    }

    renderVocabulary(vocabulary, cumulativeTotal = null) {
        const container = document.getElementById('dailyVocabularyList');
        const countElement = document.getElementById('vocabCount');

        if (!container) return;

        if (!vocabulary || !vocabulary.new_words) {
            container.innerHTML = '<p>No vocabulary data available for this day.</p>';
            return;
        }

        if (countElement) {
            countElement.textContent = cumulativeTotal || vocabulary.total_learned || vocabulary.new_words.length;
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

    renderKanji(kanji, cumulativeTotal = null) {
        const container = document.getElementById('kanjiList');
        const countElement = document.getElementById('kanjiCount');

        if (!container) return;

        if (!kanji || !kanji.new_kanji) {
            container.innerHTML = '<p>No kanji data available for this day.</p>';
            return;
        }

        if (countElement) {
            countElement.textContent = cumulativeTotal || kanji.total_learned || kanji.new_kanji.length;
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

    renderGrammar(grammar, cumulativeTotal = null) {
        const container = document.getElementById('grammarList');
        const countElement = document.getElementById('grammarCount');

        if (!container) return;

        if (!grammar || !grammar.new_points) {
            container.innerHTML = '<p>No grammar data available for this day.</p>';
            return;
        }

        if (countElement) {
            countElement.textContent = cumulativeTotal || grammar.total_learned || grammar.new_points.length;
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
            const response = await fetch('data/vocabulary/n5_vocabulary.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.vocabData = data.vocabulary || [];
            this.filteredVocabData = [...this.vocabData];
            
            this.updateVocabStats();
            this.renderVocabularyTable();
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
        // Try multiple containers
        let container = document.getElementById('vocabularyDatabase');
        if (!container) {
            container = document.getElementById('vocabularyList');
        }
        if (!container) {
            container = document.getElementById('vocabulary-tab');
        }
        
        if (!container) {
            console.error('Vocabulary container not found!');
            return;
        }
        
        if (this.filteredVocabData.length === 0) {
            container.innerHTML = '<div class="loading-message">No vocabulary found matching your search criteria.</div>';
            return;
        }
        
        // Create clean table with all words (unlimited scrolling)
        const tableHTML = `
            <table class="vocab-table">
                <thead>
                    <tr>
                        <th class="vocab-number">#</th>
                        <th class="vocab-kanji">Kanji</th>
                        <th class="vocab-hiragana">Hiragana</th>
                        <th class="vocab-romaji">Romaji</th>
                        <th class="vocab-english">English</th>
                        <th class="vocab-level">Level</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.filteredVocabData.map(word => `
                        <tr>
                            <td class="vocab-number">${word.number}</td>
                            <td class="vocab-kanji">${word.kanji || '-'}</td>
                            <td class="vocab-hiragana">${word.hiragana || '-'}</td>
                            <td class="vocab-romaji">${word.romaji || '-'}</td>
                            <td class="vocab-english">${word.english || '-'}</td>
                            <td class="vocab-level">
                                <span class="vocab-level-badge">${word.level || 'N5'}</span>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        container.innerHTML = tableHTML;
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
        if (this.quizData && this.currentQuestion < this.quizData.length - 1) {
            this.currentQuestion++;
            this.renderQuestion();
        }
    }

    prevQuestion() {
        if (this.quizData && this.currentQuestion > 0) {
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

    // Grammar Database Functions
    async loadGrammarDatabase() {
        try {
            const container = document.getElementById('grammarDatabase');
            if (!container) return;

            container.innerHTML = '<div class="loading-message">Loading grammar database...</div>';
            
            console.log('Loading N5-N4 grammar database...');
            const response = await fetch('data/tests/jlpt_n5_n4_complete_grammar_database.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Grammar data loaded:', data);
            this.grammarData = data.grammar_points || [];
            this.filteredGrammarData = [...this.grammarData];
            
            console.log('Grammar points count:', this.grammarData.length);
            console.log('First grammar point:', this.grammarData[0]);
            
            this.renderGrammarTable();
        } catch (error) {
            console.error('Error loading grammar database:', error);
            const container = document.getElementById('grammarDatabase');
            if (container) {
                container.innerHTML = `
                    <div class="loading-message">
                        <p>Unable to load grammar data. Please try again.</p>
                        <button class="btn primary" onclick="window.jlptApp.loadGrammarDatabase()">Retry</button>
                    </div>
                `;
            }
        }
    }

    populateCategoryFilter() {
        const categoryFilter = document.getElementById('categoryFilter');
        if (!categoryFilter) return;

        const categories = [...new Set(this.grammarData.map(item => item.category))].sort();
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            categoryFilter.appendChild(option);
        });
    }

    renderGrammarTable() {
        const container = document.getElementById('grammarDatabase');
        if (!container) return;
        if (this.filteredGrammarData.length === 0) {
            container.innerHTML = '<div class="loading-message"><p>No grammar points found.</p></div>';
            return;
        }

        const tableHTML = `
            <table class="grammar-table">
                <thead>
                    <tr>
                        <th>Grammar Point</th>
                        <th>Meaning</th>
                        <th>Formation</th>
                        <th>Level</th>
                        <th>Category</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.filteredGrammarData.map(item => `
                        <tr>
                            <td>
                                <div class="grammar-point">${item.grammar}</div>
                            </td>
                            <td>
                                <div class="grammar-meaning">${item.meaning}</div>
                            </td>
                            <td>
                                <div class="grammar-formation">${item.formation}</div>
                            </td>
                            <td>
                                <span class="grammar-level ${item.level.toLowerCase()}">${item.level}</span>
                            </td>
                            <td>${item.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        container.innerHTML = tableHTML;
    }

    searchGrammar() {
        const searchInput = document.getElementById('grammarSearch');
        const levelFilter = document.getElementById('levelFilter');
        const categoryFilter = document.getElementById('categoryFilter');
        
        if (!searchInput) return;

        const searchTerm = searchInput.value.toLowerCase().trim();
        const selectedLevel = levelFilter ? levelFilter.value : 'all';
        const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
        
        this.filteredGrammarData = this.grammarData.filter(item => {
            const matchesSearch = !searchTerm || 
                item.grammar.toLowerCase().includes(searchTerm) ||
                item.meaning.toLowerCase().includes(searchTerm) ||
                item.formation.toLowerCase().includes(searchTerm);
            
            const matchesLevel = selectedLevel === 'all' || item.level === selectedLevel;
            const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
            
            return matchesSearch && matchesLevel && matchesCategory;
        });
        
        this.renderGrammarTable();
    }

    clearGrammarFilters() {
        const searchInput = document.getElementById('grammarSearch');
        const levelFilter = document.getElementById('levelFilter');
        const categoryFilter = document.getElementById('categoryFilter');
        
        if (searchInput) searchInput.value = '';
        if (levelFilter) levelFilter.value = 'all';
        if (categoryFilter) categoryFilter.value = 'all';
        
        this.filteredGrammarData = [...this.grammarData];
        this.renderGrammarTable();
    }

    // Test Functions
    async loadTestList() {
        try {
            const testSelect = document.getElementById('testSelect');
            if (!testSelect) return;

            // Clear existing options
            testSelect.innerHTML = '<option value="">Select a Practice Test</option>';

            // Load test list from the realtest_n_grammar folder
            for (let i = 1; i <= 10; i++) {
                try {
                    const response = await fetch(`data/tests/jlpt_n5_practice_test_${i.toString().padStart(2, '0')}.json`);
                    if (response.ok) {
                        const data = await response.json();
                        const option = document.createElement('option');
                        option.value = i;
                        option.textContent = `Practice Test ${i} - ${data.test_info.title}`;
                        testSelect.appendChild(option);
                    }
                } catch (error) {
                    console.warn(`Could not load test ${i}:`, error);
                }
            }

            // Enable start button when test is selected
            testSelect.addEventListener('change', (e) => {
                const startBtn = document.getElementById('startTestBtn');
                if (startBtn) {
                    startBtn.disabled = !e.target.value;
                }
            });

        } catch (error) {
            console.error('Error loading test list:', error);
        }
    }

    async startTest() {
        const testSelect = document.getElementById('testSelect');
        const testNumber = testSelect.value;
        
        if (!testNumber) return;

        try {
            const response = await fetch(`data/tests/jlpt_n5_practice_test_${testNumber.padStart(2, '0')}.json`);
            const testData = await response.json();
            
            this.currentTest = testData;
            this.testAnswers = [];
            this.currentTestQuestion = 0;
            this.testStartTime = Date.now();
            
            this.showTestArea();
            this.renderTestQuestion();
            this.startTestTimer();
            
        } catch (error) {
            console.error('Error starting test:', error);
            alert('Failed to load test. Please try again.');
        }
    }

    showTestArea() {
        document.getElementById('testArea').style.display = 'block';
        document.getElementById('testResults').style.display = 'none';
        document.getElementById('testReview').style.display = 'none';
    }

    renderTestQuestion() {
        const testQuestion = document.getElementById('testQuestion');
        const progressFill = document.getElementById('testProgress');
        const prevBtn = document.getElementById('prevQuestionBtn');
        const nextBtn = document.getElementById('nextQuestionBtn');
        const finishBtn = document.getElementById('finishTestBtn');
        
        if (!testQuestion || !this.currentTest) return;

        const totalQuestions = this.getTotalQuestions();
        const currentQ = this.currentTestQuestion;
        const progress = ((currentQ + 1) / totalQuestions) * 100;
        
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
        
        if (prevBtn) {
            prevBtn.disabled = currentQ === 0;
        }
        
        if (nextBtn) {
            nextBtn.disabled = currentQ >= totalQuestions - 1;
        }
        
        if (finishBtn) {
            finishBtn.style.display = currentQ >= totalQuestions - 1 ? 'block' : 'none';
        }

        const question = this.getCurrentQuestion();
        if (!question) return;

        let questionText = question.question;
        if (question.underlined) {
            questionText = questionText.replace('___', `<span style="text-decoration: underline; font-weight: bold; color: #4CAF50;">${question.underlined}</span>`);
        }
        
        // Handle reading passages
        let passageHTML = '';
        if (question.passage) {
            passageHTML = `
                <div class="reading-passage">
                    <h4>Reading Passage:</h4>
                    <div class="passage-text">${question.passage}</div>
                </div>
            `;
        }
        
        const questionHTML = `
            ${passageHTML}
            <div class="question-text">${questionText}</div>
            <div class="question-options">
                ${question.options.map((option, index) => `
                    <div class="option" data-option="${index + 1}">
                        <div class="option-number">${index + 1}</div>
                        <div class="option-text">${option}</div>
                    </div>
                `).join('')}
            </div>
        `;

        testQuestion.innerHTML = questionHTML;

        // Add click handlers for options
        testQuestion.querySelectorAll('.option').forEach(option => {
            option.addEventListener('click', () => {
                this.selectTestAnswer(parseInt(option.dataset.option));
            });
        });

        // Load previous answer if exists
        if (this.testAnswers[currentQ] !== undefined) {
            const selectedOption = testQuestion.querySelector(`[data-option="${this.testAnswers[currentQ]}"]`);
            if (selectedOption) {
                selectedOption.classList.add('selected');
            }
        }
    }

    selectTestAnswer(answer) {
        const testQuestion = document.getElementById('testQuestion');
        if (!testQuestion) return;

        // Remove previous selection
        testQuestion.querySelectorAll('.option').forEach(opt => {
            opt.classList.remove('selected');
        });

        // Add selection to clicked option
        const selectedOption = testQuestion.querySelector(`[data-option="${answer}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }

        // Store answer
        this.testAnswers[this.currentTestQuestion] = answer;
    }

    getTotalQuestions() {
        if (!this.currentTest) return 0;
        
        // Use test_info total_questions as the primary source
        if (this.currentTest.test_info && this.currentTest.test_info.total_questions) {
            return this.currentTest.test_info.total_questions;
        }
        
        // Fallback to calculating from sections
        let total = 0;
        if (this.currentTest.section_1_vocabulary) {
            total += this.currentTest.section_1_vocabulary.total_questions;
        }
        if (this.currentTest.section_2_grammar_reading) {
            total += this.currentTest.section_2_grammar_reading.total_questions;
        }
        
        return total;
    }

    getCurrentQuestion() {
        if (!this.currentTest) return null;
        
        let questionIndex = this.currentTestQuestion;
        
        // Check vocabulary section
        if (this.currentTest.section_1_vocabulary) {
            const vocabQuestions = this.getAllQuestionsFromSection(this.currentTest.section_1_vocabulary);
            if (questionIndex < vocabQuestions.length) {
                return vocabQuestions[questionIndex];
            }
            questionIndex -= vocabQuestions.length;
        }
        
        // Check grammar section
        if (this.currentTest.section_2_grammar_reading) {
            const grammarQuestions = this.getAllQuestionsFromSection(this.currentTest.section_2_grammar_reading);
            if (questionIndex < grammarQuestions.length) {
                return grammarQuestions[questionIndex];
            }
            questionIndex -= grammarQuestions.length;
        }
        
        
        return null;
    }

    getAllQuestionsFromSection(section) {
        const questions = [];
        
        // Handle direct question_types structure (vocabulary section)
        if (section.question_types) {
            Object.keys(section.question_types).forEach(questionType => {
                if (section.question_types[questionType].questions) {
                    questions.push(...section.question_types[questionType].questions);
                }
            });
        }
        
        // Handle subsections structure (grammar section)
        if (section.subsections) {
            Object.keys(section.subsections).forEach(subsectionName => {
                const subsection = section.subsections[subsectionName];
                // Check for direct question_types in subsection
                if (subsection.question_types) {
                    Object.keys(subsection.question_types).forEach(questionType => {
                        if (subsection.question_types[questionType].questions) {
                            questions.push(...subsection.question_types[questionType].questions);
                        }
                    });
                }
                // Check for nested question types (like grammar_form_selection)
                Object.keys(subsection).forEach(key => {
                    if (key !== 'question_types' && subsection[key] && typeof subsection[key] === 'object') {
                        if (subsection[key].questions) {
                            questions.push(...subsection[key].questions);
                        }
                        // Handle reading passages (nested structure)
                        if (subsection[key].passages) {
                            subsection[key].passages.forEach(passage => {
                                // Handle single question per passage (short_reading)
                                if (passage.question) {
                                    questions.push({
                                        id: passage.id,
                                        type: 'reading',
                                        question: passage.question,
                                        options: passage.options,
                                        correct_answer: passage.correct_answer,
                                        explanation: passage.explanation,
                                        passage: passage.passage
                                    });
                                }
                                // Handle multiple questions per passage (medium_reading, info_reading)
                                if (passage.questions) {
                                    passage.questions.forEach((question, index) => {
                                        questions.push({
                                            id: `${passage.id}_q${index + 1}`,
                                            type: 'reading',
                                            question: question.question,
                                            options: question.options,
                                            correct_answer: question.correct_answer,
                                            explanation: question.explanation,
                                            passage: passage.passage
                                        });
                                    });
                                }
                            });
                        }
                    }
                });
            });
        }
        
        console.log(`Section: ${section.title || 'Unknown'}, Questions found: ${questions.length}`);
        return questions;
    }

    nextTestQuestion() {
        const totalQuestions = this.getTotalQuestions();
        if (this.currentTestQuestion < totalQuestions - 1) {
            this.currentTestQuestion++;
            this.renderTestQuestion();
        }
    }

    prevTestQuestion() {
        if (this.currentTestQuestion > 0) {
            this.currentTestQuestion--;
            this.renderTestQuestion();
        }
    }

    finishTest() {
        const testTime = Math.floor((Date.now() - this.testStartTime) / 1000);
        const totalQuestions = this.getTotalQuestions();
        let correctAnswers = 0;
        
        // Calculate score
        for (let i = 0; i < totalQuestions; i++) {
            const question = this.getQuestionByIndex(i);
            if (question && this.testAnswers[i] === question.correct_answer) {
                correctAnswers++;
            }
        }
        
        const percentage = Math.round((correctAnswers / totalQuestions) * 100);
        
        // Show results
        this.showTestResults(correctAnswers, totalQuestions, percentage, testTime);
    }

    getQuestionByIndex(index) {
        let questionIndex = index;
        
        // Check vocabulary section
        if (this.currentTest.section_1_vocabulary) {
            const vocabQuestions = this.getAllQuestionsFromSection(this.currentTest.section_1_vocabulary);
            if (questionIndex < vocabQuestions.length) {
                return vocabQuestions[questionIndex];
            }
            questionIndex -= vocabQuestions.length;
        }
        
        // Check grammar section
        if (this.currentTest.section_2_grammar_reading) {
            const grammarQuestions = this.getAllQuestionsFromSection(this.currentTest.section_2_grammar_reading);
            if (questionIndex < grammarQuestions.length) {
                return grammarQuestions[questionIndex];
            }
            questionIndex -= grammarQuestions.length;
        }
        
        
        return null;
    }

    showTestResults(correct, total, percentage, time) {
        document.getElementById('testArea').style.display = 'none';
        document.getElementById('testResults').style.display = 'block';
        
        document.getElementById('testScore').textContent = `${correct}/${total}`;
        document.getElementById('testPercentage').textContent = `${percentage}%`;
        document.getElementById('testTime').textContent = this.formatTime(time);
        
        // Add performance feedback
        const percentageElement = document.getElementById('testPercentage');
        if (percentage >= 80) {
            percentageElement.style.color = '#4CAF50';
        } else if (percentage >= 60) {
            percentageElement.style.color = '#FF9800';
        } else {
            percentageElement.style.color = '#f44336';
        }
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    startTestTimer() {
        this.testTimer = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.testStartTime) / 1000);
            const timerElement = document.getElementById('testTimer');
            if (timerElement) {
                timerElement.textContent = this.formatTime(elapsed);
            }
        }, 1000);
    }

    stopTestTimer() {
        if (this.testTimer) {
            clearInterval(this.testTimer);
            this.testTimer = null;
        }
    }

    reviewTest() {
        document.getElementById('testResults').style.display = 'none';
        document.getElementById('testReview').style.display = 'block';
        
        const reviewContent = document.getElementById('reviewContent');
        const totalQuestions = this.getTotalQuestions();
        
        let reviewHTML = `
            <div class="review-header">
                <h3>Test Review - ${this.currentTest.test_info.title}</h3>
                <p>Review all questions and your answers</p>
            </div>
        `;
        
        for (let i = 0; i < totalQuestions; i++) {
            const question = this.getQuestionByIndex(i);
            if (!question) continue;
            
            const userAnswer = this.testAnswers[i];
            const isCorrect = userAnswer === question.correct_answer;
            
            let questionText = question.question;
            if (question.underlined) {
                questionText = questionText.replace('___', `<span style="text-decoration: underline; font-weight: bold; color: #4CAF50;">${question.underlined}</span>`);
            }
            
            reviewHTML += `
                <div class="review-question ${isCorrect ? 'correct' : 'incorrect'}">
                    <div class="review-question-header">
                        <h4>Question ${i + 1} ${isCorrect ? '✓' : '✗'}</h4>
                        <span class="question-type">${question.type || 'Multiple Choice'}</span>
                    </div>
                    <div class="review-question-content">
                        <p class="question-text"><strong>Question:</strong> ${questionText}</p>
                        <div class="answer-comparison">
                            <div class="user-answer">
                                <strong>Your Answer:</strong> 
                                <span class="answer-text ${isCorrect ? 'correct' : 'incorrect'}">
                                    ${userAnswer ? question.options[userAnswer - 1] : 'Not answered'}
                                </span>
                            </div>
                            <div class="correct-answer">
                                <strong>Correct Answer:</strong> 
                                <span class="answer-text correct">${question.options[question.correct_answer - 1]}</span>
                            </div>
                        </div>
                        ${question.explanation ? `<div class="explanation"><strong>Explanation:</strong> ${question.explanation}</div>` : ''}
                    </div>
                </div>
            `;
        }
        
        reviewContent.innerHTML = reviewHTML;
    }

    retakeTest() {
        this.startTest();
    }

    backToResults() {
        document.getElementById('testReview').style.display = 'none';
        document.getElementById('testResults').style.display = 'block';
    }

    // Grammar Database Functions
    async loadGrammarDatabase() {
        try {
            const container = document.getElementById('grammarDatabase');
            if (!container) return;

            container.innerHTML = '<div class="loading-message">Loading grammar database...</div>';
            
            const response = await fetch('data/tests/jlpt_n5_n4_complete_grammar_database.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.grammarData = data.grammar_points || [];
            this.filteredGrammarData = [...this.grammarData];
            
            this.populateCategoryFilter();
            this.renderGrammarTable();
        } catch (error) {
            console.error('Error loading grammar database:', error);
            const container = document.getElementById('grammarDatabase');
            if (container) {
                container.innerHTML = `
                    <div class="loading-message">
                        <p>Unable to load grammar data. Please try again.</p>
                        <button class="btn primary" onclick="window.jlptApp.loadGrammarDatabase()">Retry</button>
                    </div>
                `;
            }
        }
    }

    populateCategoryFilter() {
        const categoryFilter = document.getElementById('categoryFilter');
        if (!categoryFilter) return;

        const categories = [...new Set(this.grammarData.map(item => item.category))].sort();
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            categoryFilter.appendChild(option);
        });
    }

    renderGrammarTable() {
        const container = document.getElementById('grammarDatabase');
        if (!container) return;
        if (this.filteredGrammarData.length === 0) {
            container.innerHTML = '<div class="loading-message"><p>No grammar points found.</p></div>';
            return;
        }

        const tableHTML = `
            <table class="grammar-table">
                <thead>
                    <tr>
                        <th>Grammar Point</th>
                        <th>Meaning</th>
                        <th>Formation</th>
                        <th>Level</th>
                        <th>Category</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.filteredGrammarData.map(item => `
                        <tr>
                            <td>
                                <div class="grammar-point">${item.grammar}</div>
                            </td>
                            <td>
                                <div class="grammar-meaning">${item.meaning}</div>
                            </td>
                            <td>
                                <div class="grammar-formation">${item.formation}</div>
                            </td>
                            <td>
                                <span class="grammar-level ${item.level.toLowerCase()}">${item.level}</span>
                            </td>
                            <td>${item.category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;

        container.innerHTML = tableHTML;
    }

    searchGrammar() {
        const searchInput = document.getElementById('grammarSearch');
        const levelFilter = document.getElementById('levelFilter');
        const categoryFilter = document.getElementById('categoryFilter');
        
        if (!searchInput) return;

        const searchTerm = searchInput.value.toLowerCase().trim();
        const selectedLevel = levelFilter ? levelFilter.value : 'all';
        const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
        
        this.filteredGrammarData = this.grammarData.filter(item => {
            const matchesSearch = !searchTerm || 
                item.grammar.toLowerCase().includes(searchTerm) ||
                item.meaning.toLowerCase().includes(searchTerm) ||
                item.formation.toLowerCase().includes(searchTerm);
            
            const matchesLevel = selectedLevel === 'all' || item.level === selectedLevel;
            const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
            
            return matchesSearch && matchesLevel && matchesCategory;
        });
        
        this.renderGrammarTable();
    }

    clearGrammarFilters() {
        const searchInput = document.getElementById('grammarSearch');
        const levelFilter = document.getElementById('levelFilter');
        const categoryFilter = document.getElementById('categoryFilter');
        
        if (searchInput) searchInput.value = '';
        if (levelFilter) levelFilter.value = 'all';
        if (categoryFilter) categoryFilter.value = 'all';
        
        this.filteredGrammarData = [...this.grammarData];
        this.renderGrammarTable();
    }

    // Vocabulary Functions
    async loadVocabularyFromAPI() {
        try {
            const container = document.getElementById('vocabularyDatabase');
            if (!container) {
                console.error('Vocabulary container not found');
                return;
            }

            container.innerHTML = '<div class="loading-message">Loading N5 vocabulary list...</div>';
            
            // Load from local JSON file for faster loading
            const response = await fetch('data/vocabulary/n5_vocabulary.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.vocabData = data.vocabulary || [];
            this.filteredVocabData = [...this.vocabData];
            
            this.updateVocabStats();
            this.renderVocabularyTable();
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
        // Try multiple containers
        let container = document.getElementById('vocabularyDatabase');
        if (!container) {
            container = document.getElementById('vocabularyList');
        }
        if (!container) {
            container = document.getElementById('vocabulary-tab');
        }
        
        if (!container) {
            console.error('Vocabulary container not found!');
            return;
        }
        
        if (this.filteredVocabData.length === 0) {
            container.innerHTML = '<div class="loading-message">No vocabulary found matching your search criteria.</div>';
            return;
        }
        
        // Create clean table with all words (unlimited scrolling)
        const tableHTML = `
            <table class="vocab-table">
                <thead>
                    <tr>
                        <th class="vocab-number">#</th>
                        <th class="vocab-kanji">Kanji</th>
                        <th class="vocab-hiragana">Hiragana</th>
                        <th class="vocab-romaji">Romaji</th>
                        <th class="vocab-english">English</th>
                        <th class="vocab-level">Level</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.filteredVocabData.map(word => `
                        <tr>
                            <td class="vocab-number">${word.number}</td>
                            <td class="vocab-kanji">${word.kanji || '-'}</td>
                            <td class="vocab-hiragana">${word.hiragana || '-'}</td>
                            <td class="vocab-romaji">${word.romaji || '-'}</td>
                            <td class="vocab-english">${word.english || '-'}</td>
                            <td class="vocab-level">
                                <span class="vocab-level-badge">${word.level || 'N5'}</span>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        container.innerHTML = tableHTML;
    }

    // Vocabulary Functions
    async loadVocabularyFromAPI() {
        try {
            const container = document.getElementById('vocabularyDatabase');
            if (!container) {
                console.error('Vocabulary container not found');
                return;
            }

            console.log('Loading vocabulary data...');
            container.innerHTML = '<div class="loading-message">Loading N5 vocabulary list...</div>';
            
            // Load from local JSON file for faster loading
            const response = await fetch('data/vocabulary/n5_vocabulary.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Vocabulary data loaded:', data);
            this.vocabData = data.vocabulary || [];
            this.filteredVocabData = [...this.vocabData];
            
            console.log('Vocabulary count:', this.vocabData.length);
            this.updateVocabStats();
            this.renderVocabularyTable();
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
        // Try multiple containers
        let container = document.getElementById('vocabularyDatabase');
        if (!container) {
            container = document.getElementById('vocabularyList');
        }
        if (!container) {
            container = document.getElementById('vocabulary-tab');
        }
        
        if (!container) {
            console.error('Vocabulary container not found!');
            return;
        }
        
        if (this.filteredVocabData.length === 0) {
            container.innerHTML = '<div class="loading-message">No vocabulary found matching your search criteria.</div>';
            return;
        }
        
        // Create clean table with all words (unlimited scrolling)
        const tableHTML = `
            <table class="vocab-table">
                <thead>
                    <tr>
                        <th class="vocab-number">#</th>
                        <th class="vocab-kanji">Kanji</th>
                        <th class="vocab-hiragana">Hiragana</th>
                        <th class="vocab-romaji">Romaji</th>
                        <th class="vocab-english">English</th>
                        <th class="vocab-level">Level</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.filteredVocabData.map(word => `
                        <tr>
                            <td class="vocab-number">${word.number}</td>
                            <td class="vocab-kanji">${word.kanji || '-'}</td>
                            <td class="vocab-hiragana">${word.hiragana || '-'}</td>
                            <td class="vocab-romaji">${word.romaji || '-'}</td>
                            <td class="vocab-english">${word.english || '-'}</td>
                            <td class="vocab-level">
                                <span class="vocab-level-badge">${word.level || 'N5'}</span>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        container.innerHTML = tableHTML;
    }

    // Vocabulary Functions
    async loadVocabularyFromAPI() {
        try {
            const container = document.getElementById('vocabularyDatabase');
            if (!container) {
                console.error('Vocabulary container not found');
                return;
            }

            console.log('Loading vocabulary data...');
            container.innerHTML = '<div class="loading-message">Loading N5 vocabulary list...</div>';
            
            // Load from local JSON file for faster loading
            const response = await fetch('data/vocabulary/n5_vocabulary.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Vocabulary data loaded:', data);
            this.vocabData = data.vocabulary || [];
            this.filteredVocabData = [...this.vocabData];
            
            console.log('Vocabulary count:', this.vocabData.length);
            this.updateVocabStats();
            this.renderVocabularyTable();
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
        // Try multiple containers
        let container = document.getElementById('vocabularyDatabase');
        if (!container) {
            container = document.getElementById('vocabularyList');
        }
        if (!container) {
            container = document.getElementById('vocabulary-tab');
        }
        
        if (!container) {
            console.error('Vocabulary container not found!');
            return;
        }
        
        if (this.filteredVocabData.length === 0) {
            container.innerHTML = '<div class="loading-message">No vocabulary found matching your search criteria.</div>';
            return;
        }
        
        // Create clean table with all words (unlimited scrolling)
        const tableHTML = `
            <table class="vocab-table">
                <thead>
                    <tr>
                        <th class="vocab-number">#</th>
                        <th class="vocab-kanji">Kanji</th>
                        <th class="vocab-hiragana">Hiragana</th>
                        <th class="vocab-romaji">Romaji</th>
                        <th class="vocab-english">English</th>
                        <th class="vocab-level">Level</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.filteredVocabData.map(word => `
                        <tr>
                            <td class="vocab-number">${word.number}</td>
                            <td class="vocab-kanji">${word.kanji || '-'}</td>
                            <td class="vocab-hiragana">${word.hiragana || '-'}</td>
                            <td class="vocab-romaji">${word.romaji || '-'}</td>
                            <td class="vocab-english">${word.english || '-'}</td>
                            <td class="vocab-level">
                                <span class="vocab-level-badge">${word.level || 'N5'}</span>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        console.log('Rendering vocabulary table...');
        container.innerHTML = tableHTML;
    }

    // Grammar Functions
    async loadGrammarDatabase() {
        try {
            const container = document.getElementById('grammarDatabase');
            if (!container) {
                console.error('Grammar container not found');
                return;
            }

            console.log('Loading grammar database...');
            container.innerHTML = '<div class="loading-message">Loading grammar database...</div>';
            
            const response = await fetch('data/tests/jlpt_n5_n4_complete_grammar_database.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Grammar data loaded:', data);
            this.grammarData = data.grammar_points || [];
            this.filteredGrammarData = [...this.grammarData];
            
            console.log('Grammar count:', this.grammarData.length);
            this.populateCategoryFilter();
            this.renderGrammarTable();
        } catch (error) {
            console.error('Error loading grammar:', error);
            const container = document.getElementById('grammarDatabase');
            if (container) {
                container.innerHTML = `
                    <div class="loading-message">
                        <p>Unable to load grammar data. Please try again.</p>
                        <button class="btn primary" onclick="window.jlptApp.loadGrammarDatabase()">Retry</button>
                    </div>
                `;
            }
        }
    }

    populateCategoryFilter() {
        const categoryFilter = document.getElementById('categoryFilter');
        if (!categoryFilter) return;

        const categories = [...new Set(this.grammarData.map(item => item.category).filter(Boolean))];
        categoryFilter.innerHTML = '<option value="all">All Categories</option>' +
            categories.map(category => `<option value="${category}">${category}</option>`).join('');
    }

    renderGrammarTable() {
        const container = document.getElementById('grammarDatabase');
        if (!container) {
            console.error('Grammar container not found!');
            return;
        }
        
        console.log('Rendering grammar table...');
        console.log('Grammar data length:', this.filteredGrammarData.length);
        
        if (this.filteredGrammarData.length === 0) {
            container.innerHTML = '<div class="loading-message">No grammar points found matching your search criteria.</div>';
            return;
        }
        
        const tableHTML = `
            <table class="vocab-table">
                <thead>
                    <tr>
                        <th class="vocab-number">#</th>
                        <th class="vocab-kanji">Grammar Point</th>
                        <th class="vocab-hiragana">Meaning</th>
                        <th class="vocab-romaji">Formation</th>
                        <th class="vocab-english">Level</th>
                        <th class="vocab-category">Category</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.filteredGrammarData.map((item, index) => `
                        <tr>
                            <td class="vocab-number">${index + 1}</td>
                            <td class="vocab-kanji">${item.grammar || 'N/A'}</td>
                            <td class="vocab-hiragana">${item.meaning || 'N/A'}</td>
                            <td class="vocab-romaji">${item.formation || 'N/A'}</td>
                            <td class="vocab-english">
                                <span class="grammar-level-badge ${(item.level || 'N5').toLowerCase()}">${item.level || 'N5'}</span>
                            </td>
                            <td class="vocab-category">${(item.category || 'N/A').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        console.log('Grammar table HTML length:', tableHTML.length);
        container.innerHTML = tableHTML;
        console.log('Grammar container updated');
    }

    searchGrammar() {
        const searchInput = document.getElementById('grammarSearch');
        const levelFilter = document.getElementById('levelFilter');
        const categoryFilter = document.getElementById('categoryFilter');
        
        if (!searchInput) return;

        const searchTerm = searchInput.value.toLowerCase().trim();
        const selectedLevel = levelFilter ? levelFilter.value : 'all';
        const selectedCategory = categoryFilter ? categoryFilter.value : 'all';
        
        this.filteredGrammarData = this.grammarData.filter(item => {
            const matchesSearch = !searchTerm || 
                item.point.toLowerCase().includes(searchTerm) ||
                item.meaning.toLowerCase().includes(searchTerm) ||
                (item.formation && item.formation.toLowerCase().includes(searchTerm));
            
            const matchesLevel = selectedLevel === 'all' || 
                (item.level && item.level.toLowerCase() === selectedLevel.toLowerCase());
            
            const matchesCategory = selectedCategory === 'all' || 
                (item.category && item.category === selectedCategory);
            
            return matchesSearch && matchesLevel && matchesCategory;
        });
        
        this.renderGrammarTable();
    }

    clearGrammarFilters() {
        const searchInput = document.getElementById('grammarSearch');
        const levelFilter = document.getElementById('levelFilter');
        const categoryFilter = document.getElementById('categoryFilter');
        
        if (searchInput) searchInput.value = '';
        if (levelFilter) levelFilter.value = 'all';
        if (categoryFilter) categoryFilter.value = 'all';
        
        this.filteredGrammarData = [...this.grammarData];
        this.renderGrammarTable();
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.jlptApp = new JLPTApp();
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