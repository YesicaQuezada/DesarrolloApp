import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MangaModel } from '../../../models/manga/manga.model';

@Component({
  selector: 'app-manga-card',
  templateUrl: './manga-card.component.html',
  styleUrls: ['./manga-card.component.scss'],
  standalone: false,
})
export class MangaCardComponent {
  @Input() manga!: MangaModel;
  @Output() cardClick = new EventEmitter<MangaModel>();

  onClick(): void {
    this.cardClick.emit(this.manga);
  }
}
