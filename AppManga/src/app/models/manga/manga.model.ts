export interface JikanManga {
	mal_id: number;
	title: string;
	score?: number | null;
	images?: {
		jpg?: {
			image_url?: string | null;
			large_image_url?: string | null;
		};
		webp?: {
			image_url?: string | null;
			large_image_url?: string | null;
		};
	};
}

export interface JikanMangaResponse {
	data: JikanManga[];
}

export class MangaModel {
}
