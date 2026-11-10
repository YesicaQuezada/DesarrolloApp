import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MediaDetailPage } from './media-detail.page';

const routes: Routes = [
  {
    path: ':type/:id',
    component: MediaDetailPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MediaDetailPageRoutingModule {}
