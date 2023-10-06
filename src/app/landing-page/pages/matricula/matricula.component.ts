import { Component, OnInit } from '@angular/core';

export interface Section {
  name: string;
  link: string;
}

@Component({
  selector: 'app-matricula',
  templateUrl: './matricula.component.html',
  styleUrls: ['./matricula.component.scss']
})
export class MatriculaComponent implements OnInit {

  msg:string;

  constructor() { }

  ngOnInit(): void {
    this.msg = 'Ten en cuenta que algunos cursos requieren los vouchers de pago. Consulta los precios en los requisitos de los cursos.'
  }

  folders: Section[] = [
    {
      name: '¿Dónde encuentro el número de operación de mi pago?',
      link: 'https://unajma.ceidbot.com/#/main/example/numero-operacion',
    }
  ];
  notes: Section[] = [
    {
      name: 'Descarga el formato de declaración jurada aquí.',
      link: 'https://drive.google.com/drive/folders/1zZhE0LOJn6ITSNzP3LuyZzfHbuinjQds?fbclid=IwAR3HDCI8yiiNMGj8fmqq61eh2_KMREbI8kv94so_Vu6iJjYKDUqZh2W4XRA',
    },
    {
      name: 'Descarga el formato de solicitud aquí.',
      link: 'https://drive.google.com/drive/folders/1zZhE0LOJn6ITSNzP3LuyZzfHbuinjQds?fbclid=IwAR3HDCI8yiiNMGj8fmqq61eh2_KMREbI8kv94so_Vu6iJjYKDUqZh2W4XRA',
    }
  ];

}
