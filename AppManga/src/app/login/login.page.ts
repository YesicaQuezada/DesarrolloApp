import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { signIn } from 'aws-amplify/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class LoginPage implements OnInit {

  email: string = '';
  password: string = '';

  constructor(private router: Router) { }

  ngOnInit() { }

  async onLogin() {
    if (!this.email || !this.password) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    try {
      const response = await signIn({
        username: this.email,
        password: this.password
      });

      console.log('Inicio de sesión exitoso:', response);
      alert('¡Bienvenido!');
      this.router.navigate(['/tabs']);

    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      alert('Error: ' + (error.message || 'No se pudo iniciar sesión'));
    }
  }
}