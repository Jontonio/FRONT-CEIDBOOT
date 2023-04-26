import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class HasRoleGuard implements CanActivate {

  constructor(private readonly _auth:AuthService, private router:Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | UrlTree {
      return new Promise((resolve) => {
        const rolesPermitidos:string[] = route.data?.['rolesPermitidos'];
        this._auth.authenticated().subscribe({
          next:(value) => {
            resolve(Boolean(rolesPermitidos.includes(value.user.TipoRol)))
          },
          error:(err) => {
            resolve(false);
            this.router.createUrlTree(['/main/auth/login'])
          }
        })

      })
  }

}
