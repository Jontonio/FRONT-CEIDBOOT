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


@NgModule({
  declarations: [
    MainComponent,
    WeComponent,
    MorThingsComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    PrimengModule,
    LandingPageRoutingModule,
    SharedModule,
    AuthModule
  ]
})
export class LandingPageModule { }
