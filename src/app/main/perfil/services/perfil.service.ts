import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn:'root'
})
export class PerfilService{

  constructor(private readonly http:HttpClient){}

  updatePerfil(DNI:string, data:any){
    return this.http.patch(`${environment.BASE_URL}/usuario/update-usuario-DNI/${DNI}`, data);
  }

}
