import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular'; //  Cambiado al paquete clásico correcto

import { TabsPageRoutingModule } from './tabs-routing.module';
import { TabsPage } from './tabs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule, //  Esto le devuelve los superpoderes visuales a las pestañas
    TabsPageRoutingModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
