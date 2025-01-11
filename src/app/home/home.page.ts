import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../api/usuario.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  user: any = { ingreso: 0, gastos: 0, saldo: 0 };
  currentDate!: string;

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit() {
    const date = new Date();
    this.currentDate = date.toLocaleString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

    const nombre = localStorage.getItem('userName');

    if (nombre) {
      this.usuarioService.obtenerUsuario(nombre).subscribe(
        (res) => {
          this.user = res;
          this.calcularSaldo();
        },
        (err) => {
          console.error('Error al obtener el usuario:', err);
        }
      );
    } else {
      console.error('No se encontró el nombre del usuario.');
    }
  }

  calcularSaldo() {
    this.user.saldo = this.user.ingreso - this.user.gastos;
  }
 }

