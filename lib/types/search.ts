import { Entry } from "./songs";

export type SearchCategory = 'all' | 'albums' | 'artists' | 'latest';

export type Suggestion = {
  id: string;
  label: string;
  category: SearchCategory;
  data: Entry;
};

export type NormalizeAlbums = {
  entry: Entry;
  name: string;
  artist: string;
  year: number | string;
  label: string;
  id: string;
  image: string;
};
