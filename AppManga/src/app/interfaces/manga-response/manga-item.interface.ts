import { JikanImages } from '../common/jikan-images/jikan-images.interface';

/**
 * Contrato de cable (DTO) de un manga tal como lo devuelve la API Jikan v4.
 * Es la forma "cruda" que entra desde HTTP: el modelo de dominio MangaModel
 * implementa esta interfaz y la sanea en sus setters antes de guardarse.
 */
export interface JikanMangaItem {
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
