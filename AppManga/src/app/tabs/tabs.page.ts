import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { getCurrentUser, signOut } from 'aws-amplify/auth';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false,
})
export class TabsPage {
  private readonly router = inject(Router);
  private readonly actionSheetCtrl = inject(ActionSheetController);

  async openUserMenu(event?: Event): Promise<void> {
    event?.stopPropagation();

    const isAuthenticated = await this.hasActiveSession();
    const buttons = isAuthenticated
      ? [
          {
            text: 'Cerrar sesión',
            role: 'destructive',
            handler: async () => {
              await this.cerrarSesion();
            },
          },
          {
            text: 'Cancelar',
            role: 'cancel',
          },
        ]
      : [
          {
            text: 'Iniciar sesión',
            handler: async () => {
              await this.router.navigate(['/login']);
            },
          },
          {
            text: 'Registrarse',
            handler: async () => {
              await this.router.navigate(['/registro']);
            },
          },
          {
            text: 'Cancelar',
            role: 'cancel',
          },
        ];

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Cuenta',
      cssClass: 'user-action-sheet',
      buttons,
    });

    await actionSheet.present();
  }

  private async hasActiveSession(): Promise<boolean> {
    try {
      await getCurrentUser();
      return true;
    } catch {
      return false;
    }
  }

  private async cerrarSesion(): Promise<void> {
    try {
      await signOut();
      await this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      alert('No se pudo cerrar la sesión.');
    }
  }
}
