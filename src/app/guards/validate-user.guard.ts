import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ValidateUserGuard implements CanActivate {

  constructor(private _auth:AuthService, private route:Router){}

  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot): Promise<boolean>{
    return new Promise((resolve, reject) => {
      this._auth.authenticated().subscribe({
        next: (res) => {
          if(!res.ok){
            this.route.navigate(['/main/auth/login']);
            this._auth.deleteToken();
            resolve(false)
          }
          resolve(true);
        },
        error: (err) => {
          this._auth.deleteToken();
          this.route.navigate(['/main/auth/login']);
          resolve(true);
        }
      })
    });
  }

}
