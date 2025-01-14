import { Component, OnInit } from '@angular/core';
import { AuthService } from '../api/auth.service';  
import { Router } from '@angular/router'; 
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  user: any = {
    email: '',
    password: ''
  };

  constructor(
    private authService: AuthService, 
    private router: Router,
    private toastController: ToastController 
  ) { }

  ngOnInit() { }

  iniciarSesion() {
    if (!this.user.email || !this.user.password) {
      this.presentToast('Por favor ingresa tu correo y contraseña.', 'warning');
      return;
    }

    console.log('Iniciando sesión...');
    console.log(this.user.email);

    this.authService.login(this.user.email, this.user.password).subscribe(
      (res: any) => {
        console.log(res);
        if (res && res.length > 0 && res[0].correo === this.user.email && res[0].contraseña === this.user.password) {
          localStorage.setItem('userName', res[0].nombre);
          this.router.navigate(['/home']);
        } else {
          this.presentToast('Credenciales incorrectas. Intenta nuevamente.', 'warning');
          this.user.email = '';
          this.user.password = '';
        }
      },
      (err: any) => {
        console.log('Error:', err);
        this.presentToast('Error al iniciar sesión. Por favor, intenta nuevamente.', 'warning');
        this.user.email = '';
        this.user.password = '';
      }
    );
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color
    });
    toast.present();
  }

  irARegistro() {
    this.router.navigate(['/registro']); 
  }

  irARecuperar() {
    this.router.navigate(['/recuperar']); 
  }
}
