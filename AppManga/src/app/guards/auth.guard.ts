import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { getCurrentUser } from 'aws-amplify/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private readonly router = inject(Router);

  async canActivate(): Promise<boolean> {
    try {
      await getCurrentUser();
      return true;
    } catch {
      await this.router.navigate(['/login']);
      return false;
    }
  }
}
