import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { getCurrentUser, signIn, fetchUserAttributes } from 'aws-amplify/auth';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';
  isLoading = false;

  private router = inject(Router);

  ngOnInit() {
    void this.redirectIfAuthenticated();
  }

  /**
   * @function onLogin
   * @description Autentica las credenciales en AWS Cognito y saluda al usuario con su apodo
   */

  async onLogin() {
    if (this.isLoading) {
      return;
    }

    if (!this.email || !this.password) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    this.isLoading = true;
    try {
      if (await this.redirectIfAuthenticated()) {
        return;
      }

      const response = await signIn({
        username: this.email,
        password: this.password,
      });
      console.log('Inicio de sesión exitoso:', response);

      const attributes = await fetchUserAttributes();
      const nombreUsuario = attributes.nickname || 'Usuario';

      alert(`¡Bienvenido de nuevo, ${nombreUsuario}!`);
      this.router.navigate(['/tabs']);
    } catch (error: any) {
      if (error?.name === 'UserAlreadyAuthenticatedException') {
        this.router.navigate(['/tabs']);
        return;
      }

      console.error('Error al iniciar sesión:', error);
      alert('Error: ' + (error.message || 'No se pudo iniciar sesión'));
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * @function redirectIfAuthenticated
   * @description Verifica si ya existe una sesión guardada y redirige al panel principal
   */
  private async redirectIfAuthenticated(): Promise<boolean> {
    try {
      await getCurrentUser();
      const attributes = await fetchUserAttributes();
      const nombreUsuario = attributes.nickname || 'Usuario';
      alert(`Sesión activa: ¡Hola, ${nombreUsuario}!`);
      await this.router.navigate(['/tabs']);
      return true;
    } catch {
      return false;
    }
  }
}
