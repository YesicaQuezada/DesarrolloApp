export const MANGA_STATUS = [
  { value: 'publishing', label: 'En publicación' },
  { value: 'complete', label: 'Finalizado' },
  { value: 'hiatus', label: 'En pausa' },
  { value: 'discontinued', label: 'Descontinuado' },
] as const;

export const ANIME_STATUS = [
  { value: 'airing', label: 'En emisión' },
  { value: 'complete', label: 'Completo' },
  { value: 'upcoming', label: 'Próximamente' },
] as const;
