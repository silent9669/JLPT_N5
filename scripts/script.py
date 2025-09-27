import json
import pandas as pd
from datetime import datetime, timedelta
import random

# Create a comprehensive JLPT N5 study plan structure
# Based on research: 800+ vocabulary, 100+ kanji, 80+ grammar points

# JLPT N5 Vocabulary (800+ words) - organized by categories
vocabulary_data = [
    # Basic Words (Days 1-3)
    {"kanji": "私", "hiragana": "わたし", "romaji": "watashi", "english": "I, myself", "category": "pronouns", "level": "basic"},
    {"kanji": "あなた", "hiragana": "あなた", "romaji": "anata", "english": "you", "category": "pronouns", "level": "basic"},
    {"kanji": "彼", "hiragana": "かれ", "romaji": "kare", "english": "he", "category": "pronouns", "level": "basic"},
    {"kanji": "彼女", "hiragana": "かのじょ", "romaji": "kanojo", "english": "she", "category": "pronouns", "level": "basic"},
    {"kanji": "これ", "hiragana": "これ", "romaji": "kore", "english": "this", "category": "pronouns", "level": "basic"},
    {"kanji": "それ", "hiragana": "それ", "romaji": "sore", "english": "that", "category": "pronouns", "level": "basic"},
    {"kanji": "あれ", "hiragana": "あれ", "romaji": "are", "english": "that over there", "category": "pronouns", "level": "basic"},
    {"kanji": "どれ", "hiragana": "どれ", "romaji": "dore", "english": "which", "category": "pronouns", "level": "basic"},
    {"kanji": "ここ", "hiragana": "ここ", "romaji": "koko", "english": "here", "category": "location", "level": "basic"},
    {"kanji": "そこ", "hiragana": "そこ", "romaji": "soko", "english": "there", "category": "location", "level": "basic"},
    {"kanji": "あそこ", "hiragana": "あそこ", "romaji": "asoko", "english": "over there", "category": "location", "level": "basic"},
    {"kanji": "どこ", "hiragana": "どこ", "romaji": "doko", "english": "where", "category": "location", "level": "basic"},
    {"kanji": "家", "hiragana": "いえ", "romaji": "ie", "english": "house, home", "category": "places", "level": "basic"},
    {"kanji": "学校", "hiragana": "がっこう", "romaji": "gakkou", "english": "school", "category": "places", "level": "basic"},
    {"kanji": "会社", "hiragana": "かいしゃ", "romaji": "kaisha", "english": "company", "category": "places", "level": "basic"},
    {"kanji": "駅", "hiragana": "えき", "romaji": "eki", "english": "station", "category": "places", "level": "basic"},
    {"kanji": "病院", "hiragana": "びょういん", "romaji": "byouin", "english": "hospital", "category": "places", "level": "basic"},
    {"kanji": "銀行", "hiragana": "ぎんこう", "romaji": "ginkou", "english": "bank", "category": "places", "level": "basic"},
    {"kanji": "郵便局", "hiragana": "ゆうびんきょく", "romaji": "yuubinkyoku", "english": "post office", "category": "places", "level": "basic"},
    {"kanji": "店", "hiragana": "みせ", "romaji": "mise", "english": "shop, store", "category": "places", "level": "basic"},
    
    # Numbers and Time (Days 4-6)
    {"kanji": "一", "hiragana": "いち", "romaji": "ichi", "english": "one", "category": "numbers", "level": "basic"},
    {"kanji": "二", "hiragana": "に", "romaji": "ni", "english": "two", "category": "numbers", "level": "basic"},
    {"kanji": "三", "hiragana": "さん", "romaji": "san", "english": "three", "category": "numbers", "level": "basic"},
    {"kanji": "四", "hiragana": "よん", "romaji": "yon", "english": "four", "category": "numbers", "level": "basic"},
    {"kanji": "五", "hiragana": "ご", "romaji": "go", "english": "five", "category": "numbers", "level": "basic"},
    {"kanji": "六", "hiragana": "ろく", "romaji": "roku", "english": "six", "category": "numbers", "level": "basic"},
    {"kanji": "七", "hiragana": "なな", "romaji": "nana", "english": "seven", "category": "numbers", "level": "basic"},
    {"kanji": "八", "hiragana": "はち", "romaji": "hachi", "english": "eight", "category": "numbers", "level": "basic"},
    {"kanji": "九", "hiragana": "きゅう", "romaji": "kyuu", "english": "nine", "category": "numbers", "level": "basic"},
    {"kanji": "十", "hiragana": "じゅう", "romaji": "juu", "english": "ten", "category": "numbers", "level": "basic"},
    {"kanji": "百", "hiragana": "ひゃく", "romaji": "hyaku", "english": "hundred", "category": "numbers", "level": "basic"},
    {"kanji": "千", "hiragana": "せん", "romaji": "sen", "english": "thousand", "category": "numbers", "level": "basic"},
    {"kanji": "万", "hiragana": "まん", "romaji": "man", "english": "ten thousand", "category": "numbers", "level": "basic"},
    {"kanji": "時", "hiragana": "じ", "romaji": "ji", "english": "time, hour", "category": "time", "level": "basic"},
    {"kanji": "分", "hiragana": "ふん", "romaji": "fun", "english": "minute", "category": "time", "level": "basic"},
    {"kanji": "今", "hiragana": "いま", "romaji": "ima", "english": "now", "category": "time", "level": "basic"},
    {"kanji": "今日", "hiragana": "きょう", "romaji": "kyou", "english": "today", "category": "time", "level": "basic"},
    {"kanji": "昨日", "hiragana": "きのう", "romaji": "kinou", "english": "yesterday", "category": "time", "level": "basic"},
    {"kanji": "明日", "hiragana": "あした", "romaji": "ashita", "english": "tomorrow", "category": "time", "level": "basic"},
    {"kanji": "朝", "hiragana": "あさ", "romaji": "asa", "english": "morning", "category": "time", "level": "basic"},
    
    # Family and People (Days 7-9)
    {"kanji": "人", "hiragana": "ひと", "romaji": "hito", "english": "person", "category": "people", "level": "basic"},
    {"kanji": "父", "hiragana": "ちち", "romaji": "chichi", "english": "father (humble)", "category": "family", "level": "basic"},
    {"kanji": "母", "hiragana": "はは", "romaji": "haha", "english": "mother (humble)", "category": "family", "level": "basic"},
    {"kanji": "お父さん", "hiragana": "おとうさん", "romaji": "otousan", "english": "father (polite)", "category": "family", "level": "basic"},
    {"kanji": "お母さん", "hiragana": "おかあさん", "romaji": "okaasan", "english": "mother (polite)", "category": "family", "level": "basic"},
    {"kanji": "兄", "hiragana": "あに", "romaji": "ani", "english": "older brother (humble)", "category": "family", "level": "basic"},
    {"kanji": "姉", "hiragana": "あね", "romaji": "ane", "english": "older sister (humble)", "category": "family", "level": "basic"},
    {"kanji": "弟", "hiragana": "おとうと", "romaji": "otouto", "english": "younger brother", "category": "family", "level": "basic"},
    {"kanji": "妹", "hiragana": "いもうと", "romaji": "imouto", "english": "younger sister", "category": "family", "level": "basic"},
    {"kanji": "子供", "hiragana": "こども", "romaji": "kodomo", "english": "child", "category": "family", "level": "basic"},
    {"kanji": "友達", "hiragana": "ともだち", "romaji": "tomodachi", "english": "friend", "category": "people", "level": "basic"},
    {"kanji": "先生", "hiragana": "せんせい", "romaji": "sensei", "english": "teacher", "category": "people", "level": "basic"},
    {"kanji": "学生", "hiragana": "がくせい", "romaji": "gakusei", "english": "student", "category": "people", "level": "basic"},
    {"kanji": "医者", "hiragana": "いしゃ", "romaji": "isha", "english": "doctor", "category": "people", "level": "basic"},
    {"kanji": "男", "hiragana": "おとこ", "romaji": "otoko", "english": "man, male", "category": "people", "level": "basic"},
    {"kanji": "女", "hiragana": "おんな", "romaji": "onna", "english": "woman, female", "category": "people", "level": "basic"},
    {"kanji": "男の子", "hiragana": "おとこのこ", "romaji": "otokonoko", "english": "boy", "category": "people", "level": "basic"},
    {"kanji": "女の子", "hiragana": "おんなのこ", "romaji": "onnanoko", "english": "girl", "category": "people", "level": "basic"},
    {"kanji": "名前", "hiragana": "なまえ", "romaji": "namae", "english": "name", "category": "people", "level": "basic"},
    {"kanji": "年", "hiragana": "とし", "romaji": "toshi", "english": "age, year", "category": "people", "level": "basic"},
    
    # Actions and Verbs (Days 10-13)
    {"kanji": "行く", "hiragana": "いく", "romaji": "iku", "english": "to go", "category": "verbs", "level": "basic"},
    {"kanji": "来る", "hiragana": "くる", "romaji": "kuru", "english": "to come", "category": "verbs", "level": "basic"},
    {"kanji": "帰る", "hiragana": "かえる", "romaji": "kaeru", "english": "to return", "category": "verbs", "level": "basic"},
    {"kanji": "食べる", "hiragana": "たべる", "romaji": "taberu", "english": "to eat", "category": "verbs", "level": "basic"},
    {"kanji": "飲む", "hiragana": "のむ", "romaji": "nomu", "english": "to drink", "category": "verbs", "level": "basic"},
    {"kanji": "見る", "hiragana": "みる", "romaji": "miru", "english": "to see, to watch", "category": "verbs", "level": "basic"},
    {"kanji": "聞く", "hiragana": "きく", "romaji": "kiku", "english": "to hear, to listen", "category": "verbs", "level": "basic"},
    {"kanji": "読む", "hiragana": "よむ", "romaji": "yomu", "english": "to read", "category": "verbs", "level": "basic"},
    {"kanji": "書く", "hiragana": "かく", "romaji": "kaku", "english": "to write", "category": "verbs", "level": "basic"},
    {"kanji": "話す", "hiragana": "はなす", "romaji": "hanasu", "english": "to speak", "category": "verbs", "level": "basic"},
    {"kanji": "勉強する", "hiragana": "べんきょうする", "romaji": "benkyou suru", "english": "to study", "category": "verbs", "level": "basic"},
    {"kanji": "働く", "hiragana": "はたらく", "romaji": "hataraku", "english": "to work", "category": "verbs", "level": "basic"},
    {"kanji": "休む", "hiragana": "やすむ", "romaji": "yasumu", "english": "to rest", "category": "verbs", "level": "basic"},
    {"kanji": "寝る", "hiragana": "ねる", "romaji": "neru", "english": "to sleep", "category": "verbs", "level": "basic"},
    {"kanji": "起きる", "hiragana": "おきる", "romaji": "okiru", "english": "to wake up", "category": "verbs", "level": "basic"},
    {"kanji": "買う", "hiragana": "かう", "romaji": "kau", "english": "to buy", "category": "verbs", "level": "basic"},
    {"kanji": "売る", "hiragana": "うる", "romaji": "uru", "english": "to sell", "category": "verbs", "level": "basic"},
    {"kanji": "作る", "hiragana": "つくる", "romaji": "tsukuru", "english": "to make", "category": "verbs", "level": "basic"},
    {"kanji": "開く", "hiragana": "ひらく", "romaji": "hiraku", "english": "to open", "category": "verbs", "level": "basic"},
    {"kanji": "閉める", "hiragana": "しめる", "romaji": "shimeru", "english": "to close", "category": "verbs", "level": "basic"},
    
    # Food and Drinks (Days 14-16)
    {"kanji": "食べ物", "hiragana": "たべもの", "romaji": "tabemono", "english": "food", "category": "food", "level": "intermediate"},
    {"kanji": "飲み物", "hiragana": "のみもの", "romaji": "nomimono", "english": "drink", "category": "food", "level": "intermediate"},
    {"kanji": "水", "hiragana": "みず", "romaji": "mizu", "english": "water", "category": "food", "level": "basic"},
    {"kanji": "お茶", "hiragana": "おちゃ", "romaji": "ocha", "english": "tea", "category": "food", "level": "basic"},
    {"kanji": "コーヒー", "hiragana": "コーヒー", "romaji": "koohii", "english": "coffee", "category": "food", "level": "basic"},
    {"kanji": "牛乳", "hiragana": "ぎゅうにゅう", "romaji": "gyuunyuu", "english": "milk", "category": "food", "level": "basic"},
    {"kanji": "ご飯", "hiragana": "ごはん", "romaji": "gohan", "english": "rice, meal", "category": "food", "level": "basic"},
    {"kanji": "パン", "hiragana": "パン", "romaji": "pan", "english": "bread", "category": "food", "level": "basic"},
    {"kanji": "肉", "hiragana": "にく", "romaji": "niku", "english": "meat", "category": "food", "level": "basic"},
    {"kanji": "魚", "hiragana": "さかな", "romaji": "sakana", "english": "fish", "category": "food", "level": "basic"},
    {"kanji": "野菜", "hiragana": "やさい", "romaji": "yasai", "english": "vegetables", "category": "food", "level": "basic"},
    {"kanji": "果物", "hiragana": "くだもの", "romaji": "kudamono", "english": "fruit", "category": "food", "level": "basic"},
    {"kanji": "卵", "hiragana": "たまご", "romaji": "tamago", "english": "egg", "category": "food", "level": "basic"},
    {"kanji": "砂糖", "hiragana": "さとう", "romaji": "satou", "english": "sugar", "category": "food", "level": "basic"},
    {"kanji": "塩", "hiragana": "しお", "romaji": "shio", "english": "salt", "category": "food", "level": "basic"},
    {"kanji": "料理", "hiragana": "りょうり", "romaji": "ryouri", "english": "cooking, cuisine", "category": "food", "level": "intermediate"},
    {"kanji": "朝ご飯", "hiragana": "あさごはん", "romaji": "asagohan", "english": "breakfast", "category": "food", "level": "basic"},
    {"kanji": "昼ご飯", "hiragana": "ひるごはん", "romaji": "hirugohan", "english": "lunch", "category": "food", "level": "basic"},
    {"kanji": "晩ご飯", "hiragana": "ばんごはん", "romaji": "bangohan", "english": "dinner", "category": "food", "level": "basic"},
    {"kanji": "レストラン", "hiragana": "レストラン", "romaji": "resutoran", "english": "restaurant", "category": "food", "level": "basic"},
]

print("Sample vocabulary data created with", len(vocabulary_data), "words")
print("First 5 vocabulary entries:")
for i, word in enumerate(vocabulary_data[:5]):
    print(f"{i+1}. {word['kanji']} ({word['hiragana']}) - {word['english']}")