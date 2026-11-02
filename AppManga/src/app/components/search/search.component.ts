import { Component } from '@angular/core';

import { addIcons } from 'ionicons';
import { trashBin } from 'ionicons/icons';

@Component({
  selector: 'app-search-component',
  templateUrl: 'search.component.html',
  styleUrls: ['search.component.scss'],
  standalone: false,
})
export class SearchComponent {
  segmentoActual: string = 'anime';

  constructor() {
    addIcons({ trashBin });
  }

  cambiarSegmento(event: any) {
    this.segmentoActual = event.detail.value;
  }
}
