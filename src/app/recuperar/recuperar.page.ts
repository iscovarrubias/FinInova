import { Component } from '@angular/core';
import { UsuarioService } from '../api/usuario.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage {
  email: string = '';

  constructor(
    private usuarioService: UsuarioService,
    private toastController: ToastController
  ) {}

  async recuperar() {
    if (!this.email) {
      const toast = await this.toastController.create({
        message: 'Por favor, introduce un correo electrónico.',
        duration: 2000,
        color: 'warning',
      });
      await toast.present();
      return;
    }

    this.usuarioService.recuperarContraseña(this.email).subscribe(
      async (res) => {
        const toast = await this.toastController.create({
          message: res.message,
          duration: 2000,
          color: 'success',
        });
        await toast.present();
      },
      async (err) => {
        const toast = await this.toastController.create({
          message: err.error.message || 'Error al recuperar la contraseña.',
          duration: 2000,
          color: 'danger',
        });
        await toast.present();
      }
    );
  }
}
