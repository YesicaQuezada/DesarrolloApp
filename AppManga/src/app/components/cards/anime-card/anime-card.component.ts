import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AnimeModel } from '../../../models/anime/anime.model';

@Component({
  selector: 'app-anime-card',
  templateUrl: './anime-card.component.html',
  styleUrls: ['./anime-card.component.scss'],
  standalone: false,
})
export class AnimeCardComponent {
  @Input() anime!: AnimeModel;
  @Output() cardClick = new EventEmitter<AnimeModel>();

  onClick(): void {
    this.cardClick.emit(this.anime);
  }
}
