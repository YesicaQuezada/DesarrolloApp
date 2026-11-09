import { ItemJikan } from '../item-jikan/item-jikan.model';
import { JikanMangaItem } from '../../interfaces/manga-response/manga-item.interface';

/**
 * Modelo de dominio de un manga.
 *
 * Implementa el contrato de cable `JikanMangaItem`, pero guarda el estado en
 * campos privados (los de esta clase y los de `ItemJikan`): la única puerta de
 * entrada desde la API es `MangaModel.fromJSON()`, que sanea cada valor.
 */
export class MangaModel extends ItemJikan implements JikanMangaItem {
  private _chapters: number | null = null;
  private _volumes: number | null = null;

  get chapters(): number | null {
    return this._chapters;
  }
  set chapters(valor: unknown) {
    this._chapters = ItemJikan.enteroNoNegativo(valor);
  }

  get volumes(): number | null {
    return this._volumes;
  }
  set volumes(valor: unknown) {
    this._volumes = ItemJikan.enteroNoNegativo(valor);
  }

  protected override asignar(datos: Record<string, unknown>): void {
    super.asignar(datos);
    this.chapters = datos['chapters'];
    this.volumes = datos['volumes'];
  }

  /**
   * Crea un manga desde el JSON crudo de Jikan.
   * Cualquier cosa que no sea un objeto produce un manga vacío (mal_id 0).
   */
  static fromJSON(raw: unknown): MangaModel {
    const manga = new MangaModel();
    if (ItemJikan.esObjeto(raw)) {
      manga.asignar(raw);
    }
    return manga;
  }

  /**
   * Crea la lista de mangas desde `data` de la respuesta de Jikan.
   * Descarta entradas que no son objetos o que no tienen `mal_id` válido.
   */
  static fromJSONArray(raw: unknown): MangaModel[] {
    return ItemJikan.deLista(raw, (datos) => MangaModel.fromJSON(datos));
  }
}
