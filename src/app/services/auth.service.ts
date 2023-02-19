import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { environment } from 'src/environments/environment';
import { JsonFormatter } from "tslint/lib/formatters";
import { Login } from "../auth/interfaces/login.interface";
import { ResLogin } from "../auth/interfaces/ResLogin";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  URL = environment.BASE_URL;

  constructor(private http:HttpClient, private route:Router){}

  login(data:Login):Observable<ResLogin>{
    return this.http.post<ResLogin>(`${environment.BASE_URL}/auth/login`, data );
  }

  logout(){

    if(this.readToken()){
      this.deleteToken();
    }
    this.route.navigate(['/main/auth/login']);
  }

  authenticated():Observable<ResLogin>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}`
    });

    return this.http.get<ResLogin>(`${environment.BASE_URL}/auth/user-authenticated`,{ headers });
  }

  saveToken(token:string){
    localStorage.setItem('token',JSON.stringify(token));
  }

  deleteToken(){
    localStorage.removeItem('token');
  }

  getToken():string{
    let token = '';
    if(this.readToken()){
      token = JSON.parse(localStorage.getItem('token')!);
    }
    return token;
  }

  existsToken(){

    if(this.readToken()){
      //TODO: redireccionar a system
      console.log('redireccionar a system');
      this.authenticated().subscribe({
        next:(res) => {
          console.log(res);
          this.route.navigate(['/system']);
        },
        error: (err) => {
          console.log(err);
        }
      })
    }else{
      //TODO: redirecionar a login
      console.log('redirecionar a login');
      this.route.navigate(['/main/auth/login']);
    }
  }

  readToken():boolean{
    return localStorage.getItem('token')?true:false;
  }

}
