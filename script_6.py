# Create and save JSON files for each day
import json

# Create individual day files
for day_key, daily_data in study_plan.items():
    day_num = daily_data['day']
    filename = f"jlpt_n5_day_{day_num:02d}.json"
    
    # Save individual day file
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(daily_data, f, ensure_ascii=False, indent=2)
    
    print(f"Created {filename}")

# Create master study plan file
master_plan = {
    "title": "JLPT N5 Master Study Plan - 30 Days",
    "description": "Complete 30-day study plan to master JLPT N5 vocabulary, kanji, and grammar",
    "total_content": {
        "vocabulary_words": len(absolute_final_vocabulary),
        "kanji_characters": len(absolute_final_kanji),
        "grammar_points": len(absolute_final_grammar)
    },
    "study_schedule": {
        "duration_days": 30,
        "daily_study_time_minutes": 60,
        "vocabulary_per_day": "19-20 words",
        "kanji_per_day": "6-7 characters", 
        "grammar_per_day": "2-3 points",
        "daily_quiz_questions": 30
    },
    "test_schedule": {
        "daily_quizzes": "Days 2-30 (30 questions each)",
        "midterm_test": "Day 15 (50 questions)",
        "final_test": "Day 30 (75 questions, JLPT format)"
    },
    "instructions": {
        "daily_routine": [
            "1. Review previous day's content (10-15 minutes)",
            "2. Learn new vocabulary words (20 minutes)",
            "3. Study new kanji characters (15 minutes)", 
            "4. Learn new grammar points (10 minutes)",
            "5. Take daily quiz (15 minutes)",
            "6. Practice writing and example sentences (extra time)"
        ],
        "study_tips": [
            "Use spaced repetition for vocabulary review",
            "Practice writing kanji multiple times",
            "Create original sentences using new grammar",
            "Focus on understanding rather than memorization",
            "Take breaks between study sessions"
        ]
    },
    "daily_files": [f"jlpt_n5_day_{i:02d}.json" for i in range(1, 31)]
}

with open("jlpt_n5_master_plan.json", 'w', encoding='utf-8') as f:
    json.dump(master_plan, f, ensure_ascii=False, indent=2)

print("\nCreated jlpt_n5_master_plan.json")

# Create vocabulary database
vocab_database = {
    "title": "JLPT N5 Vocabulary Database", 
    "total_words": len(absolute_final_vocabulary),
    "categories": list(set([v['category'] for v in absolute_final_vocabulary])),
    "vocabulary": absolute_final_vocabulary
}

with open("jlpt_n5_vocabulary_database.json", 'w', encoding='utf-8') as f:
    json.dump(vocab_database, f, ensure_ascii=False, indent=2)

print("Created jlpt_n5_vocabulary_database.json")

# Create kanji database
kanji_database = {
    "title": "JLPT N5 Kanji Database",
    "total_kanji": len(absolute_final_kanji),
    "kanji": absolute_final_kanji
}

with open("jlpt_n5_kanji_database.json", 'w', encoding='utf-8') as f:
    json.dump(kanji_database, f, ensure_ascii=False, indent=2)

print("Created jlpt_n5_kanji_database.json")

# Create grammar database
grammar_database = {
    "title": "JLPT N5 Grammar Database",
    "total_points": len(absolute_final_grammar),
    "categories": list(set([g['category'] for g in absolute_final_grammar])),
    "grammar_points": absolute_final_grammar
}

with open("jlpt_n5_grammar_database.json", 'w', encoding='utf-8') as f:
    json.dump(grammar_database, f, ensure_ascii=False, indent=2)

print("Created jlpt_n5_grammar_database.json")

# Create a sample day file to show structure
print("\n=== Sample Day 1 Structure ===")
print(json.dumps(study_plan["day_01"], ensure_ascii=False, indent=2)[:1000] + "...")

print(f"\n✅ COMPLETE! Created {30 + 4} JSON files:")
print("📁 30 daily study plan files (jlpt_n5_day_01.json to jlpt_n5_day_30.json)")
print("📁 1 master plan file (jlpt_n5_master_plan.json)")
print("📁 3 database files (vocabulary, kanji, grammar)")
print("\nTotal content:")
print(f"🔤 {len(absolute_final_vocabulary)} vocabulary words")
print(f"🈲 {len(absolute_final_kanji)} kanji characters")
print(f"📝 {len(absolute_final_grammar)} grammar points")
print(f"❓ {30 * 30} total quiz questions (30 per day for days 2-30)")
print("🎯 1 midterm test (day 15)")
print("🏆 1 final JLPT-format test (day 30)")