import { HttpErrorResponse, HttpEvent,
         HttpHandler,
         HttpHeaders,
         HttpInterceptor,
         HttpRequest
        } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UnAuthorizedService } from '../services/unauthorized.service';


@Injectable({
  providedIn: 'root'
})
export class TokeInterceptorsService implements HttpInterceptor {

  listURLs:string[] = []; //list exclude URLs
  BASE_URL:string;

  constructor(private _auth:AuthService, private _unAuth:UnAuthorizedService) {
    this.BASE_URL = environment.BASE_URL;
    this.initExcludeURLs();
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    //TODO: exclude urls with not need token
    if(req.url.startsWith(this.listURLs[0]) || req.url.startsWith(this.listURLs[1])){
      return next.handle(req);
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this._auth.getStorage('token')}`
    });

    const reqClone = req.clone({
      headers
    });

    return next.handle(reqClone).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage: string = 'Error personalizado';

        if (error.status === 401) {
          this._unAuth.unAuthResponse(error);
        }
        return throwError(() => error);
      })
    ) as Observable<HttpEvent<any>>;
  }

  initExcludeURLs(){
    this.listURLs = [
      `${this.BASE_URL}/matricula/upload-file`,
      `${this.BASE_URL}/estudiante-en-grupo/register-estudiante-from-matricula`
    ]
  }


}
