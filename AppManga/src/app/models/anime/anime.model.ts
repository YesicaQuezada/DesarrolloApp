import { ItemJikan } from '../item-jikan/item-jikan.model';
import { JikanAnimeItem } from '../../interfaces/anime-response/anime-item.interface';

/**
 * Modelo de dominio de un anime.
 *
 * Implementa el contrato de cable `JikanAnimeItem`, pero guarda el estado en
 * campos privados (los de esta clase y los de `ItemJikan`): la única puerta de
 * entrada desde la API es `AnimeModel.fromJSON()`, que sanea cada valor.
 */
export class AnimeModel extends ItemJikan implements JikanAnimeItem {
  private _episodes: number | null = null;

  get episodes(): number | null {
    return this._episodes;
  }
  set episodes(valor: unknown) {
    this._episodes = ItemJikan.enteroNoNegativo(valor);
  }

  protected override asignar(datos: Record<string, unknown>): void {
    super.asignar(datos);
    this.episodes = datos['episodes'];
  }

  /**
   * Crea un anime desde el JSON crudo de Jikan.
   * Cualquier cosa que no sea un objeto produce un anime vacío (mal_id 0).
   */
  static fromJSON(raw: unknown): AnimeModel {
    const anime = new AnimeModel();
    if (ItemJikan.esObjeto(raw)) {
      anime.asignar(raw);
    }
    return anime;
  }

  /**
   * Crea la lista de animes desde `data` de la respuesta de Jikan.
   * Descarta entradas que no son objetos o que no tienen `mal_id` válido.
   */
  static fromJSONArray(raw: unknown): AnimeModel[] {
    return ItemJikan.deLista(raw, (datos) => AnimeModel.fromJSON(datos));
  }
}
