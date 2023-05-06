import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ChangePassword } from '../../interfaces/ChangePassword';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  loadingPassword:boolean;
  changedPassword:boolean;

  constructor( private readonly _auth:AuthService, private readonly router:Router ) { }

  ngOnInit(): void {
    this.loadingPassword = false;
    this.changedPassword = false;
  }

  changePassword(data:ChangePassword){

    this.loadingPassword = true;
    this._auth.changePassword( data )
    .subscribe({
      next: (value) => {
        this.loadingPassword = false;
        if(value.ok){
          this.changedPassword = true;
          return;
        }
        this.router.navigate(['/unauthorized-page']);
      },
      error: (e) => {
        this.loadingPassword = false;
        console.log(e)
      }
    })
  }

}
