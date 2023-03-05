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
  }

  createForm(){
    this.formLogin = this.fb.group({
      Email:['jose@gmail.com', [Validators.required, Validators.email ]],
      Password:[null, Validators.required]
    })
  }

  login(){

    if(this.formLogin.invalid){
      Object.keys(this.formLogin.controls).forEach( input =>{
        this.formLogin.controls[input].markAsDirty()
      })

      return
    };

    this.loading = true;
    this._auth.login(this.formLogin.value).subscribe({
      next: (res) => {

        setTimeout(()=>{
          this.loading = false;
        },500)

        if(!res.ok){
          this.message('error','',res.msg);
          return;
        }

        this._auth.saveToken(res.token);
        this.route.navigate(['/system']);
      },
      error(err) {
        console.log(err);
      },
    })

  }

  /* A getters. It is a way to access the value of the form control. */
  get Email(){
    return this.formLogin.controls['Email'];
  }
  get Password(){
    return this.formLogin.controls['Password'];
  }

  message(type:string, summary:string='', message:string){
    this.msg = [{ severity:type, summary, detail:message}];
    setTimeout(() => {
      this.msg = [];
    }, 2500);
  }

}
