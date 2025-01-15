import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private currentUser: any = null;

  constructor(private http: HttpClient, private router: Router) {
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUser = JSON.parse(user);
    }
  }

  login(correo: string, contraseña: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/usuario?correo=${correo}&contraseña=${contraseña}`).pipe(
      tap((usuario) => {
        if (usuario && usuario.length > 0) {  
          this.setCurrentUser(usuario[0]);
          console.log('Usuario logueado:', usuario[0]);  
        } else {
          console.log('Usuario no encontrado');
        }
      })
    );
  }
  
  setCurrentUser(user: any) {
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));  
    console.log('Usuario almacenado:', this.currentUser);
  }
  
  getCurrentUser() {
    if (!this.currentUser) {
      const user = localStorage.getItem('currentUser');
      if (user) {
        this.currentUser = JSON.parse(user);
      }
    }
    console.log('Usuario actual:', this.currentUser);  
    return this.currentUser;
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  ensureAuthenticated(): void {
    if (!this.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }
}

