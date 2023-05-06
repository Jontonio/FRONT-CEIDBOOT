import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ValidateUserGuard implements CanActivate {

  constructor(private _auth:AuthService, private route:Router){}

  canActivate(): Promise<boolean | UrlTree>{

    return new Promise((resolve) => {

      this._auth.authenticated().subscribe({
        next: (res) => {
          if(!res.ok){
            this._auth.deleteStorage('token');
            resolve(this.route.createUrlTree(['/main/auth/login']));
          }
          this._auth.userAuth = res.user;
          resolve(true);
        },
        error: (e) => {
          this._auth.deleteStorage('token');
          if(e.status==401){
            resolve(this.route.createUrlTree(['/unauthorized-page']))
            return;
          }
          resolve(this.route.createUrlTree(['/main/auth/login']))
        }

      })

    });
  }

}
