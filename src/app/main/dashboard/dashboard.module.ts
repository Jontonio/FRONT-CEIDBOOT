import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { MaterialModule } from 'src/app/material/material.module';
import { HorizontalBarChartComponent } from './components/horizontal-bar-chart/horizontal-bar-chart.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { VerticalBarChartComponent } from './components/vertical-bar-chart/vertical-bar-chart.component';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { PieGridChartComponent } from './components/pie-grid-chart/pie-grid-chart.component';


@NgModule({
  declarations: [
    DashboardComponent,
    HorizontalBarChartComponent,
    VerticalBarChartComponent,
    LineChartComponent,
    PieGridChartComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    PrimengModule,
    MaterialModule,
    NgxChartsModule
  ]
})
export class DashboardModule { }
