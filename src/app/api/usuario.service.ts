<<<<<<< HEAD
// usuario.service.ts
=======
>>>>>>> 38098d935596176656d529e85e159e1d4653e781
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  apiUrl = 'https://189facc5-7642-4b17-a036-62e7c347b0a7-00-19wkpsd6w9uxl.picard.replit.dev';

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
    return this.http.get<any>(`${this.apiUrl}/usuario?email=${user.email}&password=${user.password}`, this.httpOptions); 
  }

  obtenerUsuario(email: string): Observable<any> {
<<<<<<< HEAD
    return this.http.get(`${this.apiUrl}/usuario?correo=${email}`, this.httpOptions);  
  }

  recuperarContraseña(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/recuperar`, { correo: email }, this.httpOptions);
  }
  
  verificarCorreo(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuario?correo=${email}`, this.httpOptions);
=======
  return this.http.get(`${this.apiUrl}/usuario?correo=${email}`, this.httpOptions);  
}

  recuperarContraseña(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/recuperar`, { correo: email }, this.httpOptions);
>>>>>>> 38098d935596176656d529e85e159e1d4653e781
  }  

  actualizarUsuario(id: number, usuario: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/usuarios/${id}`, usuario);
  }
}
