import { JikanImages } from '../../interfaces/common/jikan-images/jikan-images.interface';

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
