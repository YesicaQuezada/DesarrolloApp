import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
} from 'firebase/firestore';
import { getCurrentUser } from 'aws-amplify/auth';

import { firebaseApp } from '../../config/firebase/firebase';

/** Tipo de medio favorito, alineado con los segmentos de la UI. */
export type FavoritoTipo = 'anime' | 'manga';

/** Documento guardado en users/{uid}/favorites/{tipo}_{malId}. */
export interface Favorito {
  mediaId: number;
  type: FavoritoTipo;
  title: string;
  image: string;
  addedAt: Date;
}

/** Error controlado: no hay sesión de Cognito activa. */
export class SinSesionError extends Error {
  constructor() {
    super('Se requiere iniciar sesión para usar favoritos.');
    this.name = 'SinSesionError';
  }
}

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly db: Firestore = getFirestore(firebaseApp);

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

  private favRef(uid: string, tipo: FavoritoTipo, mediaId: number) {
    // Doc id determinista → agregar/quitar es un set/delete sin duplicados.
    return doc(this.db, 'users', uid, 'favorites', `${tipo}_${mediaId}`);
  }

  /**
   * @function listar
   * @description Favoritos de un tipo para el usuario actual, ordenados por título.
   */
  async listar(tipo: FavoritoTipo): Promise<Favorito[]> {
    const uid = await this.uidActual();
    const snap = await getDocs(collection(this.db, 'users', uid, 'favorites'));

    return snap.docs
      .map((d) => d.data() as Favorito)
      .filter((f) => f.type === tipo)
      .sort((a, b) => a.title.localeCompare(b.title));
  }

  /**
   * @function esFavorito
   * @description true si el medio ya está marcado como favorito.
   */
  async esFavorito(tipo: FavoritoTipo, mediaId: number): Promise<boolean> {
    const uid = await this.uidActual();
    const snap = await getDoc(this.favRef(uid, tipo, mediaId));
    return snap.exists();
  }

  /**
   * @function agregar
   * @description Guarda (o reemplaza) un favorito del usuario actual.
   */
  async agregar(favorito: Favorito): Promise<void> {
    const uid = await this.uidActual();
    const { addedAt, ...datos } = favorito;
    await setDoc(this.favRef(uid, favorito.type, favorito.mediaId), {
      ...datos,
      addedAt: addedAt.toISOString(),
    });
  }

  /**
   * @function quitar
   * @description Elimina un favorito; no falla si ya no existía.
   */
  async quitar(tipo: FavoritoTipo, mediaId: number): Promise<void> {
    const uid = await this.uidActual();
    await deleteDoc(this.favRef(uid, tipo, mediaId));
  }
}
