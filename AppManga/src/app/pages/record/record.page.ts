import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { signUp, confirmSignUp } from 'aws-amplify/auth';

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

  constructor(private router: Router) { }

  ngOnInit() { }

  /**
   * @function onSignUp
   * @description Registra un nuevo usuario en AWS Cognito enviando sus credenciales y apodo
   */

  async onSignUp() {
    if (!this.nickname || !this.email || !this.password) {
      alert('Por favor, completa todos los campos.');
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
      alert('Registro inicial exitoso. Por favor, revisa tu correo para obtener el código.');
      this.isConfirming = true;
    } catch (error: any) {
      console.error('Error en el registro:', error);
      alert('Error al registrarse: ' + (error.message || error));
    }
  }

  /**
   * @function onConfirmSignUp
   * @description Valida el código numérico en la nube para activar la cuenta definitivamente
   */

  async onConfirmSignUp() {
    if (!this.confirmationCode) {
      alert('Por favor, ingresa el código de confirmación.');
      return;
    }

    try {
      await confirmSignUp({
        username: this.email,
        confirmationCode: this.confirmationCode
      });
      alert('¡Cuenta activada con éxito! Ya puedes iniciar sesión.');
      this.router.navigate(['/login']);
    } catch (error: any) {
      console.error('Error al confirmar código:', error);
      alert('Código incorrecto o vencido: ' + (error.message || error));
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
