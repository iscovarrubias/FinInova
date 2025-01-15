import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { UsuarioService } from '../api/usuario.service';  
import { AuthService } from '../api/auth.service'; 

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
  };

  private apiUrl = 'http://localhost:3000';

  constructor(
    private http: HttpClient, 
    private router: Router,
    private toastController: ToastController,
    private usuarioService: UsuarioService, 
    private authService: AuthService  
  ) {}

  ngOnInit() {}

  async crearPresupuesto() {
    const usuario = this.authService.getCurrentUser(); 
    const correo = usuario ? usuario.correo : this.nuevoPresupuesto.correo;
  
    console.log('Correo a utilizar:', correo);
  
    if (!correo) {
      const toast = await this.toastController.create({
        message: 'Por favor, ingresa un correo válido.',
        duration: 2000,
        color: 'warning',
      });
      toast.present();
      return;
    }
  
    this.usuarioService.obtenerUsuario(correo).subscribe(
      async (usuario: any) => {
        console.log('Usuario encontrado:', usuario);
        if (this.nuevoPresupuesto.nombre && this.nuevoPresupuesto.fechaInicio && this.nuevoPresupuesto.fechaCorte) {
          this.usuarioService.crearPresupuesto(usuario.id, this.nuevoPresupuesto, correo).subscribe(
            async (res: any) => {
              console.log('Presupuesto creado:', res);
              const toast = await this.toastController.create({
                message: 'Presupuesto creado con éxito.',
                duration: 2000,
                color: 'success',
              });
              toast.present();
              this.router.navigate(['/home']);
              this.limpiarFormulario();
            },
            async (err: any) => {
              console.error('Error al crear presupuesto:', err);
              const toast = await this.toastController.create({
                message: 'Error al crear presupuesto. Inténtalo nuevamente.',
                duration: 2000,
                color: 'danger',
              });
              toast.present();
              this.limpiarFormulario();
            }
          );
        } else {
          const toast = await this.toastController.create({
            message: 'Por favor, completa todos los campos.',
            duration: 2000,
            color: 'warning',
          });
          toast.present();
        }
      },
      async (err: any) => {
        console.error('Error al obtener el usuario:', err);
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
    this.nuevoPresupuesto = {
      nombre: '',
      fechaInicio: '',
      fechaCorte: '',
      correo: '',
    };
  }
}
