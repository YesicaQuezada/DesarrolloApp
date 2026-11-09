import { JikanImages } from '../common/jikan-images/jikan-images.interface';

/**
 * Contrato de cable (DTO) de un anime tal como lo devuelve la API Jikan v4.
 * Es la forma "cruda" que entra desde HTTP: el modelo de dominio AnimeModel
 * implementa esta interfaz y la sanea en sus setters antes de guardarse.
 */
export interface JikanAnimeItem {
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
