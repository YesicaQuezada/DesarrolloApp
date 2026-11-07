import { MangaModel } from './manga.model';
import { JikanMangaItem } from '../../interfaces/manga-response/manga-item.interface';

describe('MangaModel', () => {
  it('crea una instancia saneada desde el JSON crudo', () => {
    const manga = MangaModel.fromJSON({
      mal_id: 1,
      title: '  One Piece  ',
      title_english: 'One Piece',
      images: { jpg: { image_url: 'a', small_image_url: 'b', large_image_url: 'c' } },
      score: 8.7,
      status: 'Publishing',
      type: 'Manga',
      chapters: 1100,
      volumes: 105,
      synopsis: 'Piratas.',
    });

    expect(manga.mal_id).toBe(1);
    expect(manga.title).toBe('One Piece'); // trim
    expect(manga.score).toBe(8.7);
    expect(manga.chapters).toBe(1100);
    expect(manga.synopsis).toBe('Piratas.');
    // imágenes incompletas → estructura completa con cadenas vacías
    expect(manga.images.webp.large_image_url).toBe('');
  });

  it('implementa el contrato JikanMangaItem (capa DTO)', () => {
    const item: JikanMangaItem = MangaModel.fromJSON({ mal_id: 2, title: 'Naruto' });
    expect(item.mal_id).toBe(2);
    expect(item.chapters).toBeNull();
  });

  it('los setters coaccionan valores fuera de rango (tolerante, no lanza)', () => {
    const manga = MangaModel.fromJSON({ mal_id: 3, title: 'X' });

    manga.score = 99; // fuera de 0..10 → null
    manga.chapters = -5; // negativo → null
    manga.volumes = 'muchos'; // no numérico → null
    manga.title = '   '; // vacío → 'Sin título'
    manga.status = null; // → 'Desconocido'

    expect(manga.score).toBeNull();
    expect(manga.chapters).toBeNull();
    expect(manga.volumes).toBeNull();
    expect(manga.title).toBe('Sin título');
    expect(manga.status).toBe('Desconocido');
  });

  it('mal_id es identidad: no cambia después de creado', () => {
    const manga = MangaModel.fromJSON({ mal_id: 4, title: 'Y' });
    try {
      (manga as unknown as { mal_id: number }).mal_id = 99;
    } catch {
      // en modo estricto la asignación a un getter sin setter lanza TypeError
    }
    expect(manga.mal_id).toBe(4);
  });

  it('fromJSONArray descarta entradas basura', () => {
    const lista = MangaModel.fromJSONArray([
      { mal_id: 7, title: 'Ok' },
      null,
      'basura',
      {}, // sin mal_id válido
      { mal_id: 8, title: 'También ok' },
    ]);

    expect(lista.map((m) => m.mal_id)).toEqual([7, 8]);
  });

  it('fromJSONArray con datos no-array devuelve una lista vacía', () => {
    expect(MangaModel.fromJSONArray(null)).toEqual([]);
    expect(MangaModel.fromJSONArray(undefined)).toEqual([]);
    expect(MangaModel.fromJSONArray({ data: [] })).toEqual([]);
  });

  it('fromJSON con dato no-objeto devuelve un manga vacío', () => {
    const manga = MangaModel.fromJSON('basura');
    expect(manga.mal_id).toBe(0);
    expect(manga.title).toBe('Sin título');
  });
});
