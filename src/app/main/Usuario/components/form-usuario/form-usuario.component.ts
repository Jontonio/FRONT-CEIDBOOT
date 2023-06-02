import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Person } from 'src/app/class/Person';
import { Rol } from 'src/app/auth/class/Rol';
import { GlobalService } from 'src/app/services/global.service';
import { Usuario } from '../../class/Usuario';
import { Code } from '../../../grupo/class/Code';
import { MainService } from '../../../services/main.service';
import { optionOperation } from '../../../class/global';
import { UsuarioService } from '../../services/usuario.service';
import { UnAuthorizedService } from 'src/app/services/unauthorized.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-form-usuario',
  templateUrl: './form-usuario.component.html',
  styleUrls: ['./form-usuario.component.scss']
})
export class FormUsuarioComponent {

  /* `@Output() formData = new EventEmitter<optionOperation>();` is creating an output property named
  `formData` that emits an event of type `optionOperation` when its value changes. This output
  property can be used to communicate data from the child component (`FormUsuarioComponent`) to its
  parent component. */
  @Output() formData = new EventEmitter<optionOperation>();
  @Input()  loading:boolean;


  /* These are properties of the `FormUsuarioComponent` class. */
  country:Code;
  FormUsuario:FormGroup;
  Id:number;
  isUpdate:boolean = false;
  loadGetData:boolean = false;
  loadingGetUpdate:boolean = false;
  showValidacion:boolean = false;
  roles:Rol[] = [];
  selecRol:Rol;
  urlLista:string;

  constructor(private route:Router,
              private fb:FormBuilder,
              private activeRouter:ActivatedRoute,
              private _global:GlobalService,
              private _main:MainService,
              private _msg:MessageService,
              private _unAuth:UnAuthorizedService,
              public _usuario:UsuarioService) {

    this.createFormUsuario();
    this.urlLista = '/system/usuarios/lista-usuarios';
    this.inicializateCodes();
    this.getRoles();
    this.getIdUpdate(this.activeRouter);
  }

  /**
   * This function creates a form for user input with various required fields and validation patterns.
   */
  createFormUsuario(): void {
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

  /* These are getter methods that return the corresponding form control from the `FormUsuario` form
  group. They provide a convenient way to access the form controls in the component's template and
  code. For example, in the template, instead of writing `FormUsuario.controls['DNI'].value`, we can
  write `DNI.value` to get the value of the `DNI` form control. This makes the code more readable and
  easier to maintain. */
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

/**
 * This function retrieves roles for a user and handles errors.
 */
  getRoles(): void {
    this._usuario.getRoles().subscribe({
      next: (resp) => this.roles = resp.data,
      error: (e) => {
        this.messageError(e);
        this._unAuth.unAuthResponse(e)
      }
    })
  }

/**
 * This function retrieves data from the RENIEC API based on a given document number and displays a
 * success or warning message depending on the result.
 * @param {string} [documento] - documento is a string parameter that represents a document number,
 * specifically a DNI (Documento Nacional de Identidad) in this case. It is used as input to query the
 * RENIEC (Registro Nacional de Identificación y Estado Civil) database to retrieve personal
 * information associated with the DNI number.
 * @returns If the `documento` parameter is not provided, nothing is returned. If the `documento`
 * parameter has a length of 8 and `this.isUpdate` is false, then the function will make an API call to
 * `apiReniec` and return an observable. Otherwise, nothing is returned.
 */
  Reniec(documento?:string): void {
    if(!documento) return;
    if(documento.length==8 && !this.isUpdate){
      this.loadGetData = true;
      this.DNI.disable();
      this._global.apiReniec(documento).subscribe({
        next: (value) => {
          if(!value.ok){
            this.toast('warn',value.msg,'Datos consultados a RENIEC')
            this.DNI.enable();
            return;
          }
          this.completeData(value.data);
          this.toast('success',value.msg,'Datos consultados a RENIEC')
          this.DNI.enable();
          this.loadGetData = false;
        },
        error: (e) => {
          this.loadGetData = false;
          this.DNI.enable();
          this.messageError(e);
          this._unAuth.unAuthResponse(e);
        }
      })
    }
  }

  /**
   * The function "completeData" sets the values of "Nombres", "ApellidoPaterno", and "ApellidoMaterno"
   * based on the properties of a given "Person" object.
   * @param {Person} person - The parameter "person" is of type "Person", which is likely a custom class
   * or interface that defines properties such as "nombres" (first names), "apellidoPaterno" (paternal
   * last name), and "apellidoMaterno" (maternal last name). The "completeData"
   */
  completeData(person:Person): void {
    this.Nombres.setValue(person.nombres);
    this.ApellidoPaterno.setValue(person.apellidoPaterno);
    this.ApellidoMaterno.setValue(person.apellidoMaterno);
  }

  ready(): void {
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

  returnList(): void {
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
        this.loadingGetUpdate = false;
        this._unAuth.unAuthResponse(e);
        this.messageError(e);
        this.route.navigate([this.urlLista]);
      }
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
      error:(e) => {
        this.messageError(e);
        this._unAuth.unAuthResponse(e);
      }
    })
  }

  selectRole(rol:Rol){
    this.selecRol = rol;
  }

  selectedCountry(country:Code){
    this.country = country;
  }

  messageError(e:HttpErrorResponse){
    if(e.status==401) return;
    const msg = e.error.message;
    Array.isArray(msg)? msg.forEach( (e:string) => this.toast('error',e,'Error de validación de datos')):
                                                   this.toast('error',msg,`${e.error.error}:${e.error.statusCode}`)
  }

  toast(severity:string, summary:string, detail:string=''){
    this._msg.add({severity, summary, detail});
  }

}
