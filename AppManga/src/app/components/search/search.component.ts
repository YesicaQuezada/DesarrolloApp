import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: 'search.component.html',
  styleUrls: ['search.component.scss'],
  standalone: false,
})
export class SearchComponent {
  @Output() buscar = new EventEmitter<string>();

  alEscribir(event: any) {
    const valor: string = event.target.value ?? '';
    this.buscar.emit(valor);
  }
}
