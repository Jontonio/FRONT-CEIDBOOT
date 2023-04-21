import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Router } from "@angular/router";

import { Login } from "../interfaces/login.interface";
import { UserLogin, ResLogin } from "../interfaces/ResLogin";
import { Logout, ResLogout } from '../interfaces/Logout';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public userAuth:UserLogin | undefined;

  constructor( private http:HttpClient, private route:Router){}

  login(data:Login):Observable<ResLogin>{
    return this.http.post<ResLogin>(`${environment.BASE_URL}/auth/login`, data );
  }

  logout(data:Logout){
    return this.http.post<ResLogout>(`${environment.BASE_URL}/auth/logout`, data );
  }

  authenticated():Observable<ResLogin>{
    return this.http.get<ResLogin>(`${environment.BASE_URL}/auth/user-authenticated`);
  }

  saveToken(token:string){
    localStorage.setItem('token',JSON.stringify(token));
  }

  deleteToken(){
    localStorage.removeItem('token');
  }

  getToken():string{
    let token = null;
    if(this.readToken()) token = JSON.parse(localStorage.getItem('token')!);
    return token;
  }

  existsToken(){
    if(this.readToken()){
      console.log('redireccionar a system');
      this.authenticated().subscribe({
        next:(res) => {
          console.log(res);
          this.route.navigate(['/system']);
        },
        error: (err) => console.log(err)
      })
    }else{
      console.log('redirecionar a login');
      this.route.navigate(['/main/auth/login']);
    }
  }

  readToken():boolean{
    return localStorage.getItem('token')?true:false;
  }

}
