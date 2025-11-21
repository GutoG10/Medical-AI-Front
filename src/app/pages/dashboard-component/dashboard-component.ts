import { Component } from '@angular/core';
import { GraficoPizzaComponent } from '../../components/grafico-pizza/grafico-pizza.component';
import { GraficoLineComponent } from '../../components/grafico-line/grafico-line.component';
import { GraficoBarraComponent } from '../../components/grafico-barra/grafico-barra.component';

@Component({
  selector: 'app-dashboard-component',
  imports: [GraficoPizzaComponent, GraficoLineComponent, GraficoBarraComponent],
  templateUrl: './dashboard-component.html',
})
export class DashboardComponent {}
