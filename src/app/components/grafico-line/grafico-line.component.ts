import { Component, Input, OnChanges } from '@angular/core';
import { Chart, ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-grafico-line',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './grafico-line.component.html',
})
export class GraficoLineComponent implements OnChanges {
  @Input() titulo: string = '';
  @Input() labels: string[] = [];
  @Input() valores: number[] = [];
  @Input() corPrimaria: string = '#4A6CF7';

  lineChartData!: ChartData<'line'>;

  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    elements: {
      line: {
        tension: 0,
        borderWidth: 2,
      },
      point: {
        radius: 4,
        hoverRadius: 6,
        hitRadius: 15,
        pointStyle: 'circle',
        backgroundColor: 'white',
        borderWidth: 2,
      },
    },
    scales: {
      x: {
        ticks: { color: '#555' },
        grid: { color: '#e0e0e0' },
      },
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          color: '#555',
          stepSize: 20,
        },
        grid: { color: '#e0e0e0' },
      },
    },
  };
  ngOnChanges(): void {
    this.lineChartData = {
      labels: this.labels,
      datasets: [
        {
          label: 'Vendas',
          data: this.valores,
          borderColor: this.corPrimaria,
          backgroundColor: this.corPrimaria + '33',
          tension: 0,
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: 'white',
          pointBorderColor: this.corPrimaria,
          pointBorderWidth: 2,
          fill: 'origin',
          type: 'line' as const,
        },
      ],
    };
  }
}
