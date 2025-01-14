import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../api/usuario.service';
import { Router } from '@angular/router';
import { AuthService } from '../api/auth.service';
import { MenuController } from '@ionic/angular'; 

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

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private authService: AuthService,
    private menuController: MenuController  
  ) { }

  ngOnInit() {
    const date = new Date();
    this.currentDate = date.toLocaleString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

    this.userName = localStorage.getItem('userName') || '';
    console.log('Nombre de usuario:', this.userName);
  }

  ionViewWillEnter() {
    const nombre = localStorage.getItem('userName');
    
    if (!nombre) {
      this.router.navigate(['/login']); 
      return;
    }

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
  }

  calcularSaldo() {
    this.user.saldo = this.user.ingreso - this.user.gastos;
  }

  cerrarSesion() {
    this.authService.logout(); 
    this.menuController.close();  
  }

  toggleMenu() {
    this.menuController.toggle(); 
  }
}
