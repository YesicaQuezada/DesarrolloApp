import { JikanMangaItem } from './manga-item.interface';
import { JikanPagination } from '../common/paginacion/paginacion.interface';

/** Envelope de la respuesta de Jikan para el listado de mangas (capa DTO). */
export interface JikanMangaResponse {
  data: JikanMangaItem[];
  pagination: JikanPagination;
}
