import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../api/usuario.service';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  user: any = {
    email: '',
    password: ''
  };

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) { }

  ngOnInit() { }

  iniciarSesion() {
    console.log('Iniciando sesión...');
    console.log(this.user.email);
  
    this.usuarioService.loginUsuario(this.user).subscribe(
      (res) => {
        console.log(res);
        
        if (res && res.nombre) {
          localStorage.setItem('userName', res.nombre); 
        }
  
        this.router.navigate(['/home']);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  
  irARegistro() {
    this.router.navigate(['/registro']); 
  }

  irARecuperar() {
    this.router.navigate(['/recuperar']); 
  }

}
