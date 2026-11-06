import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { addIcons } from 'ionicons';
import { trashBin } from 'ionicons/icons';

import { Favorito } from '../../../services/favorites/favorites.service';

@Component({
  selector: 'app-list-card',
  templateUrl: 'list-card.component.html',
  styleUrls: ['list-card.component.scss'],
  standalone: false,
})
export class ListCardComponent {
  @Input() titulo: string = '';
  @Input() subTitulo: string = '';
  @Input() items: Favorito[] = [];
  @Input() loading: boolean = false;

  @Output() quitarItem = new EventEmitter<Favorito>();

  constructor() {
    addIcons({ trashBin });
  }

  quitar(item: Favorito): void {
    this.quitarItem.emit(item);
  }
}
