import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular'; // <-- generaba error al agregar lazy (el proyecto se creo como module)
import { FavoritesPageRoutingModule } from './favorites-routing.module';

import { FavoritesPage } from './favorites.page';

// Components
import { ListCard } from '../../components/cards/list-card/list-card.component';
import { FavoriteComponent } from '../../components/segment/favorites/favorites.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, FavoritesPageRoutingModule],
  declarations: [FavoritesPage, FavoriteComponent, ListCard],
})
export class FavoritesPageModule {}
