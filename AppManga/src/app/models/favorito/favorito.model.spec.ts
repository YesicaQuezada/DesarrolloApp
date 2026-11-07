import { Favorito } from './favorito.model';

describe('Favorito', () => {
  it('construye un favorito saneado (trim en título e imagen)', () => {
    const favorito = new Favorito({
      mediaId: 42,
      type: 'anime',
      title: '  Cowboy Bebop  ',
      image: '  bebop.png  ',
      addedAt: new Date('2026-01-15T10:00:00.000Z'),
    });

    expect(favorito.mediaId).toBe(42);
    expect(favorito.type).toBe('anime');
    expect(favorito.title).toBe('Cowboy Bebop');
    expect(favorito.image).toBe('bebop.png');
    expect(favorito.addedAt.toISOString()).toBe('2026-01-15T10:00:00.000Z');
  });

  it('mediaId es identidad y los setters sanean (type fuera de la unión → manga)', () => {
    const favorito = new Favorito({
      mediaId: 7,
      type: 'manga',
      title: 'X',
      image: '',
    });

    try {
      (favorito as unknown as { mediaId: number }).mediaId = 0;
    } catch {
      // en modo estricto la asignación a un getter sin setter lanza TypeError
    }
    favorito.type = 'serie';
    favorito.title = '   ';

    expect(favorito.mediaId).toBe(7);
    expect(favorito.type).toBe('manga');
    expect(favorito.title).toBe('Sin título');
  });

  it('coacciona addedAt string ISO (el formato real guardado en Firestore) a Date', () => {
    const favorito = new Favorito({
      mediaId: 1,
      type: 'manga',
      title: 'A',
      image: 'i.png',
      addedAt: '2025-06-01T00:00:00.000Z',
    });

    expect(favorito.addedAt).toBeInstanceOf(Date);
    expect(favorito.addedAt.getTime()).toBe(Date.parse('2025-06-01T00:00:00.000Z'));
  });

  it('addedAt no interpretable queda en epoch en vez de romper', () => {
    const favorito = new Favorito({
      mediaId: 1,
      type: 'manga',
      title: 'A',
      image: 'i.png',
      addedAt: 'esto-no-es-una-fecha',
    });

    expect(favorito.addedAt.getTime()).toBe(0);
  });

  it('toJSON devuelve el formato exacto de Firestore (addedAt como string ISO)', () => {
    const favorito = new Favorito({
      mediaId: 9,
      type: 'anime',
      title: 'Z',
      image: 'z.png',
      addedAt: new Date('2026-02-01T12:00:00.000Z'),
    });

    expect(favorito.toJSON()).toEqual({
      mediaId: 9,
      type: 'anime',
      title: 'Z',
      image: 'z.png',
      addedAt: '2026-02-01T12:00:00.000Z',
    });
  });

  it('fromFirestore reconstruye el documento guardado', () => {
    const favorito = Favorito.fromFirestore({
      mediaId: 5,
      type: 'manga',
      title: 'Berserk',
      image: 'berserk.png',
      addedAt: '2025-01-01T00:00:00.000Z',
    });

    expect(favorito).toBeInstanceOf(Favorito);
    expect(favorito?.mediaId).toBe(5);
    expect(favorito?.title).toBe('Berserk');
    expect(favorito?.addedAt).toBeInstanceOf(Date);
  });

  it('fromFirestore descarta documentos corruptos (devuelve null)', () => {
    expect(Favorito.fromFirestore(null)).toBeNull();
    expect(Favorito.fromFirestore('texto')).toBeNull();
    expect(
      Favorito.fromFirestore({ mediaId: -1, type: 'manga', title: 'x', image: '' })
    ).toBeNull();
    expect(
      Favorito.fromFirestore({ mediaId: 3, type: 'serie', title: 'x', image: '' })
    ).toBeNull();
  });

  it('fromFirestore es tolerante con campos de presentación faltantes', () => {
    const favorito = Favorito.fromFirestore({ mediaId: 3, type: 'manga' });

    expect(favorito).not.toBeNull();
    expect(favorito?.title).toBe('Sin título');
    expect(favorito?.image).toBe('');
    expect(favorito?.addedAt.getTime()).toBe(0);
  });
});
