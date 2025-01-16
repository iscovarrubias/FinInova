import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../api/usuario.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  user: any = {
    nombre: '',
    email: '',
    password: '',
    fecha: '',
    genero: ''
  };

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() { }

  registrar() {
    if (!this.user.email || !this.user.password || !this.user.nombre) {
      this.presentToast('Por favor completa todos los campos.', 'warning');
      return;
    }

    if (!this.isValidEmail(this.user.email)) {
      this.presentToast('El formato del correo electrónico es inválido.', 'warning');
      return;
    }

    this.usuarioService.verificarCorreo(this.user.email).subscribe(
      (res: any[]) => { 
        if (res.length > 0) { 
          this.presentToast('El correo electrónico ya está en uso.', 'warning');
          this.limpiarCampos(); 
        } else {
          this.usuarioService.registrarUsuario(this.user).subscribe(
            (response) => {
              console.log(response);
              this.presentToast('Registro exitoso. Puedes iniciar sesión!.', 'success');
              this.router.navigate(['/login']);
            },
            (err) => {
              console.log(err);
              this.presentToast('Error al registrar el usuario. Intenta nuevamente.', 'danger');
              this.limpiarCampos(); 
            }
          );
        }
      },
      (err) => {
        console.log(err);
        this.presentToast('Error al verificar el correo. Intenta nuevamente.', 'danger');
        this.limpiarCampos();  
      }
    );
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color
    });
    toast.present();
  }

  limpiarCampos() {
    this.user.nombre = '';
    this.user.email = '';
    this.user.password = '';
    this.user.fecha = '';
    this.user.genero = '';
  }
}
