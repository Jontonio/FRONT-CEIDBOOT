import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-aula',
  templateUrl: './aula.component.html',
  styleUrls: ['./aula.component.scss']
})
export class AulaComponent implements OnInit {

  constructor(private _global:GlobalService, private route:Router) {

    this._global.parseURL(route);

  }

  ngOnInit(): void {
  }

}
