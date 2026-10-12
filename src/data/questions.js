/**
 * Bank Soalan Misi Nombor Arab: Kelas 1 Gamma
 * 1. Mini Kuiz Ustaz Alif (3 soalan: Angka biasa -> Angka Arab)
 * 2. Side Quest Kantin (5 soalan: Objek makanan -> Angka Arab)
 * 3. Side Quest Padang (5 soalan: Objek sukan -> Perkataan Arab)
 * 4. Ujian Akhir Ustaz Alif (10 soalan: Padanan angka & perkataan Arab)
 */

import { ARABIC_NUMBERS } from "./numbers.js";

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getDistractors(correctVal, allValues) {
  const filtered = allValues.filter((v) => v !== correctVal);
  const shuffled = shuffle(filtered);
  return [shuffled[0], shuffled[1]];
}

/**
 * 1. Mini Kuiz Ustaz Alif (3 Soalan)
 * Menguji padanan angka biasa kepada angka Arab sahaja
 */
export function generateMiniQuizUstaz() {
  const selectedNumbers = shuffle(ARABIC_NUMBERS).slice(0, 3);
  const allArabicNumerals = ARABIC_NUMBERS.map((n) => n.arabicNumeral);

  return selectedNumbers.map((item, idx) => {
    const wrongOptions = getDistractors(item.arabicNumeral, allArabicNumerals);
    return {
      id: `mini_q${idx + 1}`,
      number: item.number,
      title: `Mini Kuiz Ustaz Alif (Soalan ${idx + 1}/3)`,
      question: `Pilih angka Arab bagi nombor ${item.number}:`,
      highlight: item.number.toString(),
      correctAnswer: item.arabicNumeral,
      options: shuffle([item.arabicNumeral, ...wrongOptions]),
      explanation: `Nombor ${item.number} dalam angka Arab ialah ${item.arabicNumeral}.`
    };
  });
}

/**
 * 2. Side Quest Kantin: Misi Pesanan Makanan (5 Soalan)
 * Fokus: Objek / jumlah makanan -> Angka Arab (pilihan jawapan dalam angka Arab)
 */
export function generateCanteenFoodQuestions() {
  const foodItems = [
    { name: "aiskrim", emoji: "🍦" },
    { name: "ketul ayam goreng", emoji: "🍗" },
    { name: "pinggan nasi", emoji: "🍚" },
    { name: "keping roti", emoji: "🍞" },
    { name: "kotak minuman", emoji: "🧃" }
  ];

  const shuffledFoods = shuffle(foodItems);
  const allArabicNumerals = ARABIC_NUMBERS.map((n) => n.arabicNumeral);
  const usedCounts = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).slice(0, 5);

  return usedCounts.map((count, idx) => {
    const food = shuffledFoods[idx % shuffledFoods.length];
    const numData = ARABIC_NUMBERS.find((n) => n.number === count);
    const wrongOptions = getDistractors(numData.arabicNumeral, allArabicNumerals);

    return {
      id: `canteen_q${idx + 1}`,
      type: "count_food",
      title: `Misi Kantin (Soalan ${idx + 1}/5)`,
      question: `Berapakah jumlah ${food.name} yang dipaparkan? Pilih angka Arab yang betul:`,
      count: count,
      itemEmoji: food.emoji,
      itemName: food.name,
      correctAnswer: numData.arabicNumeral,
      options: shuffle([numData.arabicNumeral, ...wrongOptions]),
      isArabicChoices: true,
      explanation: `Terdapat ${count} ${food.name} (${numData.arabicNumeral}).`
    };
  });
}

/**
 * 3. Side Quest Padang: Misi Mengira Peralatan Sukan (5 Soalan)
 * Fokus: Jumlah objek -> Perkataan nombor Bahasa Arab (pilihan jawapan perkataan Arab berbaris)
 */
export function generateFieldSportsQuestions() {
  const sportsItems = [
    { name: "biji bola sepak", emoji: "⚽" },
    { name: "biji bola keranjang", emoji: "🏀" },
    { name: "batang raket", emoji: "🏸" },
    { name: "keping pingat sukan", emoji: "🥇" },
    { name: "biji bola tenis", emoji: "🎾" }
  ];

  const shuffledSports = shuffle(sportsItems);
  const allArabicWords = ARABIC_NUMBERS.map((n) => n.arabicWord);
  const usedCounts = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).slice(0, 5);

  return usedCounts.map((count, idx) => {
    const sport = shuffledSports[idx % shuffledSports.length];
    const numData = ARABIC_NUMBERS.find((n) => n.number === count);
    const wrongOptions = getDistractors(numData.arabicWord, allArabicWords);

    return {
      id: `field_q${idx + 1}`,
      type: "count_sports",
      title: `Misi Padang (Soalan ${idx + 1}/5)`,
      question: `Kira ${sport.name} di padang. Apakah perkataan Bahasa Arab yang betul bagi jumlah ini?`,
      count: count,
      itemEmoji: sport.emoji,
      itemName: sport.name,
      correctAnswer: numData.arabicWord,
      options: shuffle([numData.arabicWord, ...wrongOptions]),
      isArabicWordsChoices: true,
      explanation: `Jumlah ${sport.name} ialah ${count} iaitu ${numData.arabicWord} (${numData.transliteration}).`
    };
  });
}

/**
 * 4. Ujian Akhir Bahasa Arab Bersama Ustaz Alif (Tepat 10 Soalan)
 * Campuran 4 kemahiran padanan nombor dan perkataan Arab tanpa gambar
 */
export function generateFinalExamQuestions() {
  const allArabicNumerals = ARABIC_NUMBERS.map((n) => n.arabicNumeral);
  const allArabicWords = ARABIC_NUMBERS.map((n) => n.arabicWord);
  const allRegularNumbers = ARABIC_NUMBERS.map((n) => n.number.toString());

  const questions = [];

  // Jenis A: Angka biasa -> pilih angka Arab (3 soalan)
  const numsA = shuffle(ARABIC_NUMBERS).slice(0, 3);
  numsA.forEach((item) => {
    const wrong = getDistractors(item.arabicNumeral, allArabicNumerals);
    questions.push({
      type: "numeral_to_arabic",
      title: "Ujian Bahasa Arab",
      question: `Pilih angka Arab bagi nombor ${item.number}:`,
      highlight: item.number.toString(),
      correctAnswer: item.arabicNumeral,
      options: shuffle([item.arabicNumeral, ...wrong]),
      isArabicChoices: true,
      explanation: `Nombor ${item.number} ialah ${item.arabicNumeral}.`
    });
  });

  // Jenis B: Angka Arab -> pilih angka biasa (2 soalan)
  const numsB = shuffle(ARABIC_NUMBERS.filter((n) => !numsA.includes(n))).slice(0, 2);
  numsB.forEach((item) => {
    const wrong = getDistractors(item.number.toString(), allRegularNumbers);
    questions.push({
      type: "arabic_to_numeral",
      title: "Ujian Bahasa Arab",
      question: `Apakah nombor biasa bagi angka Arab "${item.arabicNumeral}"?`,
      highlight: item.arabicNumeral,
      isArabicHighlight: true,
      correctAnswer: item.number.toString(),
      options: shuffle([item.number.toString(), ...wrong]),
      explanation: `Angka Arab ${item.arabicNumeral} bersamaan dengan nombor ${item.number}.`
    });
  });

  // Jenis C: Angka Arab -> pilih perkataan Arab (3 soalan)
  const numsC = shuffle(ARABIC_NUMBERS).slice(0, 3);
  numsC.forEach((item) => {
    const wrong = getDistractors(item.arabicWord, allArabicWords);
    questions.push({
      type: "arabic_to_word",
      title: "Ujian Bahasa Arab",
      question: `Apakah perkataan Arab bagi angka Arab "${item.arabicNumeral}"?`,
      highlight: item.arabicNumeral,
      isArabicHighlight: true,
      correctAnswer: item.arabicWord,
      options: shuffle([item.arabicWord, ...wrong]),
      isArabicWordsChoices: true,
      explanation: `Angka ${item.arabicNumeral} berbunyi ${item.arabicWord} (${item.transliteration}).`
    });
  });

  // Jenis D: Perkataan Arab -> pilih angka Arab (2 soalan)
  const numsD = shuffle(ARABIC_NUMBERS.filter((n) => !numsC.includes(n))).slice(0, 2);
  numsD.forEach((item) => {
    const wrong = getDistractors(item.arabicNumeral, allArabicNumerals);
    questions.push({
      type: "word_to_arabic",
      title: "Ujian Bahasa Arab",
      question: `Pilih angka Arab bagi perkataan "${item.arabicWord}":`,
      highlight: item.arabicWord,
      isArabicHighlight: true,
      correctAnswer: item.arabicNumeral,
      options: shuffle([item.arabicNumeral, ...wrong]),
      isArabicChoices: true,
      explanation: `${item.arabicWord} (${item.transliteration}) ialah angka ${item.arabicNumeral}.`
    });
  });

  // Susun semula 10 soalan ini secara rawak
  const shuffledExam = shuffle(questions);
  return shuffledExam.slice(0, 10);
}
