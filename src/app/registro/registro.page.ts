import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../api/usuario.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  user:any={
    nombre:'',
    email:'',
    password:'',
    fecha:'',
    genero:''
  }

  constructor(private usuarioService:UsuarioService) { }

  ngOnInit() {
  }

  registrar(){
    console.log('Registrando...');
    console.log(this.user.nombre);

    this.usuarioService.registrarUsuario(this.user).subscribe(
      (res)=>{
        console.log(res);
      },
      (err)=>{
        console.log(err);
      }
    );

  }

}
