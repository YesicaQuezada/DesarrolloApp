export interface JikanImageSet {
  image_url: string;
  small_image_url: string;
  large_image_url: string;
}

export interface JikanImages {
  jpg: JikanImageSet;
  webp: JikanImageSet;
}

export interface MangaModel {
  mal_id: number;
  title: string;
  title_english: string | null;
  images: JikanImages;
  score: number | null;
  status: string;
  type: string;
  chapters: number | null;
  volumes: number | null;
  synopsis: string | null;
}

export interface JikanPagination {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
  items: {
    count: number;
    total: number;
    per_page: number;
  };
}

export interface JikanMangaResponse {
  data: MangaModel[];
  pagination: JikanPagination;
}
