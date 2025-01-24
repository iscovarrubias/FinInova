import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../api/usuario.service';
import { AuthService } from '../api/auth.service';
import { ToastController } from '@ionic/angular';  
import { Chart, ArcElement, CategoryScale, LinearScale, Title, Tooltip, Legend, DoughnutController } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { NavController } from '@ionic/angular'; 

Chart.register(ArcElement, CategoryScale, LinearScale, Title, Tooltip, Legend, DoughnutController, ChartDataLabels);

interface Categoria {
  id: number;
  nombre: string;
}

interface Presupuesto {
  id: string;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaCorte: string;
  correo: string;
  categorias: number[];
  compartir: boolean;
  correoDestino: string | null;
}

interface Gasto {
  monto: number;
  nombre: string;
  categorias: number[];
  presupuesto: string; 
  descripcion: string;
  fecha: string;
  tipo: string;
  cuotas: number;
}

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.page.html',
  styleUrls: ['./resumen.page.scss'],
})
export class ResumenPage implements OnInit {

  categorias: Categoria[] = [];
  gastos: Gasto[] = [];
  presupuestos: Presupuesto[] = [];
  presupuestosFiltrados: Presupuesto[] = [];
  porcentajes: string[] = [];
  descripcion: string = 'Resumen de tus gastos por categoría';
  grafico: any;
  consultaBusqueda: string = '';
  categoriaSeleccionada: number | null = null;
  currentDate: string = '';

  constructor(private usuarioService: UsuarioService, private authService: AuthService, private toastController: ToastController, private navController: NavController ) {}

  ngOnInit() {

    const date = new Date();
    this.currentDate = date.toLocaleString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

    this.cargarDatos();
  }

  cargarDatos() {
    this.usuarioService.obtenerCategorias().subscribe({
      next: (data: Categoria[]) => {
        this.categorias = data;
        this.actualizarGrafico();
      },
      error: async (err) => {
        console.error('Error al obtener las categorías:', err);
        const toast = await this.toastController.create({
          message: 'Error al cargar las categorías.',
          duration: 2000,
          color: 'danger',
        });
        toast.present();
      }
    });

    const usuarioActual = this.authService.getCurrentUser();
    this.usuarioService.obtenerGastos(usuarioActual.correo).subscribe({
      next: (data: Gasto[]) => {
        console.log('Gastos:', data);
        this.gastos = data;
        this.actualizarGrafico();
      },
      error: async (err) => {
        console.error('Error al obtener los gastos:', err);
        const toast = await this.toastController.create({
          message: 'Error al cargar los gastos.',
          duration: 2000,
          color: 'danger',
        });
        toast.present();
      }
    });

    this.usuarioService.obtenerPresupuestos(usuarioActual.correo).subscribe({
      next: (data: Presupuesto[]) => {
        console.log('Presupuestos:', data);
        this.presupuestos = data;
        this.presupuestosFiltrados = data;
      },
      error: async (err) => {
        console.error('Error al obtener los presupuestos:', err);
        const toast = await this.toastController.create({
          message: 'Error al cargar los presupuestos.',
          duration: 2000,
          color: 'danger',
        });
        toast.present();
      }
    });
  }

  obtenerDescripcionGasto(presupuestoId: string): string {
    const gasto = this.gastos.find(gasto => gasto.presupuesto === presupuestoId);
    return gasto ? gasto.descripcion : 'Descripción no disponible';
  }

  obtenerGastoPorId(presupuestoId: string): Gasto | undefined {
    return this.gastos.find(gasto => gasto.presupuesto === presupuestoId);
  }

  obtenerMontoTotal(categorias: number[]): number {
    const gastosUnicos = new Set();
  
    return this.gastos
      .filter(exp => categorias.some(id => exp.categorias.includes(id)))
      .reduce((acc, exp) => {
        if (!gastosUnicos.has(exp.nombre + exp.fecha)) {
          gastosUnicos.add(exp.nombre + exp.fecha);
          return acc + exp.monto;
        }
        return acc;
      }, 0);
  }  
  
  obtenerCuotas(presupuestoId: string): number {
    const gasto = this.gastos.find(gasto => gasto.presupuesto === presupuestoId);
    return gasto ? gasto.cuotas : 0; 
  }

  actualizarGrafico() {
    if (this.categorias.length > 0 && this.gastos.length > 0) {
      const montosPorCategoria = this.categorias.map(cat =>
        this.gastos.filter(exp => exp.categorias.includes(cat.id)).reduce((acc, exp) => {
          return acc + exp.monto;
        }, 0)
      );

      const categoriasValidas = this.categorias.filter((cat, index) => montosPorCategoria[index] > 0);
      const montosValidos = montosPorCategoria.filter(monto => monto > 0);

      const montoTotal = montosValidos.reduce((acc, monto) => acc + monto, 0);

      this.porcentajes = montosValidos.map(monto => ((monto / montoTotal) * 100).toFixed(2));

      if (this.grafico) {
        this.grafico.data.labels = categoriasValidas.map(cat => cat.nombre);
        this.grafico.data.datasets[0].data = montosValidos;
        this.grafico.update();
      } else {
        this.grafico = new Chart('miGrafico', {
          type: 'doughnut',
          data: {
            labels: categoriasValidas.map(cat => cat.nombre),
            datasets: [{
              label: 'Montos por Categoría',
              data: montosValidos,
              backgroundColor: [
                '#CDB4DB', 
                '#FFC8DD',
                '#FFAFCC', 
                '#BDE0FE',
                '#A2D2FF'  
              ],
              borderColor: '#ffffff',
              borderWidth: 2
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Distribución de Gastos por Categoría'
              },
              datalabels: {
                color: '#fff',
                font: {
                  weight: 'bold',
                  size: 20,
                },
                formatter: (value, context) => {
                  const porcentaje = this.porcentajes[context.dataIndex];
                  return `${porcentaje}%`;
                }
              }
            }
          }
        });
      }
    }
  }

  filtrarDatos() {
    if (this.consultaBusqueda.trim() === '') {
      this.presupuestosFiltrados = this.presupuestos;
    } else {
      this.presupuestosFiltrados = this.presupuestos.filter(presupuesto => {
        const nombreCategoria = this.categorias.find(cat => cat.id === presupuesto.categorias[0])?.nombre || '';
        const nombrePresupuesto = presupuesto.nombre || '';

        const match = nombreCategoria.toLowerCase().includes(this.consultaBusqueda.toLowerCase()) ||
                       nombrePresupuesto.toLowerCase().includes(this.consultaBusqueda.toLowerCase());

        console.log(`Filtrando: ${nombrePresupuesto} - match: ${match}`);
        return match;
      });
    }
  }

  filtrarPorCategoria() {
    if (this.categoriaSeleccionada !== null) {
      this.presupuestosFiltrados = this.presupuestos.filter(presupuesto =>
        presupuesto.categorias.includes(this.categoriaSeleccionada as number)
      );
    } else {
      this.presupuestosFiltrados = this.presupuestos;
    }
  }

  obtenerNombresCategorias(categorias: number[]): string {
    return categorias.map(id => this.categorias.find(cat => cat.id === id)?.nombre).join(', ');
  }

  limpiarFiltros() {
    this.consultaBusqueda = '';
    this.categoriaSeleccionada = null;
    this.presupuestosFiltrados = [...this.presupuestos]; 
  }

  volverAtras() {
    this.navController.back();
  }
}
