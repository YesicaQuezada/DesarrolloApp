import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { confirmSignUp, signUp } from 'aws-amplify/auth';

@Component({
  selector: 'app-register-page',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage {
  email = '';
  password = '';
  confirmPassword = '';
  nickname = '';
  verificationCode = '';
  isLoading = false;
  showVerificationStep = false;

  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  async onRegister(): Promise<void> {
    if (this.isLoading) {
      return;
    }

    if (!this.email || !this.password || !this.nickname || !this.confirmPassword) {
      alert('Completa todos los campos para continuar.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    this.isLoading = true;
    this.cdr.markForCheck();

    try {
      await signUp({
        username: this.email,
        password: this.password,
        options: {
          userAttributes: {
            email: this.email,
            nickname: this.nickname,
          },
        },
      });

      this.showVerificationStep = true;
      this.verificationCode = '';
      alert('Registro creado. Ingresá el código de verificación que llegó a tu email.');
    } catch (error: any) {
      console.error('Error al registrarse:', error);
      alert('No se pudo registrar la cuenta: ' + (error?.message || 'Error desconocido'));
    } finally {
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }

  async onConfirmSignUp(): Promise<void> {
    if (this.isLoading || !this.verificationCode.trim()) {
      alert('Ingresá el código de verificación.');
      return;
    }

    this.isLoading = true;
    this.cdr.markForCheck();

    try {
      await confirmSignUp({
        username: this.email,
        confirmationCode: this.verificationCode.trim(),
      });

      alert('Cuenta verificada correctamente. Ahora podés iniciar sesión.');
      await this.router.navigate(['/login']);
    } catch (error: any) {
      console.error('Error al confirmar código:', error);
      alert('Código incorrecto o vencido: ' + (error?.message || 'Intentá de nuevo.'));
    } finally {
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }
}
