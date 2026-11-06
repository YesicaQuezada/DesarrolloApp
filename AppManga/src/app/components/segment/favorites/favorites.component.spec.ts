import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { FavoriteComponent } from './favorites.component';
import { ListCardComponent } from '../../cards/list-card/list-card.component';

describe('FavoriteComponent', () => {
  let component: FavoriteComponent;
  let fixture: ComponentFixture<FavoriteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // Replicamos favorites.module: declara FavoriteComponent y ListCardComponent
      // e importa CommonModule, FormsModule, IonicModule y RouterModule
      // (el template usa routerLink para ir a /login).
      declarations: [FavoriteComponent, ListCardComponent],
      imports: [
        IonicModule.forRoot(),
        FormsModule,
        CommonModule,
        RouterModule.forRoot([]),
      ],
    });

    fixture = TestBed.createComponent(FavoriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sin sesión muestra el estado "inicia sesión" en vez de la lista', async () => {
    // ngOnInit ya disparó cargar(): esperamos a que la promesa de la sesión
    // (que falla en el entorno de tests) resuelva y marque sinSesion.
    await new Promise((resolve) => setTimeout(resolve, 0));
    await new Promise((resolve) => setTimeout(resolve, 0));
    fixture.detectChanges();

    expect(component.sinSesion).toBe(true);
    expect(component.items.length).toBe(0);
  });
});
