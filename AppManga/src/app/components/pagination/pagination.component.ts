import { Component, EventEmitter, Input, Output } from '@angular/core';
import { addIcons } from 'ionicons';
import { chevronBack, chevronForward } from 'ionicons/icons';

/** Página concreta o elipse de la ventana de numeración. */
type Entrada = number | '…';

/** Hasta esta cantidad de páginas se muestran todas sin ventana. */
const SIN_VENTANA = 7;

/**
 * Paginación numerada reutilizable (Home y Favoritos).
 *
 * Ionic 7 no trae `ion-pagination`, así que el control se arma con
 * `ion-button`s. La numeración usa ventana (`1 … 9 10 11 … 20`) para que
 * sirva también con los cientos de páginas que devuelve Jikan, sin llegar a
 * renderizar miles de botones.
 *
 * Es controlado: no pagina por su cuenta, solo emite `cambioPagina` y el
 * padre decide qué cargar. Se oculta solo cuando hay una página o menos.
 */
@Component({
  selector: 'app-pagination',
  templateUrl: 'pagination.component.html',
  styleUrls: ['pagination.component.scss'],
  standalone: false,
})
export class PaginationComponent {
  /** Página que se está viendo (base 1). */
  @Input() paginaActual = 1;

  /** Cantidad total de páginas. */
  @Input() totalPaginas = 1;

  /** Mantiene los botones inactivos mientras carga el padre. */
  @Input() cargando = false;

  /** Pide ir a una página concreta. */
  @Output() cambioPagina = new EventEmitter<number>();

  constructor() {
    addIcons({ chevronBack, chevronForward });
  }

  /** true cuando no hay nada que paginar (una sola página o vacío). */
  get oculto(): boolean {
    return this.totalPaginas <= 1;
  }

  get puedeRetroceder(): boolean {
    return this.paginaActual > 1 && !this.cargando;
  }

  get puedeAvanzar(): boolean {
    return this.paginaActual < this.totalPaginas && !this.cargando;
  }

  /**
   * @function paginasVisibles
   * @description Numeración a mostrar: todas si caben, o ventana con
   * primera, última y las vecinas de la actual separadas por elipsis.
   */
  paginasVisibles(): Entrada[] {
    const total = this.totalPaginas;
    if (total <= SIN_VENTANA) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const candidatas = [
      1,
      this.paginaActual - 1,
      this.paginaActual,
      this.paginaActual + 1,
      total,
    ].filter((p) => p >= 1 && p <= total);

    const unicas = Array.from(new Set(candidatas)).sort((a, b) => a - b);

    const salida: Entrada[] = [];
    let anterior = 0;
    for (const pagina of unicas) {
      if (pagina - anterior > 1) salida.push('…');
      salida.push(pagina);
      anterior = pagina;
    }
    return salida;
  }

  /** @function irA - Pide la página indicada sin salirse de los límites. */
  irA(pagina: number): void {
    if (this.cargando) return;
    const destino = Math.min(Math.max(pagina, 1), this.totalPaginas);
    if (destino !== this.paginaActual) this.cambioPagina.emit(destino);
  }
}
