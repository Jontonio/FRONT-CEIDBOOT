import { AuthService } from '../auth/services/auth.service';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResPerson } from '../class/Person';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  urls = [
    {label:'', icon:'pi pi-home'},
    {label:'Sports'},
    {label:'Football'},
    {label:'Countries'},
  ];

  constructor(private http:HttpClient) {}
  /**
   * Saving the theme in the local storage.
   */
  saveTheme(status:boolean){
    localStorage.setItem('mode-theme', JSON.stringify(status) );
  }

  /**
   * It removes the item from local storage
   */
  deleteTheme(){
    localStorage.removeItem('mode-theme');
  }

  /**
   * If the localStorage item 'mode-theme' exists, return the value of the item, otherwise return false
   * @returns a boolean value.
   */
  existsTheme():boolean{
    if(localStorage.getItem('mode-theme')){
      return JSON.parse(localStorage.getItem('mode-theme')!);
    }
    return false;
  }

  /**
   * It makes a POST request to the server, sending the DNI as a parameter, and returns an Observable
   * of type ResPerson
   * @param {string} DNI - string
   * @returns The response of the request is being returned.
   */
  apiReniec(DNI:string):Observable<ResPerson>{
    return this.http.post<ResPerson>(`${environment.BASE_URL}/usuario/usuario-reniec`, { DNI } );
  }

  parseURL(route:Router){

    let urls = route.url.split('/');

    const nuevo:any[] = [];

    urls.forEach( (item, i) => {

      let icon:string = '';
      let label:string = '';
      label = item.replace('-',' ');

      if(isNaN(parseInt(label))){

        if(i==0) icon = 'pi pi-home'

        const data = { label, icon }

        nuevo.push(data);
      }

    })

    this.urls = nuevo;

  }

}
