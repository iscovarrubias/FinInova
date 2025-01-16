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
    categoria: '',
    correo: '', 
  };

  categorias: any[] = []; 

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

  async crearGasto() {
    const usuario = this.authService.getCurrentUser();
    const correo = usuario ? usuario.correo : this.nuevoGasto.correo;
  
    // Depuración: Verifica que el correo es correcto
    console.log('Correo obtenido:', correo);
  
    if (!correo) {
      const toast = await this.toastController.create({
        message: 'Por favor, ingresa un correo válido.',
        duration: 2000,
        color: 'warning',
      });
      toast.present();
      return;
    }
  
    // Depuración: Verifica que los campos están siendo llenados correctamente
    console.log('Nombre del gasto:', this.nuevoGasto.nombre);
    console.log('Monto:', this.nuevoGasto.monto);
    console.log('Fecha:', this.nuevoGasto.fecha);
  
    // Verificación de campos obligatorios
    if (!this.nuevoGasto.nombre || !this.nuevoGasto.monto || !this.nuevoGasto.fecha) {
      const toast = await this.toastController.create({
        message: 'Por favor, completa todos los campos.',
        duration: 2000,
        color: 'warning',
      });
      toast.present();
      return;
    }
  
    // Crear gasto
    this.usuarioService.obtenerUsuario(correo).subscribe(
      async (usuario: any) => {
        this.usuarioService.crearGasto(usuario.id, this.nuevoGasto, correo).subscribe(
          async (res: any) => {
            const toast = await this.toastController.create({
              message: 'Gasto creado con éxito.',
              duration: 2000,
              color: 'success',
            });
            toast.present();
            this.router.navigate(['/home']);
            this.limpiarFormulario();
          },
          async (err: any) => {
            const toast = await this.toastController.create({
              message: 'Error al crear gasto. Inténtalo nuevamente.',
              duration: 2000,
              color: 'danger',
            });
            toast.present();
            this.limpiarFormulario();
          }
        );
      },
      async (err: any) => {
        const toast = await this.toastController.create({
          message: 'El usuario no existe.',
          duration: 2000,
          color: 'danger',
        });
        toast.present();
      }
    );
  }
  
  limpiarFormulario() {
    this.nuevoGasto = {
      nombre: '',
      monto: '',
      fecha: '',
      categoria: '',
      correo: '',  
    };
  }
}  
