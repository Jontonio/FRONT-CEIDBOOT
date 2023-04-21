import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PrimengModule } from 'src/app/primeng/primeng.module';
import { MaterialModule } from 'src/app/material/material.module';
import { HorizontalBarChartComponent } from './components/horizontal-bar-chart/horizontal-bar-chart.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';


@NgModule({
  declarations: [
    DashboardComponent,
    HorizontalBarChartComponent
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
