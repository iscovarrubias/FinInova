import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { UsuarioService } from '../api/usuario.service';  
import { AuthService } from '../api/auth.service';  
import { NavController } from '@ionic/angular'; 

@Component({
  selector: 'app-presupuesto',
  templateUrl: './presupuesto.page.html',
  styleUrls: ['./presupuesto.page.scss'],
})
export class PresupuestoPage implements OnInit {

  nuevoPresupuesto: any = {  
    nombre: '',
    fechaInicio: '',
    fechaCorte: '',
    correo: '', 
    categorias: [], 
    compartir: false 
  };
  
  categorias: any[] = [];

  private apiUrl = 'http://localhost:3000';

  constructor(
    private http: HttpClient, 
    private router: Router,
    private toastController: ToastController,
    private usuarioService: UsuarioService, 
    private authService: AuthService,
    private navController: NavController
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

  async crearPresupuesto() {
    const usuario = this.authService.getCurrentUser();
    
    if (!usuario || !usuario.correo) {
      const toast = await this.toastController.create({
        message: 'No se pudo obtener el correo del usuario.',
        duration: 2000,
        color: 'danger',
      });
      toast.present();
      return;
    }
  
    this.nuevoPresupuesto.correo = usuario.correo;
  
    if (this.nuevoPresupuesto.categoria) {
      this.nuevoPresupuesto.categorias.push(this.nuevoPresupuesto.categoria);
      delete this.nuevoPresupuesto.categoria;
    }
  
    if (!this.nuevoPresupuesto.nombre || !this.nuevoPresupuesto.fechaInicio || !this.nuevoPresupuesto.fechaCorte) {
      const toast = await this.toastController.create({
        message: 'Por favor, completa todos los campos.',
        duration: 2000,
        color: 'warning',
      });
      toast.present();
      return;
    }
  
    if (this.nuevoPresupuesto.compartir) {
      const correoDestino = this.nuevoPresupuesto.correoDestino;
  
      if (!correoDestino) {
        const toast = await this.toastController.create({
          message: 'Por favor, ingresa un correo del destinatario.',
          duration: 2000,
          color: 'warning',
        });
        toast.present();
        return;
      }
  
      this.usuarioService.verificarCorreo(correoDestino).subscribe(
        async (usuarios) => {
          if (usuarios && usuarios.length > 0) {
            this.usuarioService.crearPresupuesto(usuario.id, this.nuevoPresupuesto, correoDestino)
              .subscribe(
                async () => {
                  const toast = await this.toastController.create({
                    message: 'Presupuesto compartido con éxito.',
                    duration: 2000,
                    color: 'success',
                  });
                  toast.present();
                  this.router.navigate(['/home']);
                  this.limpiarFormulario();
                },
                async () => {
                  const toast = await this.toastController.create({
                    message: 'Error al compartir el presupuesto.',
                    duration: 2000,
                    color: 'danger',
                  });
                  toast.present();
                }
              );
          } else {
            const toast = await this.toastController.create({
              message: 'El correo proporcionado no está registrado.',
              duration: 2000,
              color: 'danger',
            });
            toast.present();
          }
        },
        async (error) => {
          const toast = await this.toastController.create({
            message: 'Error al verificar el correo.',
            duration: 2000,
            color: 'danger',
          });
          toast.present();
        }
      );
    } else {
      this.usuarioService.crearPresupuesto(usuario.id, this.nuevoPresupuesto)
        .subscribe(
          async () => {
            const toast = await this.toastController.create({
              message: 'Presupuesto creado con éxito.',
              duration: 2000,
              color: 'success',
            });
            toast.present();
            this.router.navigate(['/home']);
            this.limpiarFormulario();
          },
          async () => {
            const toast = await this.toastController.create({
              message: 'Error al crear el presupuesto.',
              duration: 2000,
              color: 'danger',
            });
            toast.present();
          }
        );
    }
  }
  
  limpiarFormulario() {
    this.nuevoPresupuesto = {
      nombre: '',
      fechaInicio: '',
      fechaCorte: '',
      correo: '',
      categorias: [],  
      compartir: false,
    };
  }

  volverAtras() {
    this.navController.back();
  }
}
