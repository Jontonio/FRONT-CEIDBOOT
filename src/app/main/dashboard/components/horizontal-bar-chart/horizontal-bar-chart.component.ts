import { Component, Input } from '@angular/core';
import { DataHorizontalBar } from 'src/app/class/Graphics';

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

  constructor() {}

}
