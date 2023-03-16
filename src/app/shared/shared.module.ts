import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { PrimengModule } from '../primeng/primeng.module';
import { ImgLandingPageComponent } from './img-landing-page/img-landing-page.component';
import { InputCodeComponent } from './input-code/input-code.component';
import { ListaVaciaComponent } from './lista-vacia/lista-vacia.component';
import { LoaddingComponent } from './loadding/loadding.component';
import { SkeletonTableComponent } from './skeleton-table/skeleton-table.component';
import { FormMatriculaComponent } from './form-matricula/form-matricula.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';


@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    ImgLandingPageComponent,
    InputCodeComponent,
    ListaVaciaComponent,
    LoaddingComponent,
    SkeletonTableComponent,
    FormMatriculaComponent
  ],
  imports: [
    CommonModule,
    PrimengModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  exports:[
    NavbarComponent,
    FooterComponent,
    ImgLandingPageComponent,
    InputCodeComponent,
    ListaVaciaComponent,
    LoaddingComponent,
    FormMatriculaComponent
  ]
})
export class SharedModule { }
