import { MangaModel } from './manga.model';

describe('MangaModel', () => {
  it('should create an instance', () => {
    const manga: MangaModel = {
      mal_id: 1,
      title: 'One Piece',
      title_english: 'One Piece',
      images: {
        jpg: { image_url: '', small_image_url: '', large_image_url: '' },
        webp: { image_url: '', small_image_url: '', large_image_url: '' },
      },
      score: 8.7,
      status: 'Publishing',
      type: 'Manga',
      chapters: null,
      volumes: null,
      synopsis: null,
    };
    expect(manga).toBeTruthy();
  });
});
