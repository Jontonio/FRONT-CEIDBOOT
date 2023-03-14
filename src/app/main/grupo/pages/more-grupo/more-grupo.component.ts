import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { GrupoService } from 'src/app/main/grupo/services/grupo.service';

@Component({
  selector: 'app-more-grupo',
  templateUrl: './more-grupo.component.html',
  styleUrls: ['./more-grupo.component.scss']
})
export class MoreGrupoComponent implements OnInit {

  constructor(){}

  ngOnInit(): void {}

}
