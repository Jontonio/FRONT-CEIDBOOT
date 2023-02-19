import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { PrimengModule } from '../primeng/primeng.module';
import { ImgLandingPageComponent } from './img-landing-page/img-landing-page.component';


@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    ImgLandingPageComponent
  ],
  imports: [
    CommonModule,
    PrimengModule
  ],
  exports:[
    NavbarComponent,
    FooterComponent,
    ImgLandingPageComponent
  ]
})
export class SharedModule { }
