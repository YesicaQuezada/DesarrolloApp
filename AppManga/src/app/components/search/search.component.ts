import { Component, EventEmitter, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-search',
  templateUrl: 'search.component.html',
  styleUrls: ['search.component.scss'],
  imports: [IonicModule],
})
export class SearchComponent {
  @Output() buscar = new EventEmitter<string>();

  alEscribir(event: any) {
    const valor: string = event.target.value ?? '';
    this.buscar.emit(valor);
  }
}