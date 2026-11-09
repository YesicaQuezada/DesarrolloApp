/** Tipo de medio favorito, alineado con los segmentos de la UI. */
export type FavoritoTipo = 'anime' | 'manga';

/**
 * Modelo de dominio de un favorito guardado en la Realtime Database
 * (`users/{uid}/favorites/{tipo}_{malId}`).
 *
 * - `mediaId` es identidad: solo tiene getter.
 * - `type` solo admite `'anime' | 'manga'`; un valor desconocido cae en
 *   `'manga'` al construir por código propio, y `fromJSON()` prefiere
 *   **descartar** el registro (devuelve `null`) antes que guardarbasura.
 * - `addedAt` se coacciona a `Date` (acepta `Date` o string ISO — la forma en
 *   que se persiste); si no es interpretable queda en epoch (1970) en vez de
 *   romper.
 */
export class Favorito {
  private _mediaId = 0;
  private _type: FavoritoTipo = 'manga';
  private _title = 'Sin título';
  private _image = '';
  private _addedAt = new Date(0);

  constructor(datos: {
    mediaId: number;
    type: FavoritoTipo;
    title: string;
    image: string;
    addedAt?: Date | string | null;
  }) {
    this._mediaId = Favorito.enteroPositivo(datos?.mediaId);
    this._type = Favorito.esTipoValido(datos?.type) ? datos.type : 'manga';
    this.title = datos?.title;
    this.image = datos?.image;
    this.addedAt = datos?.addedAt;
  }

  // ---------- Identidad (solo lectura) ----------

  get mediaId(): number {
    return this._mediaId;
  }

  // ---------- Atributos editables (setters tolerantes) ----------

  get type(): FavoritoTipo {
    return this._type;
  }
  set type(valor: unknown) {
    this._type = Favorito.esTipoValido(valor) ? valor : 'manga';
  }

  get title(): string {
    return this._title;
  }
  set title(valor: unknown) {
    this._title = Favorito.texto(valor, 'Sin título');
  }

  get image(): string {
    return this._image;
  }
  set image(valor: unknown) {
    this._image = Favorito.texto(valor, '');
  }

  get addedAt(): Date {
    return this._addedAt;
  }
  set addedAt(valor: unknown) {
    this._addedAt = Favorito.aFecha(valor);
  }

  // ---------- Persistencia (Realtime Database) ----------

  /** Forma exacta que se guarda en la RTDB (addedAt como string ISO). */
  toJSON(): {
    mediaId: number;
    type: FavoritoTipo;
    title: string;
    image: string;
    addedAt: string;
  } {
    return {
      mediaId: this._mediaId,
      type: this._type,
      title: this._title,
      image: this._image,
      addedAt: this._addedAt.toISOString(),
    };
  }

  /**
   * Reconstruye el favorito desde el registro guardado en la RTDB.
   * Devuelve `null` (registro corrupto: se descarta) si no es un objeto, si
   * `mediaId` no es un entero positivo o si `type` no es `'anime'|'manga'`.
   */
  static fromJSON(raw: unknown): Favorito | null {
    if (!Favorito.esObjeto(raw)) return null;

    const mediaId = raw['mediaId'];
    const type = raw['type'];
    if (
      !(typeof mediaId === 'number' && Number.isFinite(mediaId) && mediaId >= 1) ||
      !Favorito.esTipoValido(type)
    ) {
      return null;
    }

    return new Favorito({
      mediaId,
      type,
      title: typeof raw['title'] === 'string' ? raw['title'] : '',
      image: typeof raw['image'] === 'string' ? raw['image'] : '',
      addedAt: raw['addedAt'] as Date | string | null | undefined,
    });
  }

  // ---------- Coerciones (tolerantes: coaccionan, nunca lanzan) ----------

  private static esObjeto(valor: unknown): valor is Record<string, unknown> {
    return typeof valor === 'object' && valor !== null;
  }

  private static esTipoValido(valor: unknown): valor is FavoritoTipo {
    return valor === 'anime' || valor === 'manga';
  }

  private static texto(valor: unknown, porDefecto: string): string {
    const limpio = typeof valor === 'string' ? valor.trim() : '';
    return limpio.length > 0 ? limpio : porDefecto;
  }

  private static enteroPositivo(valor: unknown): number {
    return typeof valor === 'number' && Number.isFinite(valor) && valor >= 1
      ? Math.trunc(valor)
      : 0;
  }

  /** Convierte a `Date` válido; lo no interpretable queda en epoch (1970). */
  private static aFecha(valor: unknown): Date {
    if (valor instanceof Date) {
      return Number.isNaN(valor.getTime()) ? new Date(0) : valor;
    }
    if (typeof valor === 'string' || typeof valor === 'number') {
      const fecha = new Date(valor);
      if (!Number.isNaN(fecha.getTime())) return fecha;
    }
    if (
      Favorito.esObjeto(valor) &&
      typeof valor['toMillis'] === 'function' &&
      Number.isFinite((valor['toMillis'] as () => number)())
    ) {
      return new Date((valor['toMillis'] as () => number)());
    }
    return new Date(0);
  }
}
