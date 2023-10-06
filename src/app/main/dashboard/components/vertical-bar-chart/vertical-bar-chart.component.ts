import { Component, Input, SimpleChanges } from '@angular/core';
import { DataVerticalBar } from 'src/app/class/Graphics';


@Component({
  selector: 'app-vertical-bar-chart',
  templateUrl: './vertical-bar-chart.component.html',
  styleUrls: ['./vertical-bar-chart.component.scss']
})
export class VerticalBarChartComponent {

  @Input() data: DataVerticalBar[] = [];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = true;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  showYAxisLabel: boolean = true;
  yAxisLabel: string = 'Número de registros';
  xAxisLabel: string = 'Módulos del curso';
  legendTitle: string = 'Years';

  constructor() {
  }

}
