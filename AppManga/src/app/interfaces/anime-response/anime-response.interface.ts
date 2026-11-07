import { JikanAnimeItem } from './anime-item.interface';
import { JikanPagination } from '../common/paginacion/paginacion.interface';

/** Envelope de la respuesta de Jikan para el listado de animes (capa DTO). */
export interface JikanAnimeResponse {
  data: JikanAnimeItem[];
  pagination: JikanPagination;
}
