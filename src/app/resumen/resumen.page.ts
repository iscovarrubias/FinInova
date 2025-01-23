import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../api/usuario.service';
import { AuthService } from '../api/auth.service';
import { Chart, ArcElement, CategoryScale, LinearScale, Title, Tooltip, Legend, DoughnutController } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';  

Chart.register(ArcElement, CategoryScale, LinearScale, Title, Tooltip, Legend, DoughnutController, ChartDataLabels); 

interface Categoria {
  id: number;
  nombre: string;
}

interface Gasto {
  monto: number;
  categorias: number[];
}

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.page.html',
  styleUrls: ['./resumen.page.scss'],
})
export class ResumenPage implements OnInit {

  categories: Categoria[] = [];
  expenses: Gasto[] = [];
  percentages: string[] = []; 
  description: string = 'Resumen de tus gastos por categoría';
  chart: any;

  constructor(private usuarioService: UsuarioService, private authService: AuthService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.usuarioService.obtenerCategorias().subscribe({
      next: (data: Categoria[]) => {
        this.categories = data;
        this.updateChart();
      },
      error: (err) => {
        console.error('Error al obtener las categorías:', err);
      }
    });

    const currentUser = this.authService.getCurrentUser();
    this.usuarioService.obtenerGastos(currentUser.correo).subscribe({
      next: (data: Gasto[]) => {
        this.expenses = data;
        this.updateChart();
      },
      error: (err) => {
        console.error('Error al obtener los gastos:', err);
      }
    });
  }

  updateChart() {
    if (this.categories.length > 0 && this.expenses.length > 0) {
      const categoryAmounts = this.categories.map(cat => 
        this.expenses.filter(exp => exp.categorias.includes(cat.id)).reduce((acc, exp) => acc + exp.monto, 0)
      );

      const validCategories = this.categories.filter((cat, index) => categoryAmounts[index] > 0);
      const validCategoryAmounts = categoryAmounts.filter(amount => amount > 0);
      
      const totalAmount = validCategoryAmounts.reduce((acc, amount) => acc + amount, 0);
      
      this.percentages = validCategoryAmounts.map(amount => ((amount / totalAmount) * 100).toFixed(2));

      if (this.chart) {
        this.chart.data.labels = validCategories.map(cat => cat.nombre);
        this.chart.data.datasets[0].data = validCategoryAmounts;
        this.chart.update();
      } else {
        this.chart = new Chart('myChart', {
          type: 'doughnut',
          data: {
            labels: validCategories.map(cat => cat.nombre),
            datasets: [{
              label: 'Montos por Categoría',
              data: validCategoryAmounts,
              backgroundColor: ['#ff89d2', '#ff58ab', '#ff1c3e', '#ffb1e4', '#ff6f76'],
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
                  size: 16,
                },
                formatter: (value, context) => {
                  const percentage = this.percentages[context.dataIndex]; 
                  return `${percentage}%`; 
                }
              }
            }
          }
        });
      }
    }
  }
}
