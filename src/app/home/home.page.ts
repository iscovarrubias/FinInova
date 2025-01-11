import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../api/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  user: any = { ingreso: 0, gastos: 0, saldo: 0 };
  currentDate!: string;
  presupuestos: any[] = [];
  userName: string = '';  

  constructor(private usuarioService: UsuarioService, private router: Router) { }

  ngOnInit() {
    const date = new Date();
    this.currentDate = date.toLocaleString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

    this.userName = localStorage.getItem('userName') || '';
    console.log('Nombre de usuario:', this.userName);
  }

  ionViewWillEnter() {
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

      this.usuarioService.obtenerPresupuestos(nombre).subscribe(
        (presupuestos) => {
          this.presupuestos = presupuestos;
        },
        (err) => {
          console.error('Error al obtener los presupuestos:', err);
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
