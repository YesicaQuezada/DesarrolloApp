import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';

import { MangaService } from '../../services/api/manga.service';
import { MangaModel } from '../../models/manga/manga.model';

@Component({
  selector: 'app-search-page',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: false,
})
export class SearchPage implements OnInit, OnDestroy {
  private mangaService = inject(MangaService);
  private busquedaSub?: Subscription;

  resultados: MangaModel[] = [];
  loading = false;
  error = '';

  ngOnInit(): void {
    this.buscar('');
  }

  ngOnDestroy(): void {
    this.busquedaSub?.unsubscribe();
  }

  alBuscar(texto: string): void {
    this.buscar(texto);
  }

  /**
   * @function buscar
   * @description Consulta la API de Jikan: lista general sin texto, o por texto libre (q)
   */
  private buscar(texto: string): void {
    this.busquedaSub?.unsubscribe();
    this.loading = true;
    this.error = '';

    const query = texto.trim();
    const peticion = query
      ? this.mangaService.buscarManga(query)
      : this.mangaService.getMangaList(1, 20);

    this.busquedaSub = peticion.subscribe({
      next: (respuesta) => {
        this.resultados = respuesta.data;
        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar los resultados.';
        this.loading = false;
      },
    });
  }
}
