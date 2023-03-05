import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ValidateUserGuard implements CanActivate {

  constructor(private _auth:AuthService, private route:Router){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean>{

    return new Promise((resolve, reject) => {

      this._auth.authenticated().subscribe({

        next: (res) => {

          if(res.ok){
            this._auth.userAuth = res.user;
            resolve(true);
          }else{
            this.route.navigate(['/main/auth/login']);
            this._auth.deleteToken();
            resolve(false)
          }

        },
        error: (err) => {
          this._auth.deleteToken();
          this.route.navigate(['/main/auth/login']);
          reject(err);
        }

      })

    });
  }

}
