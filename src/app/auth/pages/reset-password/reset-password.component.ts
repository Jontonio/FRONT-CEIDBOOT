import { Component, OnInit } from '@angular/core';
import { DataRecovery } from '../../class/global';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  loading:boolean;
  isSendEmail:boolean;

  constructor(private readonly _auth:AuthService, private _msg:MessageService) { }

  ngOnInit(): void {
    this.loading = false;
    this.isSendEmail = false;
  }

  sendEmail(data:DataRecovery){
    this.loading = true;
    this._msg.clear();
    this._auth.resetPassword(data)
    .subscribe({
      next: (resp) => {
        this.loading = false;
        if(resp.ok){
          this.isSendEmail = true;
          return;
        }
        this.toast('warn', resp.msg);
      },
      error: (e) => {
        this.loading = false;
        console.log(e)
      }
    })
  }

  toast(severity:string, summary:string, detail:string=''){
    this._msg.add({severity, summary, detail, key:'message-reset-password'});
  }

  messageError(e:HttpErrorResponse){
    if(e.status==401) return;
    const msg = e.error.message;
    Array.isArray(msg)? msg.forEach( (e:string) => this.toast('error',e,'Error de validación de datos')):
                                                   this.toast('error',msg,`${e.error.error}:${e.error.statusCode}`)
  }

}
