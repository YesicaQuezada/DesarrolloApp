import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { MangaCardComponent } from './cards/manga-card/manga-card.component';
import { AnimeCardComponent } from './cards/anime-card/anime-card.component';
import { FilterModalComponent } from './modals/filter-modal/filter-modal.component';

@NgModule({
  declarations: [MangaCardComponent, AnimeCardComponent, FilterModalComponent],
  imports: [CommonModule, FormsModule, IonicModule],
  exports: [MangaCardComponent, AnimeCardComponent, FilterModalComponent],
})
export class ComponentsModule {}
