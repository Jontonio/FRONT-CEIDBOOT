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

  constructor() { }

  ngOnInit(): void {
  }

  folders: Section[] = [
    {
      name: 'Vacation Itinerary',
      link: '',
    },
    {
      name: 'Kitchen Remodel',
      link: '',
    },
  ];
  notes: Section[] = [
    {
      name: 'Descarque el formato de declaración jurada aquí',
      link: 'https://drive.google.com/drive/folders/1zZhE0LOJn6ITSNzP3LuyZzfHbuinjQds?fbclid=IwAR3HDCI8yiiNMGj8fmqq61eh2_KMREbI8kv94so_Vu6iJjYKDUqZh2W4XRA',
    },
    {
      name: 'Descarque el formato de solicitud aquí',
      link: 'https://drive.google.com/drive/folders/1zZhE0LOJn6ITSNzP3LuyZzfHbuinjQds?fbclid=IwAR3HDCI8yiiNMGj8fmqq61eh2_KMREbI8kv94so_Vu6iJjYKDUqZh2W4XRA',
    }
  ];

}
