import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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

  constructor(private http: HttpClient) { }

  registrarUsuario(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuario`, user, this.httpOptions);
  }

  loginUsuario(user: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/usuario?correo=${user.email}&contraseña=${user.password}`, this.httpOptions);
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

  crearPresupuesto(userId: string, presupuesto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/presupuestos`, presupuesto, this.httpOptions);
  }  

  obtenerPresupuestos(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/presupuestos?usuarioId=${id}`);
  }
  
  actualizarUsuario(id: number, usuario: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/usuarios/${id}`, usuario, this.httpOptions);
  }
}
