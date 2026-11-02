import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchPageRoutingModule } from './search-routing.module';

import { SearchPage } from './search.page';
import { SearchComponent } from '../../components/search/search.component';
@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, SearchPageRoutingModule, SearchComponent],
  declarations: [SearchPage],
})
export class SearchPageModule {}
