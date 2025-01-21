import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { UsuarioService } from '../api/usuario.service';
import { AuthService } from '../api/auth.service';

@Component({
  selector: 'app-gastos',
  templateUrl: './gastos.page.html',
  styleUrls: ['./gastos.page.scss'],
})
export class GastosPage implements OnInit {
  nuevoGasto: any = {
    nombre: '',
    monto: '',
    fecha: '',
    correo: '',
    categorias: [],
    presupuesto: null,
    descripcion: '',
    tipo: 'debito',
    cuotas: 1,
  };

  categorias: any[] = [];
  presupuestos: any[] = [];
  private apiUrl = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastController: ToastController,
    private usuarioService: UsuarioService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.usuarioService.obtenerCategorias().subscribe(
      (categorias: any[]) => {
        this.categorias = categorias;
        console.log('Categorías cargadas:', this.categorias);
      },
      (error) => {
        console.error('Error al obtener categorías:', error);
      }
    );
  }

  cargarPresupuestosPorCategoria(categoriaId: string) {
    this.http.get<any[]>(`${this.apiUrl}/presupuestos`).subscribe(
      (presupuestos: any[]) => {
        this.presupuestos = presupuestos.filter((presupuesto) =>
          presupuesto.categorias.includes(categoriaId)
        );
        console.log('Presupuestos filtrados:', this.presupuestos);
      },
      (error) => {
        console.error('Error al obtener presupuestos:', error);
      }
    );
  }
  onCategoriaChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const categoriaId = selectElement.value;
  
    this.usuarioService.obtenerPresupuestosPorCategoria(categoriaId).subscribe(
      (presupuestos: any[]) => {
        this.presupuestos = presupuestos;
      },
      (error) => {
        console.error('Error al obtener presupuestos:', error);
      }
    );
  }
  

  async crearGasto() {
    if (!this.nuevoGasto.nombre || !this.nuevoGasto.monto || !this.nuevoGasto.fecha || !this.nuevoGasto.categorias.length) {
      const toast = await this.toastController.create({
        message: 'Por favor, completa todos los campos.',
        duration: 2000,
        color: 'warning',
      });
      toast.present();
      return;
    }
  
    const usuario = this.authService.getCurrentUser();
    const correo = usuario ? usuario.correo : this.nuevoGasto.correo;
  
    if (!correo) {
      const toast = await this.toastController.create({
        message: 'Por favor, ingresa un correo válido.',
        duration: 2000,
        color: 'warning',
      });
      toast.present();
      return;
    }
  
    const gastos = [];
    if (this.nuevoGasto.tipo === 'debito') {
      gastos.push({ 
        ...this.nuevoGasto, 
        categorias: Array.isArray(this.nuevoGasto.categorias)
          ? this.nuevoGasto.categorias
          : [this.nuevoGasto.categorias] 
      });
    } else if (this.nuevoGasto.tipo === 'credito') {
      const montoPorCuota = this.nuevoGasto.monto / this.nuevoGasto.cuotas;
      const fechaInicial = new Date(this.nuevoGasto.fecha);
  
      for (let i = 0; i < this.nuevoGasto.cuotas; i++) {
        const fechaCuota = new Date(fechaInicial);
        fechaCuota.setMonth(fechaCuota.getMonth() + i);
        gastos.push({
          ...this.nuevoGasto,
          categorias: Array.isArray(this.nuevoGasto.categorias)
            ? this.nuevoGasto.categorias
            : [this.nuevoGasto.categorias], 
          monto: montoPorCuota,
          fecha: fechaCuota.toISOString().split('T')[0],
        });
      }
    }
  
    for (const gasto of gastos) {
      this.usuarioService.crearGasto(usuario.id, gasto, correo).subscribe(
        async (res: any) => {
          const toast = await this.toastController.create({
            message: 'Gasto creado con éxito.',
            duration: 2000,
            color: 'success',
          });
          toast.present();
        },
        async (err: any) => {
          const toast = await this.toastController.create({
            message: 'Error al crear gasto. Inténtalo nuevamente.',
            duration: 2000,
            color: 'danger',
          });
          toast.present();
        }
      );
    }
  
    this.limpiarFormulario(); 
    this.router.navigate(['/home']);
  }

  limpiarFormulario() {
    this.nuevoGasto = {
      nombre: '',
      monto: '',
      fecha: '',
      correo: '',
      categorias: [],
      presupuesto: null,
      descripcion: '',
      tipo: 'debito',
      cuotas: 1,
    };
  }
}
