import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
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
  private cdr = inject(ChangeDetectorRef);
  private alertController = inject(AlertController);
  private toastController = inject(ToastController);

  ngOnInit() {
    void this.redirectIfAuthenticated();
  }

  /**
   * @function presentToast
   * @description Muestra una notificación rápida abajo con color verde (success) o rojo (danger)
   */
  async presentToast(mensaje: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: color
    });
    await toast.present();
  }

  /**
   * @function presentAlert
   * @description Muestra un cuadro de diálogo emergente integrado en la pantalla
   */
  async presentAlert(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['Aceptar']
    });
    await alert.present();
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
      await this.presentToast('Debe ingresar todos los valores', 'danger');
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

      await this.presentToast(`¡Bienvenido de nuevo, ${nombreUsuario}!`, 'success');
      this.router.navigate(['/tabs']);
    } catch (error: any) {
      if (error?.name === 'UserAlreadyAuthenticatedException') {
        this.router.navigate(['/tabs']);
        return;
      }

      console.error('Error al iniciar sesión:', error);
     
      await this.presentAlert('Error de Acceso', 'Datos incorrectos o usuario no registrado');
    } finally {
      this.isLoading = false;
      this.cdr.markForCheck();
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
      await this.presentToast(`Sesión activa: ¡Hola, ${nombreUsuario}!`, 'success');
      await this.router.navigate(['/tabs']);
      return true;
    } catch {
      return false;
    }
  }
}

