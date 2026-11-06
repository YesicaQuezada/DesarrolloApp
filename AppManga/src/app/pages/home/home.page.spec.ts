import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomePage } from './home.page';
import { ComponentsModule } from '../../components/components.module';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomePage],
      // Replicamos home.module + ComponentsModule para que la plantilla
      // resuelva ion-*, app-manga-card, app-anime-card y ngIf/ngFor.
      // IonicModule además provee ModalController (que inyecta HomePage).
      imports: [IonicModule.forRoot(), ComponentsModule],
    });

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
