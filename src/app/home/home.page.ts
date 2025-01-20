import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../api/usuario.service';
import { Router } from '@angular/router';
import { AuthService } from '../api/auth.service';
import { MenuController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  user: any = { ingreso: 0, gastos: 0, saldo: 0 };
  currentDate!: string;
  presupuestos: any[] = [];
  categorias: any[] = [];
  gastos: any[] = [];
  userName: string = '';

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private authService: AuthService,
    private menuController: MenuController
  ) {}

  ngOnInit() {
    const date = new Date();
    this.currentDate = date.toLocaleString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

    this.userName = localStorage.getItem('userName') || '';
    console.log('Nombre de usuario:', this.userName);
  }

  ionViewWillEnter() {
    const correo = this.authService.getCurrentUser()?.correo;
  
    if (!correo) {
      this.router.navigate(['/login']);
      return;
    }
  
    this.usuarioService.obtenerUsuario(correo).pipe(
      switchMap((res: any) => {
        this.user = res;
        console.log('Usuario obtenido:', res);
        this.calcularSaldo();
  
        return this.usuarioService.obtenerCategorias();
      }),
      switchMap((categorias) => {
        this.categorias = categorias;
        console.log('Categorías obtenidas:', categorias);
  
        return this.usuarioService.obtenerPresupuestos(correo);
      }),
      switchMap((presupuestos: any[]) => {
        this.presupuestos = presupuestos.map((presupuesto) => {
          const categorias = Array.isArray(presupuesto.categorias) && presupuesto.categorias.length > 0
            ? presupuesto.categorias
            : [presupuesto.categoria];
  
          presupuesto.categoriaNombre = categorias
            .map((id: number) => {
              const categoria = this.categorias.find(c => c.id === id);
              return categoria ? categoria.nombre : 'Sin Categoría';
            })
            .join(', ');
  
          return presupuesto;
        });
  
        return this.usuarioService.obtenerGastos(correo);
      })
    ).subscribe(
      (gastos: any[]) => {
        console.log('Gastos obtenidos:', gastos);
  
        this.gastos = gastos.map((gasto) => {
          const categorias = Array.isArray(gasto.categorias) && gasto.categorias.length > 0
            ? gasto.categorias
            : [gasto.categoria];
  
          gasto.categoriaNombre = categorias
            .map((id: number) => {
              const categoria = this.categorias.find(c => c.id === id);
              return categoria ? categoria.nombre : 'Sin Categoría';
            })
            .join(', ');
  
          gasto.descripcion = gasto.descripcion || 'Sin descripción';
          gasto.tipoPago = gasto.tipo || 'No especificado';
  
          if (gasto.tipoPago === 'credito' && gasto.cuotas > 1) {
            gasto.montoTotal = gasto.monto * gasto.cuotas; 
          } else {
            gasto.montoTotal = gasto.monto;
          }
  
          return gasto;
        });
  
        this.user.gastos = this.gastos.reduce((total, gasto) => total + gasto.montoTotal, 0); 
        this.calcularSaldo();
      },
      (err) => {
        console.error('Error al obtener datos:', err);
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
