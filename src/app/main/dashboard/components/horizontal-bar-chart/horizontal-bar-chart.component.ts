import { Component, Input } from '@angular/core';
import { DataHorizontalBar } from 'src/app/class/Graphics';
import { EstadoGrupo } from 'src/app/main/grupo/class/EstadoGrupo';
import { DashboardService } from '../../services/dashboard.service';
import { GrupoService } from 'src/app/main/grupo/services/grupo.service';
import { LegendPosition } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-horizontal-bar-chart',
  templateUrl: './horizontal-bar-chart.component.html',
  styleUrls: ['./horizontal-bar-chart.component.scss']
})
export class HorizontalBarChartComponent {

  @Input() data: DataHorizontalBar[] = [];
  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  yAxisLabel: string = 'Grupos';
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Cantidad de estudiantes';

  constructor() {

              }
              onSelect(data:any): void {
                console.log('Item clicked', JSON.parse(JSON.stringify(data)));
              }

              onActivate(data:any): void {
                console.log('Activate', JSON.parse(JSON.stringify(data)));
              }

              onDeactivate(data:any): void {
                console.log('Deactivate', JSON.parse(JSON.stringify(data)));
              }







}
