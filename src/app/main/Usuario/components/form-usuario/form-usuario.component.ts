import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Person } from 'src/app/class/Person';
import { Rol } from 'src/app/class/Rol';
import { GlobalService } from 'src/app/services/global.service';
import { Usuario } from '../../class/Usuario';
import { Code } from '../../../grupo/class/Code';
import { MainService } from '../../../services/main.service';
import { optionOperation } from '../../../class/global';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-form-usuario',
  templateUrl: './form-usuario.component.html',
  styleUrls: ['./form-usuario.component.scss']
})
export class FormUsuarioComponent implements OnInit {

  /** Output and Input variables */
  @Output() formData = new EventEmitter<optionOperation>();
  @Input() loading:boolean;

  /** Variables de clase */
  FormUsuario:FormGroup;
  loadGetData:boolean = false;
  isUpdate:boolean = false;
  selecRol:Rol;

  roles:Rol[];
  Id?:number;
  country:Code;
  urlLista:string;
  loadingGetUpdate:boolean;

  constructor(private route:Router,
              private fb:FormBuilder,
              private activeRouter:ActivatedRoute,
              private _global:GlobalService,
              private _main:MainService,
              public _usuario:UsuarioService,
              private _msg:MessageService) {

    this.createFormUsuario();
    this.urlLista = '/system/usuarios/lista-usuarios';
    this.loadingGetUpdate = false;
  }

  ngOnInit(): void {
    this.inicializateCodes();
    this.getRoles();
    this.getIdUpdate(this.activeRouter);
  }

  createFormUsuario(){

    this.FormUsuario = this.fb.group({
      DNI:[null,[Validators.required,Validators.pattern(/^([0-9])*$/)]],
      Nombres:[null, [Validators.required,Validators.pattern(/^([a-z ñáéíóú]{2,60})$/i)]],
      ApellidoPaterno:[null, [Validators.required,Validators.pattern(/^([a-z ñáéíóú]{2,60})$/i)]],
      ApellidoMaterno:[null, [Validators.required,Validators.pattern(/^([a-z ñáéíóú]{2,60})$/i)]],
      Email:[null, [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      Celular:[null, [Validators.required,Validators.pattern(/^([0-9])*$/)]],
      Direccion:[null, [Validators.required]],
      rol:[null, [Validators.required]]
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
  get rol(){
    return this.FormUsuario.controls['rol'];
  }

  getRoles(){
    this._usuario.getRoles().subscribe({
      next: (resp) => this.roles = resp.data,
      error: (err) => console.log(err)
    })
  }

  Reniec(documento:string=''){

    if(!documento) return;
    if(documento.length==8 && !this.isUpdate){
      this.loadGetData = true;
      this.DNI.disable();
      this._global.apiReniec(documento).subscribe({
        next: (value) => {
          if(!value.ok){
            this.toast('warn',value.msg,'Datos consultados a RENIEC')
            return;
          }
          this.completeData(value.data);
          this.toast('success',value.msg,'Datos consultados a RENIEC')
          this.DNI.enable();
          this.loadGetData = false;
        },
        error: (err) => {
          this.loadGetData = false;
          this.DNI.enable();
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
      Object.keys(this.FormUsuario.controls).forEach( input => this.FormUsuario.controls[input].markAsDirty())
      return;
    }

    this.loading = true;
    const usuario = new Usuario(this.DNI.value,
                                this.Nombres.value,
                                this.ApellidoPaterno.value,
                                this.ApellidoMaterno.value,
                                this.Celular.value,
                                this.Email.value,
                                this.Direccion.value,
                                this.rol.value,
                                this.country.code,
                                this.country.codePhone);
    this.formData.emit({data:usuario, option: this.isUpdate, Id:this.Id });
  }

  returnList(){
    this.FormUsuario.reset();
    this.route.navigate([this.urlLista])
  }

  resetForm(){
    this.FormUsuario.reset();
    this.inicializateCodes();
  }

  inicializateCodes(){
    this.country = { name:'Peru', codePhone:'+51', flag:'https://flagcdn.com/pe.svg', code:'PE'};
  }

  getIdUpdate(activeRouter:ActivatedRoute){
    const { id } = activeRouter.snapshot.params;
    if(!id) return;
    this.Id = id;
    this.isUpdate = true;
    this.loadingGetUpdate = true;
    this._usuario.getUsuario(id).subscribe({
      next: (resp) => {
        this.loadingGetUpdate = false;
        if(!resp.ok) return;
        this.completeDataUpdate(resp.data as Usuario);
      },
      error: (e) => {
        console.log(e);
        this.loadingGetUpdate = false;
        this.route.navigate([this.urlLista]);
        this.messageError(e);
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
    this.rol.setValue(usuario.rol);
    this.getOneCountryCode(usuario.Code);
    this.selecRol = usuario.rol;
  }

  getOneCountryCode(code:string){
    this._main.getOneCountryByCode(code).subscribe({
      next: (resp) => {
        if(resp.length!=0) this.country = resp[0];
      },
      error:(err) => console.log(err)
    })
  }

  selectRole(rol:Rol){
    this.selecRol = rol;
  }

  selectedCountry(country:Code){
    this.country = country;
  }

  messageError(e:any){
    const msg = e.error.message;
    Array.isArray(msg)? msg.forEach( (e:string) => this.toast('error',e,'Error de validación de datos')):
                                                   this.toast('error',msg,`${e.error.error}:${e.error.statusCode}`)
  }

  toast(severity:string, summary:string, detail:string=''){
    this._msg.add({severity, summary, detail});
  }

}
