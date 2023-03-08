import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Person } from 'src/app/class/Person';
import { Rol } from 'src/app/class/Rol';
import { GlobalService } from 'src/app/services/global.service';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario, optionOperation} from '../../class/Usuario';
import { Code } from '../../class/Code';
import { MainService } from '../../services/main.service';

@Component({
  selector: 'app-form-usuario',
  templateUrl: './form-usuario.component.html',
  styleUrls: ['./form-usuario.component.scss']
})
export class FormUsuarioComponent implements OnInit {

  @Output() formData = new EventEmitter<optionOperation>();
  @Input() loadding:boolean;
  @Output() tipoOp = new EventEmitter<boolean>();

  FormUsuario:FormGroup;
  loadGetData:boolean = false;
  listRoles:Rol[] = [];
  isUpdate:boolean = false;
  Id?:number;
  country:Code;

  constructor(private route:Router,
              private fb:FormBuilder,
              private activeRouter:ActivatedRoute,
              private _global:GlobalService,
              private _main:MainService,
              public _usuario:UsuarioService,
              private _msg:MessageService) {

    this.createFormUsuario();

  }

  ngOnInit(): void {

    this.country = { name:'Peru', codePhone:'+51', flag:'https://flagcdn.com/pe.svg', code:'PE'};

    this.getRoles();
    this.getIdUpdate(this.activeRouter);

  }

  createFormUsuario(){

    this.FormUsuario = this.fb.group({
      DNI:[null,[Validators.required,Validators.pattern(/^([0-9])*$/)]],
      Nombres:[null, [Validators.required,Validators.pattern(/^([a-z ñáéíóú]{2,60})$/i)]],
      ApellidoPaterno:[null, [Validators.required,Validators.pattern(/^([a-z ñáéíóú]{2,60})$/i)]],
      ApellidoMaterno:[null, [Validators.required,Validators.pattern(/^([a-z ñáéíóú]{2,60})$/i)]],
      Email:[null, [Validators.required,Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      Celular:[null, [Validators.required,Validators.pattern(/^([0-9])*$/)]],
      Direccion:[null, [Validators.required]],
      IdRol:[null, [Validators.required, Validators.pattern(/^([0-9])*$/)]]
    })
  }

  /** Getters */
  get DNI(){
    return this.FormUsuario.controls['DNI'];
  }
  get Nombres(){
    return this.FormUsuario.controls['Nombres'];
  }
  get ApellidoPaterno(){
    return this.FormUsuario.controls['ApellidoPaterno'];
  }
  get ApellidoMaterno(){
    return this.FormUsuario.controls['ApellidoMaterno'];
  }
  get Email(){
    return this.FormUsuario.controls['Email'];
  }
  get Celular(){
    return this.FormUsuario.controls['Celular'];
  }
  get Direccion(){
    return this.FormUsuario.controls['Direccion'];
  }
  get Password(){
    return this.FormUsuario.controls['Password'];
  }
  get IdRol(){
    return this.FormUsuario.controls['IdRol'];
  }

  getRoles(){

    this._usuario.getRoles().subscribe({

      next: (resp) => {
        this.listRoles = resp.data;
      },
      error: (err) => {
        console.log(err);
      },

    })

  }

  Reniec(documento:string=''){

    if(!documento) return;

    if(documento.length==8 && !this.isUpdate){

      this.loadGetData = true;
      this._global.apiReniec(documento).subscribe({
        next: (value) => {
          if(value.ok){
            console.log(value);
            this.completeData(value.data);
            this.toast('success',value.msg,'Datos consultados a RENIEC')
          }else{
            console.log(value.msg);
            this.toast('warn',value.msg,'Datos consultados a RENIEC')
          }
          this.loadGetData = false;
        },
        error: (err) => {
          this.loadGetData = false;
          console.log(err);
        }
      })
    }
  }

  completeData(person:Person){
    this.Nombres.setValue(person.nombres);
    this.ApellidoPaterno.setValue(person.apellidoPaterno);
    this.ApellidoMaterno.setValue(person.apellidoMaterno);
  }

  ready(){

    if(this.FormUsuario.invalid){
      Object.keys(this.FormUsuario.controls).forEach( input => {
        this.FormUsuario.controls[input].markAsDirty();
      });
      return;
    }

    this.loadding = true;

    const usuario = new Usuario(this.DNI.value,
                                this.Nombres.value,
                                this.ApellidoPaterno.value,
                                this.ApellidoMaterno.value,
                                this.Celular.value,
                                this.Email.value,
                                this.Direccion.value,
                                { Id: this.IdRol.value },
                                this.country.code,
                                this.country.codePhone);

    this.formData.emit({data:usuario, option: this.isUpdate, Id:this.Id });
  }

  reset(){
    this.route.navigate(['/system/usuarios/lista-usuarios'])
    this.FormUsuario.reset();
  }

  getIdUpdate(activeRouter:ActivatedRoute){

    const { id } = activeRouter.snapshot.params;

    if(!id) return;

    this.Id = id;
    this.isUpdate = true;

    this._usuario.getUsuario(id).subscribe({
      next: (resp) => {

        if(resp.ok){
          console.log(resp)
          this.completeDataUpdate(resp.data);
        }
      },
      error: (err) => {
        console.log(err);
      },
    })

  }

  completeDataUpdate(usuario:Usuario){
    this.DNI.disable();
    this.Nombres.disable();
    this.ApellidoMaterno.disable()
    this.ApellidoPaterno.disable();

    this.DNI.setValue(usuario.DNI);
    this.Nombres.setValue(usuario.Nombres);
    this.ApellidoPaterno.setValue(usuario.ApellidoPaterno);
    this.ApellidoMaterno.setValue(usuario.ApellidoMaterno);
    this.Celular.setValue(usuario.Celular);
    this.Direccion.setValue(usuario.Direccion);
    this.Email.setValue(usuario.Email);
    this.IdRol.setValue(usuario.rol.Id);
    this.getOneCountryCode(usuario.Code);
  }

  getOneCountryCode(code:string){

    this._main.getOneCountryByCode(code).then( resp => {

      if(resp.length!=0){
        this.country = resp[0];
      }

    }).catch( err => {
      console.log(err);
    })
  }

  selectedCountry(country:Code){
    this.country = country;
  }

  toast(type:string, msg:string, detail:string=''){
    this._msg.add({severity:type, summary:msg, detail});
  }

}
