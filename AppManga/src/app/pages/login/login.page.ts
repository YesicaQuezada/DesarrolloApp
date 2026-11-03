import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { getCurrentUser, signIn } from 'aws-amplify/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';
  isLoading = false;

  constructor(private router: Router) {}

  ngOnInit() {
    void this.redirectIfAuthenticated();
  }

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

  private async redirectIfAuthenticated(): Promise<boolean> {
    try {
      await getCurrentUser();
      await this.router.navigate(['/tabs']);
      return true;
    } catch {
      return false;
    }
  }
}
