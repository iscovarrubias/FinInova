import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';  
import { tap } from 'rxjs/operators';  


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

  registrarUsuario(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuario`, user, this.httpOptions);
  }

  loginUsuario(user: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/usuario?correo=${user.email}&contraseña=${user.password}`, this.httpOptions)
      .pipe(
        tap((usuario) => {
          if (usuario && usuario.length > 0) {
            this.authService.setCurrentUser(usuario[0]);  
          }
        })
      );
  }

  obtenerUsuario(correo: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuario?correo=${correo}`, this.httpOptions);  
  }

  recuperarContraseña(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/recuperar`, { correo: email }, this.httpOptions);
  }

  verificarCorreo(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuario?correo=${email}`, this.httpOptions); 
  }  

  crearPresupuesto(userId: string, presupuesto: any, correo: string): Observable<any> {
    const presupuestoConCorreo = {
      ...presupuesto,      
      correo: correo       
    };
    return this.http.post(`${this.apiUrl}/presupuestos`, presupuestoConCorreo, this.httpOptions);
  }
  
  obtenerCategorias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categorias`, this.httpOptions);
  }
  
  obtenerPresupuestos(correo: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/presupuestos?correo=${correo}`, this.httpOptions);
  }
  
  
  actualizarUsuario(id: number, usuario: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/usuarios/${id}`, usuario, this.httpOptions);
  }
}