import { JikanImages } from '../manga/manga.model';

export interface AnimeModel {
  mal_id: number;
  title: string;
  title_english: string | null;
  images: JikanImages;
  score: number | null;
  status: string;
  type: string;
  episodes: number | null;
  synopsis: string | null;
}

export interface JikanAnimeResponse {
  data: AnimeModel[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
}
