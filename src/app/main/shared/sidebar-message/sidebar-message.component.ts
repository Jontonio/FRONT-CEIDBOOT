import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Message } from '../../chat-bot/class/Message';
import { Estudiante } from '../../matricula/class/Estudiante';
import { ChabotService } from '../../chat-bot/services/chatbot.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-sidebar-message',
  templateUrl: './sidebar-message.component.html',
  styleUrls: ['./sidebar-message.component.scss']
})
export class SidebarMessageComponent implements OnInit {

  @Input()  sidebarMessage:boolean;
  @Input()  dataEstudiante:Estudiante;
  @Output() estadoModal = new EventEmitter<boolean>();

  destino:string;
  loadingSend:boolean;
  text:string = '';

  constructor( private readonly _chatboot:ChabotService,
               private readonly _msg:MessageService) { }

  ngOnInit(): void {
    this.loadingSend = false;
    this.destino = 'e1';
  }

  openSidebar(){
    this.sidebarMessage = true;
  }

  closeSidebar(){
    this.sidebarMessage = false
  }

  onCloseModal(){
    this.sidebarMessage = false;
    this.estadoModal.emit( this.sidebarMessage );
  }

  destinoSend(estudiante: Estudiante){
    if(estudiante.apoderado && this.destino=='a1'){
      const {CodePhone, CelApoderado} = estudiante.apoderado;
      return `${CodePhone}${CelApoderado}`.replace('+','').concat('@c.us').trim();
    }
    const { CodePhone, Celular} = estudiante;
    return `${CodePhone}${Celular}`.replace('+','').concat('@c.us').trim();
  }

  sendMessage(event:string){
    this.text = event;
    const numeroCelular = this.destinoSend( this.dataEstudiante );
    const message = new Message(this.dataEstudiante.Nombres.toUpperCase(), numeroCelular, this.text );
    this.loadingSend = true;
    this._chatboot.sendMessage( message ).subscribe({
      next:(value) => {
        this.loadingSend = false;
        if(value.ok){
          this.toast('success', value.msg);
          this.text = '';
          return;
        }
        this.toast('warn', value.msg);
      },
      error:(e) => {
        this.loadingSend = false;
        console.log(e)
        this.messageError(e);
      }
    })
  }

  messageError(e:HttpErrorResponse){
    if(e.status==401) return;
    const msg = e.error.message;
    Array.isArray(msg)?msg.forEach((e) => this.toast('error',e,'Error de validación de datos')):
                                                  this.toast('error',msg,`${e.error.error}:${e.error.statusCode}`)
  }

  toast(type:string, msg:string, detail?:string){
    this._msg.add({severity:type, summary:msg, detail});
  }

}
