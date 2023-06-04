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
export class ExampleNumOperacionComponent {

  ejemplos:Voucher[];

  constructor() { }

}
