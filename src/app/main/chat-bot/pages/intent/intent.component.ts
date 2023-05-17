import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChabotService } from '../../services/chatbot.service';
import { Intent, Phrase } from '../../class/Intent';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-intent',
  templateUrl: './intent.component.html',
  styleUrls: ['./intent.component.scss']
})
export class IntentComponent implements OnInit {

  uuid:string;
  intent:Intent;
  responseForm:FormGroup;
  lisText:string[] | undefined = [];
  loadingSave:boolean;
  loadingData:boolean;

  constructor(private readonly activeRoute:ActivatedRoute,
              private readonly fb:FormBuilder,
              private readonly _bot:ChabotService,
              private readonly _msg:MessageService) {
    this.createFormResponse();
    this.loadingData = false;
    this.loadingSave = false;
    this.getId(this.activeRoute);
  }

  ngOnInit(): void {
  }

  createFormResponse(){
    this.responseForm = this.fb.group({
      text: this.fb.array([])
    })
  }

  get text() : FormArray {
    return this.responseForm.get("text") as FormArray
  }
  get response(){
    return this.responseForm.get("text.response");
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

  newResponse(value:string=''): FormGroup {
    return this.fb.group({
      response:[value, Validators.required]
    })
  }

  deleteResponse(index:number){
    console.log(index)
    this.text.removeAt(index);
  }

  addResponse(){
    this.text.push(this.newResponse())
  }

  saveResponse(){
    if(this.responseForm.invalid){
      Object.keys( this.responseForm.controls )
            .forEach( input => this.responseForm.controls[ input ].markAsDirty())
            console.log(this.responseForm);
      this.toast('warn','Complete los campos','Los campos agregados o modificados son requeridos')
      return;
    }

    const arrayForm:Phrase[] = this.responseForm.value.text;
    const text:string[] = [];
    arrayForm.forEach( val => text.push(val.response) )

    this.loadingSave = true;
    this._bot.updateOneTxtIntent(this.uuid, { text }).subscribe({
      next: (value) => {
        this.loadingSave = false;
        if(value.ok){
          this.toast('success', value.msg);
          return;
        }
        this.toast('warn', value.msg);
      },
      error: (e) => {
        this.loadingSave = false;
        console.log(e)
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
                                                  this.toast('error', msg,`${e.error.error}:${e.error.statusCode}`)
  }


}
