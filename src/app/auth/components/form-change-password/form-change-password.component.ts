import { Component, OnInit, Output, EventEmitter,Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangePassword } from '../../interfaces/ChangePassword';

@Component({
  selector: 'app-form-change-password',
  templateUrl: './form-change-password.component.html',
  styleUrls: ['./form-change-password.component.scss']
})
export class FormChangePasswordComponent implements OnInit {

  @Output() formData = new EventEmitter<ChangePassword>();
  @Input() loadingPassword:boolean;

  formChangePassword:FormGroup;
  seePassword:boolean;
  diferentPassword:boolean;
  uui:string;
  passwordChanged:boolean;

  constructor( private readonly fb:FormBuilder,
              private router:Router,
              private readonly routerActive:ActivatedRoute) {
    this.getUUID(this.routerActive);
    this.createFormChangePassword();
  }

  ngOnInit(): void {
    this.loadingPassword = false;
    this.diferentPassword = false;
    this.seePassword = false;
    this.passwordChanged = false;
  }

  createFormChangePassword(){
    this.formChangePassword = this.fb.group({
      ResetPasswordToken:[null, Validators.required],
      NewPassword:[null, [ Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]{8,}$/)]],
      RepeatPassword:[null, [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]{8,}$/)]]
    })
  }

  getUUID(routerActive:ActivatedRoute){
    const { uui } = routerActive.snapshot.params;
    this.uui = uui;
  }

  /** getters */
  get NewPassword(){
    return this.formChangePassword.controls['NewPassword'];
  }
  get RepeatPassword(){
    return this.formChangePassword.controls['RepeatPassword'];
  }
  get ResetPasswordToken(){
    return this.formChangePassword.controls['ResetPasswordToken'];
  }

  changeInput(data:any){
    console.log(data)
    this.diferentPassword = false;
  }

  ChangePassword(){
    /** inicializar token en el input */
    if(!this.uui){
      this.router.navigate(['/auth/login']);
      return;
    }

    /** asigna el token al input ResetPasswordToken */
    this.ResetPasswordToken.setValue(this.uui);

    /** verifica os campos del formulario */
    if(this.formChangePassword.invalid){
      Object.keys( this.formChangePassword.controls ).forEach( label => this.formChangePassword.controls[ label ].markAsDirty())
      return;
    }

    //TODO validar si las contraseñas son iguales
    const pass1:string = this.NewPassword.value;
    const pass2:string = this.RepeatPassword.value;

    if(pass1.trim()!==pass2.trim()){
      this.diferentPassword = true;
      return;
    }

    this.loadingPassword = true;
    this.diferentPassword = false;

    this.formData.emit( this.formChangePassword.value );
  }

}
