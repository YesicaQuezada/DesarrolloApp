import { Component, OnInit, signal } from '@angular/core';
import { MangaService } from '../../services/api/manga.service';
import { JikanManga } from '../../models/manga/manga.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  mangas = signal<JikanManga[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(private mangaService: MangaService) { }

  ngOnInit() {
    this.loadMangas();
  }

  loadMangas() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.mangaService.getMangaList(1, 12).subscribe({
      next: (response) => {
        this.mangas.set(response.data ?? []);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar mangas en Home:', error);
        this.errorMessage.set('No se pudieron cargar los mangas. Intenta nuevamente.');
        this.isLoading.set(false);
      },
    });
  }

  getCoverImage(manga: JikanManga): string | undefined {
    return manga.images?.webp?.large_image_url
      || manga.images?.jpg?.large_image_url
      || manga.images?.jpg?.image_url
      || undefined;
  }
}
