import { Component, OnInit, Input } from '@angular/core';
import { LegendPosition } from '@swimlane/ngx-charts';
import { Data } from '../../class/ReportePagos';

@Component({
  selector: 'app-pie-grid-chart',
  templateUrl: './pie-grid-chart.component.html',
  styleUrls: ['./pie-grid-chart.component.scss']
})
export class PieGridChartComponent {

  @Input() data: Data[] = [];
  @Input() title:string = ''
  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  constructor() {
  }

}
