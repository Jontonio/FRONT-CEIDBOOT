import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isAuth:boolean = false;

  constructor(private _auth:AuthService, private route:Router) {
    this.verificarAuthUsuario();
  }

  verificarAuthUsuario(){

    if(this._auth.readStorage('token')){
      this._auth.authenticated().subscribe({
        next:(res) => {
          this.isAuth = true;
          this.route.navigate(['/system/welcome']);
        },
        error: (e) => {
          this.isAuth = false;
          console.log(e)
        }
      })
    }else{
      this.route.navigate(['/auth/login']);
    }

  }

  ngOnInit(): void {
  }

}
