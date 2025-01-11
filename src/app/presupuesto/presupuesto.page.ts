import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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

  private apiUrl = 'https://189facc5-7642-4b17-a036-62e7c347b0a7-00-19wkpsd6w9uxl.picard.replit.dev';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {}

  crearPresupuesto() {
    if (this.nuevoPresupuesto.nombre && this.nuevoPresupuesto.fechaInicio && this.nuevoPresupuesto.fechaCorte) {
      this.http.post(`${this.apiUrl}/presupuestos`, this.nuevoPresupuesto).subscribe(
        (res: any) => {
          console.log('Presupuesto creado:', res);
          this.router.navigate(['/home']); 
        },
        (err: any) => {
          console.error('Error al crear presupuesto:', err);
          alert('Error al crear presupuesto. Inténtalo nuevamente.');
        }
      );
    } else {
      alert('Por favor, completa todos los campos.');
    }
  }
}
