import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Message, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-form-login',
  templateUrl: './form-login.component.html',
  styleUrls: ['./form-login.component.scss'],
  providers:[MessageService]
})
export class FormLoginComponent implements OnInit {

  formLogin:FormGroup;
  loading:boolean = false;
  msg: Message[] = [];

  constructor(private fb:FormBuilder,
              private _auth:AuthService,
              private route:Router) {
    this.createForm();
  }

  ngOnInit(): void {
    const storageEmail = this._auth.getStorage('user');
    if(storageEmail){
      this.Email.setValue( storageEmail )
      this.RememberUser.setValue(true);
    }
  }

  createForm(){
    this.formLogin = this.fb.group({
      Email:[null, [Validators.required, Validators.email ]],
      Password:[null, Validators.required],
      RememberUser:[null]
    })
  }

  /* A getters. It is a way to access the value of the form control. */
  get Email(){
    return this.formLogin.controls['Email'];
  }
  get Password(){
    return this.formLogin.controls['Password'];
  }
  get RememberUser(){
    return this.formLogin.controls['RememberUser'];
  }

  login(){
    /** verificamos los inputs del formulario */
    if(this.formLogin.invalid){
      Object.keys(this.formLogin.controls).forEach( input => this.formLogin.controls[input].markAsDirty())
      return
    }
    /** guardar usario si lo requiere */
    if(this.RememberUser.value){
      /** guardar localstorage user */
      this._auth.saveStorage('user', this.Email.value)
    }
    /** consume la api para la authenticación */
    this.loading = true;
    this._auth.login(this.formLogin.value).subscribe({
      next: (res) => {
        setTimeout(()=>{
          this.loading = false;
          if(!res.ok){
            this.message('error','',res.msg);
            return;
          }
          this._auth.saveStorage('token',res.token);
          this.route.navigate(['/system/welcome']);
        },300)
      },
      error: (e) => {
        this.loading = false;
        console.log(e)
      }
    })

  }

  message(type:string, summary:string='', message:string){
    this.msg = [{ severity:type, summary, detail:message}];
    setTimeout(() => {
      this.msg = [];
    }, 2500);
  }

}
