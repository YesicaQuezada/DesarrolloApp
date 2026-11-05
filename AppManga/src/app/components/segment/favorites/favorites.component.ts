import { Component } from '@angular/core';

@Component({
  selector: 'app-segment',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
  standalone: false,
})
export class FavoriteComponent {
  segmentoActual: string = 'anime';

  constructor() {}

  // Opcional: si quieres capturar el cambio explícitamente
  cambiarSegmento(event: any) {
    this.segmentoActual = event.detail.value;
  }
}
