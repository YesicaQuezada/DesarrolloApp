import { Component, EventEmitter, Output } from '@angular/core';

import { addIcons } from 'ionicons';
import { trashBin } from 'ionicons/icons';
import { SearchbarInputEventDetail } from '@ionic/angular';

import { TipoMedio } from '../media-segment/media-segment.component';

/**
 * Lo que la página debe buscar: texto escrito y medio de la solapa.
 * Se emite completo en cada cambio, para que quien escucha no tenga que
 * recordar estado suelto de dos fuentes distintas.
 */
export interface PeticionBusqueda {
  texto: string;
  tipo: TipoMedio;
}

@Component({
  selector: 'app-search',
  templateUrl: 'search.component.html',
  styleUrls: ['search.component.scss'],
  standalone: false,
})
export class SearchComponent {
  /** Emite la búsqueda completa cada vez que cambia el texto o la solapa. */
  @Output() buscar = new EventEmitter<PeticionBusqueda>();

  /** Solapa activa: mismo estándar que Home y Favoritos (Manga primero). */
  tipo: TipoMedio = 'manga';

  /** Último texto escrito: se reenvía intacto al cambiar de solapa. */
  private texto = '';

  constructor() {
    addIcons({ trashBin });
  }

  /**
   * @function alEscribir
   * @description Guarda el texto y notifica la búsqueda con la solapa actual.
   */
  alEscribir(event: CustomEvent<SearchbarInputEventDetail>): void {
    this.texto = event.detail?.value ?? '';
    this.notificar();
  }

  /**
   * @function alCambiarSegmento
   * @description Cambia de medio y reenvía la búsqueda con el texto que ya
   * había escrito el usuario, para que la solapa realmente discrimine.
   */
  alCambiarSegmento(tipo: TipoMedio): void {
    this.tipo = tipo;
    this.notificar();
  }

  private notificar(): void {
    this.buscar.emit({ texto: this.texto, tipo: this.tipo });
  }
}
