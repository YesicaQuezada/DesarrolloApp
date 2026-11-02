import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchPageRoutingModule } from './search-routing.module';

import { SearchComponent } from '../../components/search/search.component';
import { SearchPage } from './search.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, SearchPageRoutingModule],
  declarations: [SearchPage, SearchComponent],
})
export class SearchPageModule {}
