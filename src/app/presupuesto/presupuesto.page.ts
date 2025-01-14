import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-presupuesto',
  templateUrl: './presupuesto.page.html',
  styleUrls: ['./presupuesto.page.scss'],
})
export class PresupuestoPage implements OnInit {

  nuevoPresupuesto: any = {
    nombre: '',
    fechaInicio: '',
    fechaCorte: ''
  };

  private apiUrl = 'http://localhost:3000';

  constructor(
    private http: HttpClient, 
    private router: Router,
    private toastController: ToastController
  ) {}

  ngOnInit() {}

  async crearPresupuesto() {
    console.log('Datos del presupuesto:', this.nuevoPresupuesto); // Depuración para verificar los valores

    if (this.nuevoPresupuesto.nombre && this.nuevoPresupuesto.fechaInicio && this.nuevoPresupuesto.fechaCorte) {
      this.http.post(`${this.apiUrl}/presupuestos`, this.nuevoPresupuesto).subscribe(
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
  }

  limpiarFormulario() {
    this.nuevoPresupuesto = {
      nombre: '',
      fechaInicio: '',
      fechaCorte: ''
    };
  }
}

