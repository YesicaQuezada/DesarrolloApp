import { AnimeModel } from './anime.model';
import { JikanAnimeItem } from '../../interfaces/anime-response/anime-item.interface';

describe('AnimeModel', () => {
  it('crea una instancia saneada desde el JSON crudo', () => {
    const anime = AnimeModel.fromJSON({
      mal_id: 1,
      title: '  Cowboy Bebop  ',
      title_english: 'Cowboy Bebop',
      images: { jpg: { image_url: 'a', small_image_url: 'b', large_image_url: 'c' } },
      score: 8.7,
      status: 'Finished Airing',
      type: 'TV',
      episodes: 26,
      synopsis: 'Cazarrecompensas.',
    });

    expect(anime.mal_id).toBe(1);
    expect(anime.title).toBe('Cowboy Bebop'); // trim
    expect(anime.episodes).toBe(26);
    expect(anime.score).toBe(8.7);
    expect(anime.synopsis).toBe('Cazarrecompensas.');
  });

  it('implementa el contrato JikanAnimeItem (capa DTO)', () => {
    const item: JikanAnimeItem = AnimeModel.fromJSON({ mal_id: 2, title: 'Mononoke' });
    expect(item.episodes).toBeNull();
    expect(item.images.jpg.image_url).toBe('');
  });

  it('los setters coaccionan valores fuera de rango (tolerante, no lanza)', () => {
    const anime = AnimeModel.fromJSON({ mal_id: 3, title: 'X' });

    anime.episodes = -1; // negativo → null
    anime.score = 'ocho' as unknown as number; // no numérico → null
    anime.title = ''; // vacío → 'Sin título'
    anime.type = undefined; // → 'Desconocido'

    expect(anime.episodes).toBeNull();
    expect(anime.score).toBeNull();
    expect(anime.title).toBe('Sin título');
    expect(anime.type).toBe('Desconocido');
  });

  it('mal_id es identidad: no cambia después de creado', () => {
    const anime = AnimeModel.fromJSON({ mal_id: 4, title: 'Y' });
    try {
      (anime as unknown as { mal_id: number }).mal_id = 99;
    } catch {
      // en modo estricto la asignación a un getter sin setter lanza TypeError
    }
    expect(anime.mal_id).toBe(4);
  });

  it('fromJSONArray descarta entradas basura y responde [] si no es array', () => {
    const lista = AnimeModel.fromJSONArray([
      { mal_id: 7, title: 'Ok' },
      42,
      {},
    ]);

    expect(lista.map((a) => a.mal_id)).toEqual([7]);
    expect(AnimeModel.fromJSONArray('nada')).toEqual([]);
  });
});
