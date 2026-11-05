export interface JikanGenre {
  mal_id: number;
  name: string;
  url: string;
  count?: number;
}

export interface FilterSelection {
  genreId?: number;
  demographicId?: number;
  status?: string;
}
