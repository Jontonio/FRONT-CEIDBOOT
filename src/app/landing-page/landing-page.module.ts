import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingPageRoutingModule } from './landing-page-routing.module';
import { MainComponent } from './pages/main/main.component';
import { WeComponent } from './pages/we/we.component';
import { MorThingsComponent } from './pages/mor-things/mor-things.component';

import { PrimengModule } from '../primeng/primeng.module';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SharedModule } from '../shared/shared.module';
import { AuthModule } from '../auth/auth.module';
import { MatriculaComponent } from './pages/matricula/matricula.component';
import { MessageService } from 'primeng/api';
import { MaterialModule } from '../material/material.module';
import { PagosComponent } from './pages/pagos/pagos.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MainComponent,
    WeComponent,
    MorThingsComponent,
    HomeComponent,
    MatriculaComponent,
    PagosComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    PrimengModule,
    MaterialModule,
    LandingPageRoutingModule,
    SharedModule,
    AuthModule
  ],
  providers:[MessageService]
})
export class LandingPageModule { }
