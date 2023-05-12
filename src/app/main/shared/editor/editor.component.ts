import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import * as DOMPurify from 'dompurify';
import { Editor } from 'primeng/editor';
import { Plantilla } from '../../chat-bot/class/Plantilla';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  @ViewChild('editor') editor: Editor;
  @Output() textMsg = new EventEmitter<string>();
  @Input() loading:boolean = false;

  sanitizado:string;
  text:string = '';
  listReplace:string[] = ['</strong>','<strong>'];
  listPlantillas:Plantilla[];

  constructor() { }

  ngOnInit(): void {
    this.inicializarPlantillas();
  }

  parseHTMLtoPlainText(html: string): string {
    // Limpia el HTML utilizando DOMPurify
    const cleanHtml = DOMPurify.sanitize(html);

    // Obtiene el contenido de las etiquetas strong y los reemplaza por *
    const strongRegex = /<strong>(.*?)<\/strong>/g;
    const textWithBold = cleanHtml.replace(strongRegex, '*$1*');

    // Obtiene el contenido de las etiquetas em y los reemplaza por _
    const emRegex = /<em>(.*?)<\/em>/g;
    const textWithEmphasis = textWithBold.replace(emRegex, '_$1_');

    // Obtiene el contenido de las etiquetas em y los reemplaza por _
    const sRegex = /<s>(.*?)<\/s>/g;
    const textWithS = textWithEmphasis.replace(sRegex, '~$1~');

    // Obtiene el contenido de las etiquetas p y los reemplaza por \n\n
    const pRegex = /<p>(.*?)<\/p>/g;
    const textWithNewLines = textWithS.replace(pRegex, '$1\n\n');

    const textoSinHtml = textWithNewLines.replace(/<\/?[^>]+(>|$)/g, '').replace(/<a\b[^>]*>([^<]*)<\/a>/gi, '$1');
    const enlacesReemplazados = textoSinHtml.replace(/\bhttps?:\/\/\S+/gi, (match) => match.trim() );

    // Retorna el texto plano parseado
    return enlacesReemplazados.trim();
  }

  ready(){
    this.loading = true;
    this.sanitizado = this.parseHTMLtoPlainText(this.text)
    this.textMsg.emit(this.sanitizado);
  }

  inicializarPlantillas(){
    this.listPlantillas = [
      {
        icon:'fa-solid fa-file',
        label:'Documentos',
        value:'<p>Lo sentimos, su documento para ser matriculado en CEID ha sido rechazado.</p><p>Por favor revise cuidadosamente los requisitos de matrícula y asegúrese de que su documento cumpla con todas las especificaciones.</p><br><p>Si necesita más información, puede comunicarse con nuestro equipo de admisiones.</p><p>Estamos aquí para ayudarlo en todo lo que necesite. 🤗</p>'
      },
      {
        icon:'fa-solid fa-circle-exclamation',
        label:'Matricula',
        value:`<p>Estimado estudiante:</p><p>Le recordamos que aún no hemos recibido su pago de matrícula en CEID.</p><br><p>Por favor, realice su pago a la brevedad posible para evitar retrasos en su proceso de matrícula.</p><p>Si tiene alguna pregunta o necesita ayuda para realizar el pago, no dude en comunicarse con nuestro equipo de finanzas.</p><p>¡Esperamos tenerlo pronto como parte de nuestra comunidad estudiantil! 😊</p>`
      },
      {
        icon:'fa-solid fa-sack-dollar',
        label:'Mensualidad',
        value:`<p>Le informamos que el estudiante con el número de matrícula XXX-YYY aún tiene un pago de mensualidad pendiente en CEID.</p><p>Recuerde que el pago oportuno de las mensualidades es importante para mantener su matrícula activa y evitar retrasos en su proceso de formación.</p><br><p>Si ya realizó su pago, por favor ignore este mensaje.</p><p>En caso contrario, le recordamos que puede acercarse a nuestras instalaciones para hacer efectivo su pago o bien utilizar nuestros medios de pago en línea.</p><p>No dude en contactarnos si tiene alguna duda o necesita más información. 📞</p>`
      },
      {
        icon:'fa-solid fa-circle-exclamation',
        label:'Pago libro',
        value:'<p>Le informamos que aún no hemos recibido el pago correspondiente al libro de estudiante.</p><p>Por favor, asegúrese de completar el pago a la mayor brevedad posible para poder recibir su libro.</p><br><p>Si tiene alguna pregunta o necesita más información, no dude en ponerse en contacto con nosotros.</p><p>Estamos aquí para ayudarlo en todo lo que necesite. 😊</p>'
      },

    ]
  }

  setPlantilla({ value }:Plantilla){
    this.text = value.trim();
  }

}
