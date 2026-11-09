import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SegmentChangeEventDetail } from '@ionic/angular';

/** Tipo de medio que distingue la solapa: manga o anime. */
export type TipoMedio = 'manga' | 'anime';

/**
 * Solapa Manga/Animes compartida por Home, Buscar y Favoritos.
 *
 * Es un componente **controlado**: no guarda estado propio, solo refleja
 * `valor` y avisa del cambio por `valorChange`, de modo que se usa con
 * enlace de dos vías `[(valor)]="segmento"` y las tres páginas quedan
 * sincronizadas en orden (Manga primero), etiquetas y comportamiento.
 */
@Component({
  selector: 'app-media-segment',
  templateUrl: 'media-segment.component.html',
  standalone: false,
})
export class MediaSegmentComponent {
  /** Solapa activa. */
  @Input() valor: TipoMedio = 'manga';

  /** Emite la nueva solapa seleccionada. */
  @Output() valorChange = new EventEmitter<TipoMedio>();

  /**
   * @function cambiar
   * @description Propaga el cambio de solapa al padre. Ignora valores
   * inesperados para no contaminar el estado con algo distinto de
   * 'manga' | 'anime'.
   */
  cambiar(event: CustomEvent<SegmentChangeEventDetail>): void {
    const valor = event.detail?.value;
    if (valor === 'manga' || valor === 'anime') {
      this.valorChange.emit(valor);
    }
  }
}
