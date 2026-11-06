import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-list-card',
  templateUrl: 'list-card.component.html',
  styleUrls: ['list-card.component.scss'],
  standalone: false,
})
export class ListCardComponent {
  @Input() titulo: string = '';
  @Input() subTitulo: string = '';
}
