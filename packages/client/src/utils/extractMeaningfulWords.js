export const extractMeaningfulWords = (quote) => {
  const stopWords = new Set([
    'the',
    'to',
    'a',
    'an',
    'in',
    'on',
    'at',
    'for',
    'with',
    'by',
    'and',
    'or',
    'but',
    'if',
    'then',
    'else',
    'of',
    'you',
    'your',
    'is',
    'are',
    'was',
    'were',
    'be',
    'been',
    'being',
    'do',
    'does',
    'did',
    'have',
    'has',
    'had',
    'will',
    'would',
    'can',
    'could',
    'should',
    'may',
    'might',
    'must',
    'shall',
    'it',
  ]);

  const words = quote
    ?.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((word) => word && !stopWords.has(word));

  return Array.from(new Set(words)); // removes duplicates
};
