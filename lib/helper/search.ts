// Enhanced built-in search with regex sequence matching and diacritics-insensitive normalization.
// Keeps the original API: buildSuggestionsManual(albums, rawQuery, category, limit) => Suggestion[]
import { NormalizeAlbums, SearchCategory, Suggestion } from '../types/search';

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Normalize a string: NFD + strip diacritics + lowercase + trim
function normalizeForSearch(s: string) {
  if (!s) return '';
  // decompose combined graphemes, then strip combining diacritic marks (U+0300..U+036F)
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Enhanced manual suggestions builder
 *
 * - Uses includes() checks (fast) first
 * - Then applies a "sequence" regex that matches characters in the query in order,
 *   e.g. query "hlo" matches "Hello" because h.*?l.*?o
 * - Works diacritics-insensitive (Café matches Cafe)
 * - Keeps category filtering behavior (all/albums/artists/latest)
 */
export function buildSuggestionsManual(
  albums: NormalizeAlbums[],
  rawQuery: string,
  category: SearchCategory,
  limit = 5
): Suggestion[] {
  const query = (rawQuery || '').trim();
  if (!query) return [];

  const currentYear = new Date().getFullYear();

  const normalizedQuery = normalizeForSearch(query);
  // sequence pattern: remove spaces from query so "hl o" still creates sequence "h.*?l.*?o"
  const seqSource = normalizedQuery.replace(/\s+/g, '');
  // if user types regex-like tokens intentionally, we escape them for safe regex
  const sequencePattern = seqSource.split('').map(escapeRegExp).join('.*?');
  const sequenceRegex = new RegExp(sequencePattern, 'i'); // case-insensitive

  const results = albums
    .filter((candidate) => {
      const nameNorm = normalizeForSearch(candidate.name ?? '');
      const artistNorm = normalizeForSearch(candidate.artist ?? '');
      const yearNum = candidate.year

      const matchesNameIncludes = nameNorm.includes(normalizedQuery);
      const matchesArtistIncludes = artistNorm.includes(normalizedQuery);

      const matchesNameSequence = sequenceRegex.test(nameNorm);
      const matchesArtistSequence = sequenceRegex.test(artistNorm);

      switch (category) {
        case 'all':
          // match by includes OR by sequence OR (latest-year && includes/sequence)
          return (
            matchesNameIncludes ||
            matchesArtistIncludes ||
            matchesNameSequence ||
            matchesArtistSequence ||
            (yearNum === currentYear && (matchesNameIncludes || matchesArtistIncludes || matchesNameSequence || matchesArtistSequence))
          );
        case 'albums':
          return matchesNameIncludes || matchesNameSequence;
        case 'artists':
          return matchesArtistIncludes || matchesArtistSequence;
        case 'latest':
          return (
            yearNum === currentYear &&
            (matchesNameIncludes || matchesArtistIncludes || matchesNameSequence || matchesArtistSequence)
          );
        default:
          return false;
      }
    })
    .slice(0, limit)
    .map((album) => ({
      id: album.id,
      label: album.label,
      category,
      data: album.entry,
    }));

  return results;
}