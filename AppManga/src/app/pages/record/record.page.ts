import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { signUp, confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';

@Component({
  selector: 'app-record',
  standalone: false,
  templateUrl: './record.page.html',
  styleUrls: ['./record.page.scss']
})
export class RecordPage implements OnInit {

  nickname: string = '';
  email: string = '';
  password: string = '';
  confirmationCode: string = '';
  isConfirming: boolean = false;
  reenviandoCodigo: boolean = false; 
  cooldownReenvio: number = 0;

  private router = inject(Router);
  private alertController = inject(AlertController);
  private toastController = inject(ToastController);

  ngOnInit() { }

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
   * @description Muestra un cuadro de diálogo emergente integrado en el centro de la app
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
   * @function onSignUp
   * @description Registra un nuevo usuario en AWS Cognito enviando sus credenciales y apodo
   */
  async onSignUp() {
    if (!this.nickname || !this.email || !this.password) {
      await this.presentToast('Debe ingresar todos los valores', 'danger');
      return;
    }

    try {
      await signUp({
        username: this.email,
        password: this.password,
        options: {
          userAttributes: {
            email: this.email,
            nickname: this.nickname
          }
        }
      });
      await this.presentAlert('Registro Exitoso', 'Por favor, revisa tu correo para obtener el código de verificación.');
      this.isConfirming = true;
    } catch (error: any) {
      console.error('Error en el registro:', error);
      await this.presentToast('Error al intentar crear el usuario', 'danger');
    }
  }

  /**
   * @function onConfirmSignUp
   * @description Valida el código numérico en la nube para activar la cuenta definitivamente
   */
  async onConfirmSignUp() {
    if (!this.confirmationCode) {
      await this.presentToast('Debe ingresar el código de verificación', 'danger');
      return;
    }

    try {
      await confirmSignUp({
        username: this.email,
        confirmationCode: this.confirmationCode
      });
      await this.presentAlert('Cuenta Activada', '¡Tu cuenta ha sido activada con éxito! Ya puedes iniciar sesión.');
      this.router.navigate(['/login']);
    } catch (error: any) {
      console.error('Error al confirmar código:', error);
      await this.presentToast('Código incorrecto o vencido', 'danger');
    }
  }

  /**
   * @function reenviarCodigo
   * @description Solicita el reenvío del código a AWS Cognito y activa un tiempo de espera
   */
  async reenviarCodigo(event?: Event) {
    if (event) {
      event.preventDefault();
    }

    if (!this.email) {
      await this.presentToast('No se encontró el correo electrónico', 'danger');
      return;
    }

    if (this.cooldownReenvio > 0 || this.reenviandoCodigo) {
      return;
    }

    this.reenviandoCodigo = true;
    try {
      await resendSignUpCode({ username: this.email });
      await this.presentToast('Código reenviado con éxito', 'success');
      
      this.cooldownReenvio = 60;
      const interval = setInterval(() => {
        this.cooldownReenvio--;
        if (this.cooldownReenvio <= 0) {
          clearInterval(interval);
        }
      }, 1000);

    } catch (error: any) {
      console.error('Error al reenviar código:', error);
      await this.presentToast('No se pudo reenviar el código', 'danger');
    } finally {
      this.reenviandoCodigo = false;
    }
  }

  /**
   * @function goToLogin
   * @description Redirige al usuario de vuelta a la pantalla de inicio de sesión
   */
  goToLogin(event: Event) {
    event.preventDefault();
    this.router.navigate(['/login']);
  }
}
