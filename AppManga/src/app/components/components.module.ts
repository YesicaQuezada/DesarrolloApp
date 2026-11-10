import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { MediaCardComponent } from './cards/media-card/media-card.component';
import { FilterModalComponent } from './modals/filter-modal/filter-modal.component';
import { MediaSegmentComponent } from './media-segment/media-segment.component';
import { PaginationComponent } from './pagination/pagination.component';

@NgModule({
  declarations: [
    MediaCardComponent,
    FilterModalComponent,
    MediaSegmentComponent,
    PaginationComponent,
  ],
  imports: [CommonModule, FormsModule, IonicModule],
  exports: [
    MediaCardComponent,
    FilterModalComponent,
    MediaSegmentComponent,
    PaginationComponent,
  ],
})
export class ComponentsModule {}
