import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-enviar-mensaje',
  templateUrl: './enviar-mensaje.component.html',
  styleUrls: ['./enviar-mensaje.component.scss']
})
export class EnviarMensajeComponent implements OnInit {

  text:any;
  constructor() { }
  ngOnInit(): void {
  }

  send(){
    console.log(this.text)
  }

}
