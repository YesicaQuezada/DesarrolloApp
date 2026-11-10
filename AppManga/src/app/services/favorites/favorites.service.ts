import { Injectable, inject } from '@angular/core';
import {
  Database,
  get,
  getDatabase,
  ref,
  remove,
  set,
} from 'firebase/database';
import { getCurrentUser } from 'aws-amplify/auth';

import { firebaseApp } from '../../config/firebase/firebase';
import { Favorito, FavoritoTipo } from '../../models/favorito/favorito.model';

/** Error controlado: no hay sesión de Cognito activa. */
export class SinSesionError extends Error {
  constructor() {
    super('Se requiere iniciar sesión para usar favoritos.');
    this.name = 'SinSesionError';
  }
}

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly db: Database = getDatabase(firebaseApp);
  private readonly favoritosCache = new Map<FavoritoTipo, Set<number>>();

  /**
   * @function uidActual
   * @description Identidad del usuario: sub de Cognito (userId de Amplify).
   * Lanza SinSesionError si no hay sesión activa.
   */
  private async uidActual(): Promise<string> {
    try {
      const user = await getCurrentUser();
      if (!user?.userId) throw new SinSesionError();
      return user.userId;
    } catch (error) {
      if (error instanceof SinSesionError) throw error;
      throw new SinSesionError();
    }
  }

  /**
   * Ruta determinista `users/{uid}/favorites/{tipo}_{mediaId}` → agregar y
   * quitar son un set/remove sin duplicados.
   */
  private favRef(uid: string, tipo: FavoritoTipo, mediaId: number) {
    return ref(this.db, `users/${uid}/favorites/${tipo}_${mediaId}`);
  }

  /**
   * @function listar
   * @description Favoritos de un tipo para el usuario actual, ordenados por título.
   */
  async listar(tipo: FavoritoTipo): Promise<Favorito[]> {
    const uid = await this.uidActual();
    const snap = await get(ref(this.db, `users/${uid}/favorites`));

    const favoritos: Favorito[] = [];
    // forEach recorre los hijos; si la rama no existe no se invoca y queda [].
    snap.forEach((hijo) => {
      const favorito = Favorito.fromJSON(hijo.val());
      if (favorito !== null && favorito.type === tipo) favoritos.push(favorito);
    });

    return favoritos.sort((a, b) => a.title.localeCompare(b.title));
  }

  /**
   * @function refrescarTipo
   * @description Actualiza el caché del tipo solicitado con los favoritos reales
   * de la RTDB para que todas las vistas compartan el mismo estado.
   */
  async refrescarTipo(tipo: FavoritoTipo): Promise<Set<number>> {
    const ids = new Set<number>();
    const favoritos = await this.listar(tipo);
    favoritos.forEach((favorito) => ids.add(favorito.mediaId));
    this.favoritosCache.set(tipo, ids);
    return ids;
  }

  /**
   * @function esFavorito
   * @description true si el medio ya está marcado como favorito.
   */
  async esFavorito(tipo: FavoritoTipo, mediaId: number): Promise<boolean> {
    const cache = this.favoritosCache.get(tipo);
    if (cache) {
      return cache.has(mediaId);
    }

    const ids = await this.refrescarTipo(tipo);
    return ids.has(mediaId);
  }

  /**
   * @function agregar
   * @description Guarda (o reemplaza) un favorito del usuario actual.
   */
  async agregar(favorito: Favorito): Promise<void> {
    const uid = await this.uidActual();
    await set(this.favRef(uid, favorito.type, favorito.mediaId), favorito.toJSON());
    const cacheActual = this.favoritosCache.get(favorito.type) ?? new Set<number>();
    cacheActual.add(favorito.mediaId);
    this.favoritosCache.set(favorito.type, cacheActual);
  }

  /**
   * @function quitar
   * @description Elimina un favorito; no falla si ya no existía.
   */
  async quitar(tipo: FavoritoTipo, mediaId: number): Promise<void> {
    const uid = await this.uidActual();
    await remove(this.favRef(uid, tipo, mediaId));
    const cacheActual = this.favoritosCache.get(tipo) ?? new Set<number>();
    cacheActual.delete(mediaId);
    this.favoritosCache.set(tipo, cacheActual);
  }
}
