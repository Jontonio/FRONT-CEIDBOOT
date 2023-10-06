import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-modal-comunicado-grupal',
  templateUrl: './modal-comunicado-grupal.component.html',
  styleUrls: ['./modal-comunicado-grupal.component.scss']
})
export class ModalComunicadoGrupalComponent implements OnInit {

  listaEstudiantesEnviar:any[] = [];

  constructor(private refDialog: DynamicDialogRef, private config: DynamicDialogConfig) {
    console.log(config.data.estudianteEnGrupo)
    this.listaEstudiantesEnviar = config.data.estudianteEnGrupo;
  }

  ngOnInit(): void {
  }

}
