import { AnimeModel } from './anime.model';

describe('AnimeModel', () => {
  it('should create an instance', () => {
    const anime: AnimeModel = {
      mal_id: 1,
      title: 'Cowboy Bebop',
      title_english: 'Cowboy Bebop',
      images: {
        jpg: { image_url: '', small_image_url: '', large_image_url: '' },
        webp: { image_url: '', small_image_url: '', large_image_url: '' },
      },
      score: 8.7,
      status: 'Finished Airing',
      type: 'TV',
      episodes: 26,
      synopsis: null,
    };
    expect(anime).toBeTruthy();
  });
});
