import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { signUp, confirmSignUp } from 'aws-amplify/auth';

@Component({
  selector: 'app-record',
  templateUrl: './record.page.html',
  styleUrls: ['./record.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class RecordPage implements OnInit {

  email: string = '';
  password: string = '';
  confirmationCode: string = '';
  isConfirming: boolean = false;

  constructor(private router: Router) { }

  ngOnInit() { }

  async onSignUp() {
    if (!this.email || !this.password) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    try {
      await signUp({
        username: this.email,
        password: this.password,
        options: {
          userAttributes: {
            email: this.email
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

  goToLogin(event: Event) {
    event.preventDefault();
    this.router.navigate(['/login']);
  }
}
