import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit, OnDestroy {
  private backButtonListener?: { remove: () => void };

  constructor(private router: Router) {}

  ngOnInit(): void {
    App.addListener('backButton', ({ canGoBack }) => {
      const currentUrl = this.router.url;
      const isRootRoute =
        currentUrl === '/' ||
        currentUrl === '/login' ||
        currentUrl === '/registro';

      if (isRootRoute) {
        App.exitApp();
        return;
      }

      if (canGoBack) {
        window.history.back();
        return;
      }

      App.exitApp();
    }).then((listener) => {
      this.backButtonListener = listener;
    });
  }

  ngOnDestroy(): void {
    this.backButtonListener?.remove();
  }
}
