import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { FavoriteComponent } from './favorites.component';
import { ListCardComponent } from '../../cards/list-card/list-card.component';

describe('FavoriteComponent', () => {
  let component: FavoriteComponent;
  let fixture: ComponentFixture<FavoriteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // Replicamos favorites.module: declara FavoriteComponent y ListCardComponent
      // e importa CommonModule, FormsModule e IonicModule.
      declarations: [FavoriteComponent, ListCardComponent],
      imports: [IonicModule.forRoot(), FormsModule, CommonModule],
    });

    fixture = TestBed.createComponent(FavoriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
