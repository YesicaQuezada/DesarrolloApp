import { Component, inject } from '@angular/core';
import { MangaService, Manga } from '../../services/manga';

@Component({
  selector: 'app-search-page',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: false,
})
export class SearchPage {
  private mangaService = inject(MangaService);

  resultados: Manga[] = this.mangaService.obtenerTodos();

  alBuscar(texto: string) {
    this.resultados = this.mangaService.buscar(texto);
  }
}