import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { fetchUserAttributes, getCurrentUser, signOut } from 'aws-amplify/auth';

@Component({
  selector: 'app-account-page',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  standalone: false,
})
export class AccountPage {
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  isLoggedIn = false;
  email = '';
  nickname = 'Usuario';
  loading = false;

  ionViewWillEnter(): void {
    void this.cargarSesion();
  }

  async cargarSesion(): Promise<void> {
    try {
      await getCurrentUser();
      const attributes = await fetchUserAttributes();
      this.email = attributes.email || '';
      this.nickname = attributes.nickname || 'Usuario';
      this.isLoggedIn = true;
    } catch {
      this.isLoggedIn = false;
      this.email = '';
      this.nickname = 'Usuario';
    } finally {
      this.cdr.markForCheck();
    }
  }

  async cerrarSesion(): Promise<void> {
    if (this.loading) {
      return;
    }

    this.loading = true;
    this.cdr.markForCheck();

    try {
      await signOut();
      this.isLoggedIn = false;
      this.email = '';
      this.nickname = 'Usuario';
      await this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      alert('No se pudo cerrar la sesión.');
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }
}
