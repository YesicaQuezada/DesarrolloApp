import { Component } from '@angular/core';
import { MangaService, Manga } from '../../services/manga';

@Component({
  selector: 'app-search-page',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: false,
})
export class SearchPage {
  resultados: Manga[] = [];

  constructor(private mangaService: MangaService) {
    this.resultados = this.mangaService.obtenerTodos();
  }

  alBuscar(texto: string) {
    this.resultados = this.mangaService.buscar(texto);
  }
}