import { MangaModel } from '../../models/manga/manga.model';
import { JikanPagination } from '../common/paginacion/paginacion.interface';

export interface JikanMangaResponse {
  data: MangaModel[];
  pagination: JikanPagination;
}
