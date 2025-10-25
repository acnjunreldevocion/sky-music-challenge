import { buildSuggestionsManual } from '@/lib/searchHelper';
import type { NormalizeAlbums } from '@/lib/searchHelper';

describe('buildSuggestionsManual (enhanced matching)', () => {
  const nowIso = new Date().toISOString();

  const normalizedAlbums: NormalizeAlbums[] = [
    {
      entry: { id: { attributes: { 'im:id': '1' } } },
      name: 'Hello World',
      artist: 'Artist A',
      year: nowIso, // current year -> latest
      label: 'Hello World - Artist A',
      id: '1',
      image: 'https://example.com/img1.jpg',
    },
    {
      entry: { id: { attributes: { 'im:id': '2' } } },
      name: 'Café del Mar',
      artist: 'Chill Artist',
      year: 2019,
      label: 'Café del Mar - Chill Artist',
      id: '2',
      image: 'https://example.com/img2.jpg',
    },
    {
      entry: { id: { attributes: { 'im:id': '3' } } },
      name: 'Goodbye',
      artist: 'Artist B',
      year: 2000,
      label: 'Goodbye - Artist B',
      id: '3',
      image: 'https://example.com/img3.jpg',
    },
    {
      entry: { id: { attributes: { 'im:id': '3' } } },
      name: 'Lover',
      artist: 'Lover B',
      year: 2025,
      label: 'Lover - Lover B',
      id: '3',
      image: 'https://example.com/img3.jpg',
    },
  ] as unknown as NormalizeAlbums[];

  it('returns empty array for empty or whitespace-only queries', () => {
    expect(buildSuggestionsManual(normalizedAlbums, '', 'all')).toEqual([]);
    expect(buildSuggestionsManual(normalizedAlbums, '   ', 'albums')).toEqual([]);
  });

  it('matches sequence characters in-order (non-contiguous) in album name', () => {
    // 'hlo' should match Hello World (h.*?l.*?o)
    const res = buildSuggestionsManual(normalizedAlbums, 'hlo', 'albums');
    expect(res.length).toBeGreaterThanOrEqual(1);
    expect(res[0].id).toBe('1');
  });

  it('is diacritics-insensitive (cafe matches Café)', () => {
    const res = buildSuggestionsManual(normalizedAlbums, 'cafe', 'albums');
    expect(res.length).toBeGreaterThanOrEqual(1);
    expect(res[0].id).toBe('2');
  });

  it('matches artist via sequence matching and respects "artists" category', () => {
    // 'chl' should match 'Chill Artist'
    const res = buildSuggestionsManual(normalizedAlbums, 'chl', 'artists');
    expect(res.some((s) => s.id === '2')).toBe(true);
  });

  it('respects latest category year filtering', () => {
    // "hello" is current year in our fixture and should show up under 'latest'
    const resLatest = buildSuggestionsManual(normalizedAlbums, 'lover', 'latest');
    expect(resLatest).toHaveLength(1);
    expect(resLatest[0].id).toBe('3');

    // "cafe" is not latest and should not appear in latest
    const resLatestNone = buildSuggestionsManual(normalizedAlbums, 'cafe', 'latest');
    expect(resLatestNone).toHaveLength(0);
  });

  it('respects the limit parameter', () => {
    // Build many matching entries to test limit behavior
    const many = new Array(10).fill(null).map((_, i) => ({
      entry: { id: { attributes: { 'im:id': String(100 + i) } } },
      name: `Track ${i}`,
      artist: 'Artist A',
      year: '2010-01-01T00:00:00Z',
      label: `Track ${i} - Artist A`,
      id: String(100 + i),
      image: '',
    })) as unknown as NormalizeAlbums[];

    const pool = [...many, ...normalizedAlbums];
    const defaultLimit = buildSuggestionsManual(pool, 'track', 'albums'); // default limit = 5
    expect(defaultLimit).toHaveLength(5);

    const customLimit = buildSuggestionsManual(pool, 'track', 'albums', 8);
    expect(customLimit).toHaveLength(8);
  });

  it('returns suggestions with the expected shape', () => {
    const res = buildSuggestionsManual(normalizedAlbums, 'hello', 'all');
    expect(res[0]).toMatchObject({
      id: '1',
      label: 'Hello World - Artist A',
      category: 'all',
    });
    expect(res[0].data).toBeDefined();
    expect((res[0].data).id.attributes['im:id']).toBe('1');
  });
});