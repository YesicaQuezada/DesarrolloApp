import { JikanImages } from '../../interfaces/common/jikan-images/jikan-images.interface';

export interface MangaModel {
  mal_id: number;
  title: string;
  title_english: string | null;
  images: JikanImages;
  score: number | null;
  status: string;
  type: string;
  chapters: number | null;
  volumes: number | null;
  synopsis: string | null;
}
