import { HttpEvent,
         HttpHandler,
         HttpHeaders,
         HttpInterceptor,
         HttpRequest
        } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokeInterceptorsService implements HttpInterceptor {

  constructor(private _auth:AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this._auth.getToken()}`
    });

    const reqClone = req.clone({
      headers
    });

    return next.handle( reqClone );
  }


}
