import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { signUp, confirmSignUp, signIn } from 'aws-amplify/auth';

@Component({
  selector: 'app-record',
  standalone: false,
  templateUrl: './record.page.html',
  styleUrls: ['./record.page.scss']
})
export class RecordPage {

  nickname: string = '';
  email: string = '';
  password: string = '';
  confirmationCode: string = '';
  isConfirming: boolean = false;

  private router = inject(Router);

  /**
   * @function onSignUp
   * @description Registra un nuevo usuario en AWS Cognito enviando sus credenciales y apodo
   */

  async onSignUp() {
    if (!this.nickname || !this.email || !this.password) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    if (!this.email.includes('@')) {
      alert('Por favor, ingresa un correo electrónico válido.');
      return;
    }

    if (!this.passwordEsSegura(this.password)) {
      alert(
        'La contraseña debe tener mínimo 8 caracteres e incluir mayúscula, minúscula, número y símbolo (ej: Prueba1234!).'
      );
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
      alert(this.mensajeErrorRegistro(error));
    }
  }

  /**
   * @function passwordEsSegura
   * @description Valida en el cliente la política de Cognito antes de llamar al servicio
   */
  private passwordEsSegura(password: string): boolean {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    );
  }

  /**
   * @function mensajeErrorRegistro
   * @description Traduce los errores de Cognito a mensajes claros en español
   */
  private mensajeErrorRegistro(error: any): string {
    const nombre: string = error?.name ?? '';
    const mensaje: string = error?.message ?? String(error);

    if (nombre === 'UsernameExistsException' || /already exists/i.test(mensaje)) {
      return 'Ya existe una cuenta con este correo. Inicia sesión o usa otro correo.';
    }
    if (nombre === 'InvalidPasswordException' || /did not conform/i.test(mensaje)) {
      return 'La contraseña no cumple la política: mínimo 8 caracteres con mayúscula, minúscula, número y símbolo.';
    }
    if (nombre === 'InvalidParameterException' || /invalid/i.test(mensaje)) {
      return 'Datos inválidos: revisa el correo y la contraseña.';
    }
    if (
      nombre === 'LimitExceededException' ||
      nombre === 'TooManyRequestsException' ||
      /too many/i.test(mensaje)
    ) {
      return 'Demasiados intentos. Espera unos minutos y vuelve a intentar.';
    }
    return 'Error al registrarse: ' + mensaje;
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
    } catch (error: any) {
      console.error('Error al confirmar código:', error);
      alert('Código incorrecto o vencido: ' + (error.message || error));
      return;
    }

    // Cuenta activada: auto-login para entrar directo a tabs
    try {
      const resultado = await signIn({
        username: this.email,
        password: this.password
      });
      if (resultado?.nextStep?.signInStep === 'DONE') {
        this.router.navigate(['/tabs']);
        return;
      }
    } catch (error) {
      console.error('Auto-login fallido, se redirige a login:', error);
    }

    alert('¡Cuenta activada con éxito! Ya puedes iniciar sesión.');
    this.router.navigate(['/login']);
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
