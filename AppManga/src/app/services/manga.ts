import { Injectable } from '@angular/core';

export interface Manga {
  id: number;
  titulo: string;
  autor: string;
  genero: string;
  imagen: string;
}

@Injectable({ providedIn: 'root' })
export class MangaService {
  private mangas: Manga[] = [
    { id: 1, titulo: 'One Piece', autor: 'Eiichiro Oda', genero: 'Aventura',
      imagen: 'https://placehold.co/300x420?text=One+Piece' },
    { id: 2, titulo: 'Naruto', autor: 'Masashi Kishimoto', genero: 'Acción',
      imagen: 'https://placehold.co/300x420?text=Naruto' },
    { id: 3, titulo: 'Death Note', autor: 'Tsugumi Ohba', genero: 'Suspenso',
      imagen: 'https://placehold.co/300x420?text=Death+Note' },
  ];

  obtenerTodos(): Manga[] {
    return this.mangas;
  }

  buscar(termino: string): Manga[] {
    const normalizar = (t: string) =>
      t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

    const q = normalizar(termino);
    if (!q) return this.mangas;

    return this.mangas.filter(m =>
      normalizar(`${m.titulo} ${m.autor} ${m.genero}`).includes(q)
    );
  }
}