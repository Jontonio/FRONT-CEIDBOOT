import { Component, OnInit } from '@angular/core';

interface Voucher{
  url:string,
  header:string
}

@Component({
  selector: 'app-example-num-operacion',
  templateUrl: './example-num-operacion.component.html',
  styleUrls: ['./example-num-operacion.component.scss']
})
export class ExampleNumOperacionComponent implements OnInit {

  ejemplos:Voucher[];

  constructor() { }

  ngOnInit(): void {
    this.ejemplos = [
      { header:'Comprobante de depósito realizado en un agente del banco de la nación', url:'https://res.cloudinary.com/dodd3ff0n/image/upload/v1681923808/ejemplo01_dxs3ko.jpg' },
      { header:'Comprobante de pago en caja de la UNAJMA', url:'https://res.cloudinary.com/dodd3ff0n/image/upload/v1681923996/ejemplo04_fdwtzf.png' },
      { header:'Constancia de transferencia de banco de la nación a banco de la nación', url:'https://res.cloudinary.com/dodd3ff0n/image/upload/v1681923808/ejemplo02_pr5kmh.jpg' },
      { header:'Comprobante de depósito realizado en un agente del banco de la nación', url:'https://res.cloudinary.com/dodd3ff0n/image/upload/v1681923808/ejemplo03_pebyz7.jpg' },
    ]
  }

}
