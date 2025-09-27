# Create the comprehensive 30-day study plan with JSON files
import json
import random
from datetime import datetime

# Function to create quiz questions from previous day's content
def create_quiz_questions(vocab_list, kanji_list, grammar_list, num_questions=30):
    questions = []
    
    # Vocabulary questions (40% of quiz)
    vocab_questions = random.sample(vocab_list, min(12, len(vocab_list)))
    for vocab in vocab_questions:
        # Multiple choice vocabulary question
        question = {
            "type": "vocabulary",
            "question": f"What does '{vocab['kanji']}' mean?",
            "question_jp": vocab['kanji'],
            "question_hiragana": vocab['hiragana'],
            "correct_answer": vocab['english'],
            "options": [vocab['english'], "incorrect option 1", "incorrect option 2", "incorrect option 3"],
            "explanation": f"{vocab['kanji']} ({vocab['hiragana']}) means {vocab['english']}"
        }
        questions.append(question)
    
    # Kanji questions (30% of quiz)
    kanji_questions = random.sample(kanji_list, min(9, len(kanji_list)))
    for kanji in kanji_questions:
        question = {
            "type": "kanji",
            "question": f"How do you read '{kanji['kanji']}'?",
            "question_jp": kanji['kanji'],
            "correct_answer": kanji['onyomi'] if kanji['onyomi'] else kanji['kunyomi'],
            "options": [
                kanji['onyomi'] if kanji['onyomi'] else kanji['kunyomi'],
                "incorrect reading 1", 
                "incorrect reading 2", 
                "incorrect reading 3"
            ],
            "explanation": f"{kanji['kanji']} can be read as {kanji['onyomi']} (on'yomi) or {kanji['kunyomi']} (kun'yomi). Meaning: {kanji['meaning']}"
        }
        questions.append(question)
    
    # Grammar questions (30% of quiz)
    grammar_questions = random.sample(grammar_list, min(9, len(grammar_list)))
    for grammar in grammar_questions:
        question = {
            "type": "grammar",
            "question": f"Complete the sentence using '{grammar['grammar']}':",
            "question_jp": grammar['example_jp'],
            "correct_answer": grammar['example_en'],
            "explanation": f"{grammar['grammar']}: {grammar['meaning']}. Example: {grammar['example_jp']} = {grammar['example_en']}",
            "grammar_point": grammar['grammar'],
            "meaning": grammar['meaning']
        }
        questions.append(question)
    
    return questions[:num_questions]

# Function to create JLPT-format test questions
def create_jlpt_test(vocab_list, kanji_list, grammar_list, test_type="midterm"):
    test_questions = []
    
    if test_type == "midterm":
        # Midterm: 50 questions
        vocab_count = 20
        kanji_count = 15
        grammar_count = 15
    else:
        # Final: 75 questions (full JLPT N5 format)
        vocab_count = 30
        kanji_count = 25
        grammar_count = 20
    
    # Vocabulary section - Kanji reading questions
    for i, vocab in enumerate(random.sample(vocab_list, vocab_count)):
        question = {
            "id": f"vocab_{i+1}",
            "type": "kanji_reading", 
            "section": "Language Knowledge (Vocabulary)",
            "question_jp": f"＿＿＿の読み方として最もよいものを、1・2・3・4から一つ選びなさい。",
            "sentence": f"私は毎日{vocab['kanji']}を勉強します。",
            "underlined_word": vocab['kanji'],
            "options": [
                vocab['hiragana'],
                "incorrect_hiragana_1",
                "incorrect_hiragana_2", 
                "incorrect_hiragana_3"
            ],
            "correct_answer": 1,
            "explanation": f"{vocab['kanji']} is read as {vocab['hiragana']} and means {vocab['english']}"
        }
        test_questions.append(question)
    
    # Kanji section - Meaning questions  
    for i, kanji in enumerate(random.sample(kanji_list, kanji_count)):
        question = {
            "id": f"kanji_{i+1}",
            "type": "kanji_meaning",
            "section": "Language Knowledge (Vocabulary)", 
            "question_jp": f"＿＿＿の意味として最もよいものを、1・2・3・4から一つ選びなさい。",
            "kanji": kanji['kanji'],
            "options": [
                kanji['meaning'],
                "incorrect_meaning_1",
                "incorrect_meaning_2",
                "incorrect_meaning_3"
            ],
            "correct_answer": 1,
            "explanation": f"{kanji['kanji']} means {kanji['meaning']}. Example words: {', '.join(kanji['vocabulary'])}"
        }
        test_questions.append(question)
    
    # Grammar section - Sentence completion
    for i, grammar in enumerate(random.sample(grammar_list, grammar_count)):
        question = {
            "id": f"grammar_{i+1}",
            "type": "grammar_completion",
            "section": "Language Knowledge (Grammar) & Reading",
            "question_jp": "＿＿＿に入る最もよいものを、1・2・3・4から一つ選びなさい。",
            "sentence": grammar['example_jp'].replace(grammar['grammar'], "＿＿＿"),
            "options": [
                grammar['grammar'],
                "incorrect_grammar_1",
                "incorrect_grammar_2", 
                "incorrect_grammar_3"
            ],
            "correct_answer": 1,
            "explanation": f"{grammar['grammar']} means '{grammar['meaning']}'. Formation: {grammar['formation']}"
        }
        test_questions.append(question)
    
    return {
        "test_type": test_type,
        "total_questions": len(test_questions),
        "time_limit_minutes": 75 if test_type == "final" else 50,
        "sections": {
            "vocabulary": vocab_count,
            "kanji": kanji_count, 
            "grammar": grammar_count
        },
        "questions": test_questions,
        "instructions": {
            "jp": "問題を読んで、1・2・3・4から最もよいものを一つ選びなさい。",
            "en": "Read each question and choose the best answer from 1, 2, 3, or 4."
        }
    }

# Create daily study plans
study_plan = {}

for day in range(1, 31):  # Days 1-30
    print(f"Creating Day {day}...")
    
    # Calculate content ranges for this day
    vocab_start = (day - 1) * 19
    vocab_end = min(day * 19, len(absolute_final_vocabulary))
    
    kanji_start = (day - 1) * 6  
    kanji_end = min(day * 6, len(absolute_final_kanji))
    
    grammar_start = (day - 1) * 2
    grammar_end = min(day * 2, len(absolute_final_grammar))
    
    # Get content for this day
    daily_vocab = absolute_final_vocabulary[vocab_start:vocab_end]
    daily_kanji = absolute_final_kanji[kanji_start:kanji_end] 
    daily_grammar = absolute_final_grammar[grammar_start:grammar_end]
    
    # Create quiz from previous days' content (if not day 1)
    if day > 1:
        # Use content from days 1 to day-1 for quiz
        quiz_vocab = absolute_final_vocabulary[0:vocab_start]
        quiz_kanji = absolute_final_kanji[0:kanji_start]
        quiz_grammar = absolute_final_grammar[0:grammar_start]
        daily_quiz = create_quiz_questions(quiz_vocab, quiz_kanji, quiz_grammar, 30)
    else:
        daily_quiz = []
    
    # Create special tests
    midterm_test = None
    final_test = None
    
    if day == 15:  # Midterm test
        midterm_vocab = absolute_final_vocabulary[0:285]  # First half
        midterm_kanji = absolute_final_kanji[0:103]
        midterm_grammar = absolute_final_grammar[0:40]
        midterm_test = create_jlpt_test(midterm_vocab, midterm_kanji, midterm_grammar, "midterm")
    
    if day == 30:  # Final test  
        final_test = create_jlpt_test(absolute_final_vocabulary, absolute_final_kanji, absolute_final_grammar, "final")
    
    # Create daily study plan
    daily_plan = {
        "day": day,
        "date": f"2025-{1 + (day-1)//30:02d}-{((day-1)%30)+1:02d}",  # Starting from January 1st, 2025
        "title": f"JLPT N5 Study Plan - Day {day}",
        "daily_goal": {
            "vocabulary_words": len(daily_vocab),
            "kanji_characters": len(daily_kanji), 
            "grammar_points": len(daily_grammar),
            "study_time_minutes": 60
        },
        "vocabulary": {
            "new_words": daily_vocab,
            "total_learned": vocab_end,
            "category_focus": daily_vocab[0]['category'] if daily_vocab else "review"
        },
        "kanji": {
            "new_kanji": daily_kanji,
            "total_learned": kanji_end,
            "stroke_practice": [k['kanji'] for k in daily_kanji]
        },
        "grammar": {
            "new_points": daily_grammar,
            "total_learned": grammar_end,
            "focus_category": daily_grammar[0]['category'] if daily_grammar else "review"
        },
        "daily_quiz": {
            "questions": daily_quiz,
            "total_questions": len(daily_quiz),
            "estimated_time_minutes": 15,
            "description": "Mixed review of vocabulary, kanji, and grammar from previous days"
        },
        "study_tips": {
            "vocabulary": "Focus on memorizing kanji readings and English meanings. Use spaced repetition.",
            "kanji": "Practice writing each kanji 5-10 times. Learn both on'yomi and kun'yomi readings.",
            "grammar": "Create your own example sentences using new grammar patterns.",
            "general": "Review previous days' content for 10-15 minutes before learning new material."
        }
    }
    
    # Add special tests
    if midterm_test:
        daily_plan["midterm_test"] = midterm_test
        daily_plan["study_tips"]["special"] = "Today includes the midterm test! Review all content from days 1-14."
    
    if final_test:
        daily_plan["final_test"] = final_test
        daily_plan["study_tips"]["special"] = "Final JLPT N5 practice test! This covers all vocabulary, kanji, and grammar."
    
    study_plan[f"day_{day:02d}"] = daily_plan

print(f"\nStudy plan created for all 30 days!")
print(f"Total content distributed:")
print(f"- Vocabulary: {len(absolute_final_vocabulary)} words")
print(f"- Kanji: {len(absolute_final_kanji)} characters")  
print(f"- Grammar: {len(absolute_final_grammar)} points")