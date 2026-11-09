import { JikanImages } from '../../interfaces/common/jikan-images/jikan-images.interface';
import { JikanImageSet } from '../../interfaces/common/jikan-image-set/jikan-image-set.interface';

/**
 * Base de dominio de los ítems que vienen de la API de Jikan (manga/anime).
 *
 * Principios de la clase:
 * - Los datos crudos de la API entran solo por `asignar()` (vía `fromJSON` de
 *   las subclases): nada se "cuelga" en el objeto sin pasar por un setter.
 * - Los campos son privados y se exponen por getters/setters; los setters
 *   **sanean y coaccionan** (tolerantes: nunca lanzan) para que la UI siempre
 *   reciba un estado utilizable aunque la API mande basura.
 * - `mal_id` es identidad: solo tiene getter, no cambia después de creado.
 */
export abstract class ItemJikan {
  private _malId = 0;
  private _title = 'Sin título';
  private _titleEnglish: string | null = null;
  private _images: JikanImages = ItemJikan.imagesVacias();
  private _score: number | null = null;
  private _status = 'Desconocido';
  private _type = 'Desconocido';
  private _synopsis: string | null = null;

  // ---------- Identidad (solo lectura) ----------

  get mal_id(): number {
    return this._malId;
  }

  // ---------- Atributos editables (setters tolerantes) ----------

  get title(): string {
    return this._title;
  }
  set title(valor: unknown) {
    this._title = ItemJikan.texto(valor, 'Sin título');
  }

  get title_english(): string | null {
    return this._titleEnglish;
  }
  set title_english(valor: unknown) {
    this._titleEnglish = ItemJikan.textoOPermitido(valor);
  }

  get images(): JikanImages {
    return this._images;
  }
  set images(valor: unknown) {
    this._images = ItemJikan.normalizarImages(valor);
  }

  get score(): number | null {
    return this._score;
  }
  set score(valor: unknown) {
    this._score = ItemJikan.decimalEnRango(valor, 0, 10);
  }

  get status(): string {
    return this._status;
  }
  set status(valor: unknown) {
    this._status = ItemJikan.texto(valor, 'Desconocido');
  }

  get type(): string {
    return this._type;
  }
  set type(valor: unknown) {
    this._type = ItemJikan.texto(valor, 'Desconocido');
  }

  get synopsis(): string | null {
    return this._synopsis;
  }
  set synopsis(valor: unknown) {
    this._synopsis = ItemJikan.textoOPermitido(valor);
  }

  // ---------- Construcción desde datos crudos ----------

  /**
   * Asigna los campos comunes desde un JSON crudo, siempre por setter
   * (nunca se escribe un campo privado sin sanear, salvo la identidad).
   */
  protected asignar(datos: Record<string, unknown>): void {
    this._malId = ItemJikan.enteroPositivo(datos['mal_id']);
    this.title = datos['title'];
    this.title_english = datos['title_english'];
    this.images = datos['images'];
    this.score = datos['score'];
    this.status = datos['status'];
    this.type = datos['type'];
    this.synopsis = datos['synopsis'];
  }

  /** Mapea una lista cruda de la API a modelos de dominio, descartando la basura. */
  protected static deLista<T extends ItemJikan>(
    raw: unknown,
    crear: (datos: Record<string, unknown>) => T
  ): T[] {
    if (!Array.isArray(raw)) return [];
    return raw
      .filter((item): item is Record<string, unknown> => ItemJikan.esObjeto(item))
      .map(crear)
      .filter((item) => item.mal_id > 0);
  }

  // ---------- Coerciones (tolerantes: coaccionan, nunca lanzan) ----------

  protected static esObjeto(valor: unknown): valor is Record<string, unknown> {
    return typeof valor === 'object' && valor !== null;
  }

  /** Texto no vacío tras trim; si no hay nada, devuelve el valor por defecto. */
  protected static texto(valor: unknown, porDefecto: string): string {
    const limpio = typeof valor === 'string' ? valor.trim() : '';
    return limpio.length > 0 ? limpio : porDefecto;
  }

  /** Texto no vacío tras trim; si no hay nada, `null`. */
  protected static textoOPermitido(valor: unknown): string | null {
    const limpio = typeof valor === 'string' ? valor.trim() : '';
    return limpio.length > 0 ? limpio : null;
  }

  /** Número entero ≥ 1; cualquier otra cosa → 0. */
  protected static enteroPositivo(valor: unknown): number {
    return typeof valor === 'number' && Number.isFinite(valor) && valor >= 1
      ? Math.trunc(valor)
      : 0;
  }

  /** Número entero ≥ 0 o `null`. */
  protected static enteroNoNegativo(valor: unknown): number | null {
    return typeof valor === 'number' && Number.isFinite(valor) && valor >= 0
      ? Math.trunc(valor)
      : null;
  }

  /** Número dentro de [min, max] o `null` (fuera de rango/no numérico). */
  protected static decimalEnRango(valor: unknown, min: number, max: number): number | null {
    return typeof valor === 'number' && Number.isFinite(valor) && valor >= min && valor <= max
      ? valor
      : null;
  }

  /** Estructura de imágenes completa con strings (faltantes → cadena vacía). */
  protected static normalizarImages(valor: unknown): JikanImages {
    const fuente = ItemJikan.esObjeto(valor) ? valor : {};
    return {
      jpg: ItemJikan.normalizarImageSet(fuente['jpg']),
      webp: ItemJikan.normalizarImageSet(fuente['webp']),
    };
  }

  private static normalizarImageSet(valor: unknown): JikanImageSet {
    const fuente = ItemJikan.esObjeto(valor) ? valor : {};
    const url = (campo: string): string =>
      typeof fuente[campo] === 'string' ? (fuente[campo] as string) : '';
    return {
      image_url: url('image_url'),
      small_image_url: url('small_image_url'),
      large_image_url: url('large_image_url'),
    };
  }

  private static imagesVacias(): JikanImages {
    return ItemJikan.normalizarImages(null);
  }
}
