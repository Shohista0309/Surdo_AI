import { sampleExpressions } from './expressionsData';
import { SignExpression, SignSequenceToken } from '../types';

// Map of canonical words and synonyms to verified expressions
export const verifiedSignDictionary: Record<string, SignExpression> = {};

sampleExpressions.forEach(exp => {
  const key = exp.word.toLowerCase().trim();
  verifiedSignDictionary[key] = exp;
});

// Additional synonyms / common variations in Uzbek
const synonymMap: Record<string, string> = {
  'salom': 'assalomu alaykum',
  'assalom': 'assalomu alaykum',
  'tashakkur': 'rahmat',
  'ona': 'ona (onajon)',
  'onam': 'ona (onajon)',
  'onajon': 'ona (onajon)',
  'ota': 'ota (otajon)',
  'otam': 'ota (otajon)',
  'otajon': 'ota (otajon)',
  'suv': 'suv',
  'suvni': 'suv',
  'non': 'non',
  'nonni': 'non',
  'kitob': 'kitob',
  'kitoblar': 'kitob',
  'maktab': 'maktab',
  'maktabga': 'maktab',
  'yaxshi': 'yaxshi (ajoyib)',
  'zo‘r': 'yaxshi (ajoyib)',
  'zor': 'yaxshi (ajoyib)',
  'yordam': 'yordam bermoq',
  'yordamlashmoq': 'yordam bermoq',
  'do‘st': 'do‘st (o‘rtoq)',
  'dost': 'do‘st (o‘rtoq)',
  'shifokor': 'shifokor (do‘xtir)',
  'vrach': 'shifokor (do‘xtir)'
};

/**
 * Modular translation pipeline:
 * Analyzes input sentence into tokens, matches against verified sign lexicon,
 * and identifies unmapped words honestly.
 */
export function analyzeTextForSigns(inputText: string): {
  tokens: SignSequenceToken[];
  verifiedCount: number;
  totalTokens: number;
  hasUnmatched: boolean;
} {
  if (!inputText.trim()) {
    return { tokens: [], verifiedCount: 0, totalTokens: 0, hasUnmatched: false };
  }

  // Check multi-word verified phrases first (e.g., "Assalomu alaykum", "Yordam bermoq")
  const normalized = inputText.toLowerCase().replace(/[.,!?;:()"]/g, ' ').trim();
  const rawWords = normalized.split(/\s+/).filter(Boolean);

  const tokens: SignSequenceToken[] = [];
  let i = 0;

  while (i < rawWords.length) {
    // Check 2-word phrase
    if (i + 1 < rawWords.length) {
      const twoWord = `${rawWords[i]} ${rawWords[i + 1]}`;
      if (verifiedSignDictionary[twoWord]) {
        tokens.push({
          originalWord: `${rawWords[i]} ${rawWords[i + 1]}`,
          matchedSign: verifiedSignDictionary[twoWord],
          isVerified: verifiedSignDictionary[twoWord].isVerified,
          actionNote: verifiedSignDictionary[twoWord].movement
        });
        i += 2;
        continue;
      }
    }

    const singleWord = rawWords[i];
    const canonicalKey = synonymMap[singleWord] || singleWord;
    const match = verifiedSignDictionary[canonicalKey] || verifiedSignDictionary[singleWord];

    if (match) {
      tokens.push({
        originalWord: singleWord,
        matchedSign: match,
        isVerified: match.isVerified,
        actionNote: match.movement
      });
    } else {
      tokens.push({
        originalWord: singleWord,
        matchedSign: undefined,
        isVerified: false,
        actionNote: 'Hozircha tizim bazasida ushbu so‘z bo‘yicha tekshirilgan imo-ishora mavjud emas'
      });
    }
    i++;
  }

  const verifiedCount = tokens.filter(t => t.matchedSign && t.isVerified).length;
  const hasUnmatched = tokens.some(t => !t.matchedSign || !t.isVerified);

  return {
    tokens,
    verifiedCount,
    totalTokens: tokens.length,
    hasUnmatched
  };
}

export const quickPromptPresets = [
  'Assalomu alaykum',
  'Rahmat, sizga!',
  'Suv va non',
  'Maktab va kitob',
  'Onam va otam',
  'Yordam bera olasizmi?',
  'Juda yaxshi natija'
];
