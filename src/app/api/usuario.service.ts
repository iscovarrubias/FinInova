import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { tap } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  apiUrl = 'http://localhost:3000';  

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*' 
    })
  };

  constructor(private http: HttpClient, private authService: AuthService) { }  

  private handleError(operation: string) {
    return (error: any): Observable<never> => {
      console.error(`${operation} failed: ${error.message}`);
      return throwError(() => new Error(`${operation} failed: ${error.message}`));
    };
  }

  registrarUsuario(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuario`, user, this.httpOptions)
      .pipe(catchError(this.handleError('registrarUsuario')));
  }

  loginUsuario(user: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/usuario?correo=${user.email}&contraseña=${user.password}`, this.httpOptions)
      .pipe(
        tap((usuario) => {
          if (usuario && usuario.length > 0) {
            this.authService.setCurrentUser(usuario[0]);  
          }
        }),
        catchError(this.handleError('loginUsuario'))
      );
  }

  obtenerUsuario(correo: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuario?correo=${correo}`, this.httpOptions)
      .pipe(catchError(this.handleError('obtenerUsuario')));
  }

  recuperarContraseña(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/recuperar`, { correo: email }, this.httpOptions)
      .pipe(catchError(this.handleError('recuperarContraseña')));
  }

  verificarCorreo(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuario?correo=${email}`, this.httpOptions)
      .pipe(catchError(this.handleError('verificarCorreo')));
  }

  crearPresupuesto(userId: string, presupuesto: any, correoDestino: string | null = null) {
    const presupuestoFinal = {
      ...presupuesto,
      correoDestino: correoDestino || null,
      compartir: !!correoDestino,
    };
    return this.http.post(`${this.apiUrl}/presupuestos`, presupuestoFinal);
  }  


  obtenerCategorias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categorias`, this.httpOptions)
      .pipe(catchError(this.handleError('obtenerCategorias')));
  }
  
  obtenerPresupuestos(correo: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/presupuestos?correo=${correo}`, this.httpOptions)
      .pipe(catchError(this.handleError('obtenerPresupuestos')));
  }

  crearGasto(userId: string, gasto: any, correo: string): Observable<any> {
    const gastoConCorreo = { 
      ...gasto, 
      correo: correo 
    };

    return this.http.post(`${this.apiUrl}/gastos`, gastoConCorreo, this.httpOptions)
      .pipe(catchError(this.handleError('crearGasto')));
  }
  
  obtenerGastos(correo: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/gastos?correo=${correo}`, this.httpOptions)
      .pipe(catchError(this.handleError('obtenerGastos')));
  }  
  
  actualizarUsuario(id: number, usuario: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/usuarios/${id}`, usuario, this.httpOptions)
      .pipe(catchError(this.handleError('actualizarUsuario')));
  }
}
