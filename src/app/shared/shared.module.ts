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
import { ShowFileComponent } from './show-file/show-file.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { SafeUrlPipe } from '../pipes/safe-url.pipe';
import { IframeFileComponent } from './iframe-file/iframe-file.component';
import { NoteMessageComponent } from './note-message/note-message.component';
import { FormInfoPersonalComponent } from './form-info-personal/form-info-personal.component';
import { FormSelectIdiomaComponent } from './form-select-idioma/form-select-idioma.component';
import { FormAdjuntarArchivoComponent } from './form-adjuntar-archivo/form-adjuntar-archivo.component';
import { FormTipoTramiteComponent } from './form-tipo-tramite/form-tipo-tramite.component';
import { FormSelectInfoPersonalComponent } from './form-select-info-personal/form-select-info-personal.component';


@NgModule({
  declarations: [
    SafeUrlPipe,
    NavbarComponent,
    FooterComponent,
    ImgLandingPageComponent,
    InputCodeComponent,
    ListaVaciaComponent,
    LoaddingComponent,
    SkeletonTableComponent,
    FormMatriculaComponent,
    ShowFileComponent,
    IframeFileComponent,
    NoteMessageComponent,
    FormInfoPersonalComponent,
    FormSelectIdiomaComponent,
    FormAdjuntarArchivoComponent,
    FormTipoTramiteComponent,
    FormSelectInfoPersonalComponent
  ],
  imports: [
    CommonModule,
    PrimengModule,
    MaterialModule,
    ReactiveFormsModule,
    NgxSpinnerModule
  ],
  exports:[
    NavbarComponent,
    FooterComponent,
    ImgLandingPageComponent,
    InputCodeComponent,
    ListaVaciaComponent,
    LoaddingComponent,
    FormMatriculaComponent,
    ShowFileComponent,
    IframeFileComponent,
    NoteMessageComponent,
    FormInfoPersonalComponent,
    FormSelectIdiomaComponent,
    FormAdjuntarArchivoComponent,
    FormTipoTramiteComponent,
    FormSelectInfoPersonalComponent
  ]
})
export class SharedModule { }
