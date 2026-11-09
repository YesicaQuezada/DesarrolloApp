import { Component, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { signUp, confirmSignUp, signIn, resendSignUpCode } from 'aws-amplify/auth';

@Component({
  selector: 'app-record',
  standalone: false,
  templateUrl: './record.page.html',
  styleUrls: ['./record.page.scss']
})
export class RecordPage implements OnDestroy {

  nickname: string = '';
  email: string = '';
  password: string = '';
  confirmationCode: string = '';
  isConfirming: boolean = false;

  reenviandoCodigo: boolean = false;
  /** Segundos restantes de espera antes de poder pedir otro código. */
  cooldownReenvio: number = 0;
  private timerReenvio?: ReturnType<typeof setInterval>;

  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

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
      // Angular 22 solo refresca vistas marcadas: tras un `await` hay que marcarla.
      this.cdr.markForCheck();
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
   * @function reenviarCodigo
   * @description Pide a Cognito que reenvíe el código de confirmación al correo.
   * Tiene un cooldown de 60s para no provocar LimitExceededException.
   */

  async reenviarCodigo(event?: Event) {
    event?.preventDefault();

    if (this.reenviandoCodigo || this.cooldownReenvio > 0) {
      return;
    }

    this.reenviandoCodigo = true;
    try {
      await resendSignUpCode({ username: this.email });
      alert('Código reenviado. Revisa tu correo.');
      this.iniciarCooldown(60);
    } catch (error: any) {
      console.error('Error al reenviar código:', error);
      alert(this.mensajeErrorReenvio(error));
    } finally {
      this.reenviandoCodigo = false;
      // Angular 22 solo refresca vistas marcadas: tras un `await` hay que marcarla.
      this.cdr.markForCheck();
    }
  }

  /**
   * @function iniciarCooldown
   * @description Bloquea el botón de reenvío durante `segundos` y actualiza el contador.
   */
  private iniciarCooldown(segundos: number): void {
    this.cooldownReenvio = segundos;
    this.timerReenvio = setInterval(() => {
      this.cooldownReenvio -= 1;
      if (this.cooldownReenvio <= 0) {
        clearInterval(this.timerReenvio);
        this.timerReenvio = undefined;
      }
      // Angular 22 solo refresca vistas marcadas: el tick por sí solo no pinta.
      this.cdr.markForCheck();
    }, 1000);
  }

  /**
   * @function mensajeErrorReenvio
   * @description Traduce los errores de Cognito al reenviar el código.
   */
  private mensajeErrorReenvio(error: any): string {
    const nombre: string = error?.name ?? '';
    const mensaje: string = error?.message ?? String(error);

    if (
      nombre === 'LimitExceededException' ||
      nombre === 'TooManyRequestsException' ||
      /too many/i.test(mensaje)
    ) {
      return 'Demasiados envíos. Espera unos minutos y vuelve a intentar.';
    }
    if (nombre === 'InvalidStateException' || /already confirmed/i.test(mensaje)) {
      return 'Esta cuenta ya está confirmada: iniciá sesión.';
    }
    if (nombre === 'ExpiredCodeException' || /expired/i.test(mensaje)) {
      return 'El código anterior venció. Usa el código nuevo que te enviamos.';
    }
    return 'No se pudo reenviar el código: ' + mensaje;
  }

  ngOnDestroy(): void {
    if (this.timerReenvio) {
      clearInterval(this.timerReenvio);
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
