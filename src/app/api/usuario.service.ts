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
    return this.http.post(`${this.apiUrl}/login`, user, this.httpOptions); 
  }
}
