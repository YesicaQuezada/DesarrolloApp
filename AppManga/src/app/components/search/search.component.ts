import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { addIcons } from 'ionicons';
import { trashBin } from 'ionicons/icons';

@Component({
  selector: 'app-search',
  templateUrl: 'search.component.html',
  styleUrls: ['search.component.scss'],
  imports: [CommonModule, FormsModule, IonicModule],
})
export class SearchComponent {
  @Output() buscar = new EventEmitter<string>();

  segmentoActual: string = 'anime';

  constructor() {
    addIcons({ trashBin });
  }

  alEscribir(event: any) {
    const valor: string = event.target.value ?? '';
    this.buscar.emit(valor);
  }

  cambiarSegmento(event: any) {
    this.segmentoActual = event.detail.value;
  }
}