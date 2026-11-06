import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListCard } from './list-card.component';

describe('ListCard', () => {
  let component: ListCard;
  let fixture: ComponentFixture<ListCard>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListCard],
      imports: [IonicModule.forRoot()],
    });

    fixture = TestBed.createComponent(ListCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
