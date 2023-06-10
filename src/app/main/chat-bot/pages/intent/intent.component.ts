import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChabotService } from '../../services/chatbot.service';
import { Intent, Phrase } from '../../class/Intent';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Description_media, Link, Media, Message, PayloadBoot } from '../../class/PayloadBot';

@Component({
  selector: 'app-intent',
  templateUrl: './intent.component.html',
  styleUrls: ['./intent.component.scss']
})
export class IntentComponent {

  uuid:string;
  intent:Intent;
  responseForm:FormGroup;
  payloadForm:FormGroup;
  lisText:string[] | undefined = [];
  loadingSavePhrase:boolean;
  loadingSavePayload:boolean;
  loadingData:boolean;

  constructor(private readonly activeRoute:ActivatedRoute,
              private readonly fb:FormBuilder,
              private readonly _bot:ChabotService,
              private readonly _msg:MessageService) {
    this.createFormResponse();
    this.createFormPayload();
    this.loadingData = false;
    this.loadingSavePhrase = false;
    this.loadingSavePayload = false;
    this.getId(this.activeRoute);
  }

  createFormResponse(){
    this.responseForm = this.fb.group({
      text: this.fb.array([])
    })
  }

  createFormPayload(){
    this.payloadForm = this.fb.group({
      description_media:[null],
      link:[null, [Validators.pattern(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/)]],
      media:[null, [Validators.pattern('^https?:\\/\\/.*\\.(jpe?g|png|gif|bmp)(\\?.*)?$')]],
      message:[null],
    })
  }

  get text() : FormArray {
    return this.responseForm.get("text") as FormArray
  }
  get response(){
    return this.responseForm.get("text.response");
  }

  get description_media(){
    return this.payloadForm.controls['description_media'];
  }
  get link(){
    return this.payloadForm.controls['link'];
  }
  get media(){
    return this.payloadForm.controls['media'];
  }
  get message(){
    return this.payloadForm.controls['message'];
  }

  imageLinkValidator(control: FormControl): { [key: string]: any } | null {
    const regex: RegExp = /\.(jpg|png)$/i;
    const valid = regex.test(control.value);
    return valid ? null : { invalidImageLink: true };
  }

  getId(activeRoute:ActivatedRoute){
    activeRoute.params.subscribe(({
      next:(value) => {
        if(value){
          const { uuid } = value;
          this.uuid = uuid;
          this.getOneIntent(this.uuid);
        }
      },
      error:(e) => {
        console.log(e)
      }
    }))
  }

  getOneIntent(uuid:string){
    this.loadingData = true;
    this._bot.getOneIntent(uuid).subscribe({
      next:(value) => {
        this.loadingData = false;
        if(value.ok){
          this.intent = value.data as Intent;
          this.intent.messages.forEach( data => {
            if(data.message=='text'){
              this.lisText = data.text?.text;
              this.completeText(this.lisText)
            }
            if(data.message=='payload'){
              const { fields } = data.payload as any;
              this.completePayload(fields);
            }
          })
          return;
        }
        this.toast('warn', value.msg);
      },
      error:(e) => {
        console.log(e)
        this.loadingData = false;
        this.messageError(e);
      }
    })
  }

  completeText(value:string[] = []){
    value.forEach( val => {
      this.text.push(this.newResponse(val))
    })
  }

  completePayload(payload:PayloadBoot){
    this.message.setValue(payload.message.stringValue);
    this.description_media.setValue(payload.description_media.stringValue);
    this.link.setValue(payload.link.stringValue);
    this.media.setValue(payload.media.stringValue);
  }

  newResponse(value:string=''): FormGroup {
    return this.fb.group({
      response:[value, Validators.required]
    })
  }

  deleteResponse(index:number){
    this.text.removeAt(index);
  }

  addResponse(){
    this.text.push(this.newResponse())
  }

  saveResponse(){
    if(this.responseForm.invalid){
      Object.keys( this.responseForm.controls )
            .forEach( input => this.responseForm.controls[ input ].markAsDirty())
      this.toast('warn','Complete los campos','Los campos agregados o modificados son requeridos')
      return;
    }

    const arrayForm:Phrase[] = this.responseForm.value.text;
    const text:string[] = [];
    arrayForm.forEach( val => text.push(val.response) )

    if(text.length==0){
      this.toast('warn','Es necesario al menos un campo','Los campos agregados o modificados son requeridos')
      return;
    }

    this.loadingSavePhrase = true;
    this._bot.updateOneTxtIntent(this.uuid, { text }).subscribe({
      next: (value) => {
        this.loadingSavePhrase = false;
        if(value.ok){
          this.toast('success', value.msg);
          return;
        }
        this.toast('warn', value.msg);
      },
      error: (e) => {
        this.loadingSavePhrase = false;
        console.log(e)
        this.messageError(e);
      }
    })
  }

  savePayload(){
    if(this.payloadForm.invalid){
      Object.keys( this.payloadForm.controls )
            .forEach( input => this.responseForm.controls[ input ].markAsDirty())
      return;
    }
    this.loadingSavePayload = true;
    const payload = new PayloadBoot(new Message(this.message.value),
                                    new Media(this.media.value),
                                    new Link(this.link.value),
                                    new Description_media(this.description_media.value))
    this._bot.updateOnePayloadIntent(this.uuid, payload).subscribe({
      next: (value) => {
        this.loadingSavePayload = false
        if(value.ok){
          this.toast('success', value.msg);
          return;
        }
        this.toast('warn', value.msg);
      },
      error: (e) => {
        console.log(e)
        this.loadingSavePayload = false
        this.messageError(e);
      }
    })
  }

  toast(severity:string, summary:string, detail:string=''){
    this._msg.add({severity, summary, detail});
  }

  messageError(e:any){
    const msg = e.error.message;
    Array.isArray(msg)?msg.forEach( (e:string) => this.toast('error', e, 'Error de validación de datos')):
                                                  this.toast('error', msg,`${e.error.error}:${e.error.statusCode}`);
  }


}
