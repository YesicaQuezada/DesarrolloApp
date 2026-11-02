import { Component } from '@angular/core';
import { IonSearchbar } from '@ionic/angular';

import { addIcons } from 'ionicons';
import { searchCircle } from 'ionicons/icons';

@Component({
  selector: 'app-search',
  templateUrl: ['search.component.html'],
  styleUrls: ['search.component.scss'],
  //imports: [IonSearchbar],
})
export class SearchComponent {
  constructor() {
    /**
     * Any icons you want to use in your application
     * can be registered in app.component.ts and then
     * referenced by name anywhere in your application.
     */
    addIcons({ searchCircle });
  }
}
