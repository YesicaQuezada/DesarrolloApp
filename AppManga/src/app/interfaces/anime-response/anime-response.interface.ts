import { AnimeModel } from '../../models/anime/anime.model';
import { JikanPagination } from '../common/paginacion/paginacion.interface';

export interface JikanAnimeResponse {
  data: AnimeModel[];
  pagination: JikanPagination;
}
