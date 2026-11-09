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
   * @function esFavorito
   * @description true si el medio ya está marcado como favorito.
   */
  async esFavorito(tipo: FavoritoTipo, mediaId: number): Promise<boolean> {
    const uid = await this.uidActual();
    const snap = await get(this.favRef(uid, tipo, mediaId));
    return snap.exists();
  }

  /**
   * @function agregar
   * @description Guarda (o reemplaza) un favorito del usuario actual.
   */
  async agregar(favorito: Favorito): Promise<void> {
    const uid = await this.uidActual();
    await set(this.favRef(uid, favorito.type, favorito.mediaId), favorito.toJSON());
  }

  /**
   * @function quitar
   * @description Elimina un favorito; no falla si ya no existía.
   */
  async quitar(tipo: FavoritoTipo, mediaId: number): Promise<void> {
    const uid = await this.uidActual();
    await remove(this.favRef(uid, tipo, mediaId));
  }
}
