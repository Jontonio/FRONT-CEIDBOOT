import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Router } from "@angular/router";

import { Login } from "../interfaces/login.interface";
import { UserLogin, ResLogin } from "../interfaces/ResLogin";
import { Logout, ResLogout } from '../interfaces/Logout';
import { DataRecovery } from '../class/global';
import { ResResetPassword } from '../interfaces/ResResetPassword';
import { ResChangePassword } from '../interfaces/ResChangePassword';

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

  resetPassword(data:DataRecovery){
    return this.http.patch<ResResetPassword>(`${environment.BASE_URL}/auth/reset-password`, data );
  }

  changePassword(data:any){
    return this.http.patch<ResChangePassword>(`${environment.BASE_URL}/auth/change-password`, data );
  }

  authenticated():Observable<ResLogin>{
    return this.http.get<ResLogin>(`${environment.BASE_URL}/auth/user-authenticated`);
  }

  saveStorage(name:string, data:string){
    localStorage.setItem(name, JSON.stringify(data));
  }

  deleteStorage(name:string){
    localStorage.removeItem( name );
  }

  getStorage(name:string):string{
    return this.readStorage(name)?JSON.parse(localStorage.getItem( name )!):null;
  }

  existsToken(){
    if(this.readStorage('token')){
      this.authenticated().subscribe({
        next:(res) => {
          console.log(res);
          this.route.navigate(['/system/welcome']);
        },
        error: (err) => console.log(err)
      })
    }else{
      console.log('redirecionar a login');
      this.route.navigate(['/auth/login']);
    }
  }

  readStorage( name:string ):boolean{
    return localStorage.getItem( name )?true:false;
  }

}
